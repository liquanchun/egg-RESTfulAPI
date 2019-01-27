const Service = require('egg').Service
const config = require('../../config/env').knex
const knex = require('knex')(config)

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
      like,
      andor
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, like, andor)

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
      like,
      andor,
      ps,
      pi
    } = _payload
    if (paras) {
      const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, like, andor)

      let res = null
      let total = 0
      if (wherekey) {
        res = await knex.select('*')
          .from(_table)
          .where('IsValid', 1)
          .whereRaw(wherekey, wherevalue)
          .limit(ps)
          .offset((pi - 1) * ps)

        let cnt = await this.ctx.service.knex.dataCountWhere(_table,wherekey,wherevalue)
        total = cnt[0].a
      } else {
        res = await knex.select('*')
          .from(_table)
          .where('IsValid', 1)
          .limit(ps)
          .offset((pi - 1) * ps)

        let cnt = await this.ctx.service.knex.dataCount(_table)
        total = cnt[0].a
      }

      return {res,total}
    } else {
      const res = await knex.select('*')
        .from(_table)
        .where('IsValid', 1)
        .limit(ps)
        .offset((pi - 1) * ps)

      let cnt = await this.ctx.service.knex.dataCount(_table)
      let total = cnt[0].a
      return {res,total}
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

  async dataCountWhere(_table,_wherekey,_wherevalue) {
    const results = knex(_table).where('IsValid', 1).whereRaw(_wherekey, _wherevalue).count('id as a')
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
      like,
      andor,
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, like, andor)

    const results = wherekey ? knex(_table).whereRaw(wherekey, wherevalue).update('IsValid', 0) :
      knex(_table).update('IsValid', 0)
    return results
  }

  async deleteByWhereAll(_table, _payload) {
    const {
      paras,
      like,
      andor,
    } = _payload
    const [wherekey, wherevalue] = await this.ctx.service.knex.parameters(paras, like, andor)

    const results = knex(_table).whereRaw(wherekey, wherevalue).del()
    return results
  }

  async parameters(paras, like = '', andor = 'and') {
    const keys = _.keys(paras);
    const keyword = [];
    const keysql = [];
    const values = [];
    keys.forEach((k) => {
      if (paras[k] != null && paras[k] != undefined) {
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
          if (like) {
            keysql.push(`${k} like ?`);
          } else {
            keysql.push(`${k} = ?`);
          }
        }
        if (like) {
          values.push('%' + paras[k] + '%');
        } else {
          values.push(paras[k]);
        }
      }
    });

    const raw = _.size(keysql) > 0 ? `(${_.join(keysql, ` ${andor} `)})` : '';
    return [raw, values];
  }

}

module.exports = KnexService