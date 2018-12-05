const Service = require('egg').Service
const knex = require('../extend/knex')
const _ = require('lodash')
class KnexService extends Service {
  // get all table
  async tableList() {
    const results = await knex.raw('select table_name,table_comment from information_schema.tables where table_schema=? and table_type=?', ['car_app', 'base table'])
    return results[0]
  }

  async columnList(_table) {
    const results = await knex.raw('select column_name,data_type,column_comment from information_schema.columns where table_schema=? and table_name=?', ['car_app', _table])
    return results[0]
  }
  // get all table
  async data(_table) {
    const results = await knex(_table).where('IsValid', 1).select(`${_table}.*`)
    return results
  }

  async dataByPara(_table, keyname, keyvalue) {
    const results = await knex(_table).where('IsValid', 1).where(keyname, keyvalue);
    return results
  }

  async dataByWhere(_table, _payload) {
    const {
      paras,
      andor,
      ps,
      pi
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, andor)

    const results = wherekey ? await knex(_table).where('IsValid', 1).whereRaw(wherekey, wherevalue) :
      await knex(_table).where('IsValid', 1)

    return results
  }

  async dataListPage(_table, _payload) {
    const {
      _ps,
      _pi
    } = _payload
    const results = await knex.select('*')
      .from(_table)
      .where('IsValid', 1)
      .limit(_ps)
      .offset((_pi - 1) * _ps)
    return results
  }

  async dataListParaPage(_table, keyname, keyvalue, _ps, _pi) {
    const results = await knex.select('*')
      .from(_table)
      .where('IsValid', 1)
      .where(keyname, keyvalue)
      .limit(_ps)
      .offset((_pi - 1) * _ps)
    return results
  }

  async dataListWherePage(_table, _payload) {
    const {
      paras,
      andor,
      ps,
      pi
    } = _payload
    if (paras) {
      const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, andor)
      console.log(pi);
      console.log(ps);
      console.log(wherekey);
      console.log(wherevalue);

      let results = null
      if (wherekey) {
        results = await knex.select('*')
          .from(_table)
          .where('IsValid', 1)
          .whereRaw(wherekey, wherevalue)
          .limit(ps)
          .offset((pi - 1) * ps)
      } else {
        results = await knex.select('*')
          .from(_table)
          .where('IsValid', 1)
          .limit(ps)
          .offset((pi - 1) * ps)
      }

      return results
    } else {
      const results = await knex.select('*')
        .from(_table)
        .where('IsValid', 1)
        .limit(ps)
        .offset((pi - 1) * ps)
      return results
    }
  }

  async updateData(_table, data) {
    const results = knex(_table).returning('id')
      .where('Id', data.Id)
      .update(data)
    return results
  }

  async addData(_table, data) {
    const results = knex.returning('id').insert([data], 'id').into(_table)
    return results
  }

  async firstData(_table, id) {
    const results = knex(_table).where('Id', id).first()
    return results
  }

  async dataCount(_table) {
    const results = knex(_table).where('IsValid', 1).count('id as a')
    return results
  }

  async maxid(_table) {
    const results = knex(_table).max('id as a')
    return results
  }

  async deleteData(_table, id) {
    const results = knex(_table).where('Id', id).update('IsValid', 0)
    return results
  }

  async deleteDataAll(_table, id) {
    const results = knex(_table).where('Id', id).del()
    return results
  }

  async deleteByPara(_table, keyname, keyvalue) {

    const results = knex(_table).where(keyname, keyvalue).update('IsValid', 0)
    return results
  }

  async deleteByParaAll(_table, keyname, keyvalue) {
    const results = knex(_table).where(keyname, keyvalue).del()
    return results
  }

  async deleteByWhere(_table, _payload) {
    const {
      paras,
      andor
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, andor)

    const results = wherekey ? knex(_table).whereRaw(wherekey, wherevalue).update('IsValid', 0):
                               knex(_table).update('IsValid', 0)
    return results
  }

  async deleteByWhereAll(_table, _payload) {
    const {
      paras,
      andor
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, andor)

    const results = knex(_table).whereRaw(wherekey, wherevalue).del()
    return results
  }

  async parameters(paras, andor = 'and') {
    const keys = _.keys(paras);
    const keyword = [];
    const keysql = [];
    const values = [];
    keys.forEach((k) => {
      if (paras[k]) {
        if (k.includes('-')) {
          const kw = k.split('-')[0];
          if (keyword.includes(kw)) {
            keysql.push(`${k.split('-')[0]} <= ?`);
          } else {
            keysql.push(`${k.split('-')[0]} >= ?`);
          }
          keyword.push(kw);
        } else {
          keyword.push(k);
          // keysql.push(`${k} like ?`);
          keysql.push(`${k} = ?`);
        }
        values.push(paras[k]);
      }
    });

    const raw = _.size(keysql) > 0 ? `(${_.join(keysql, ` ${andor} `)})` : '';
    return [raw, values];
  }

}

module.exports = KnexService