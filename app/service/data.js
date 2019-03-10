const Service = require('egg').Service;
const _ = require('lodash');
class DataService extends Service {
  // create======================================================================================================>;
  async create(table,payload) {
    const { ctx, service } = this;
    //payload.password = await this.ctx.genHash(payload.password);
    const result = await this.app.mysql.insert(table, payload);
    return result.affectedRows;
  }

  // destroy======================================================================================================>  ;
  async destroy(_table, _id) {
    const { ctx, service } = this;
    const data = {id:_id, IsValid:0};
    const result = await this.app.mysql.update(_table, data);
    return result.affectedRows;
  }

  // update======================================================================================================>;
  async update(_table, _id, payload) {
    const { ctx, service } = this;
    const data = await ctx.service.data.show(_table,_id);
    if (!data) {
      ctx.throw(404, 'data not found');
    }
    payload['id'] = _id;
    const result = await this.app.mysql.update(_table, payload);
    return result.affectedRows;
  }

  // get all table;
  async table(_table){
    const { ctx, service } = this;
    const results = await this.app.mysql.select(_table,{IsValid:1});
    return results;
  }

  // show======================================================================================================>;
  async show(_table, _id) {
    const data = await this.app.mysql.get(_table, { id: _id });
    if (!data) {
      this.ctx.throw(404, 'data not found');
    }
    return data;
  }

  // list======================================================================================================>;
  async list(_table, _payload) {
    _payload['IsValid'] = 1;
    const data = await this.app.mysql.get(_table, _payload);
    if (!data) {
      this.ctx.throw(404, 'data not found');
    }
    return data;
  }
  // list page======================================================================================================>;
  async listpage(_table, _payload) {
    const { ctx, service } = this;
    const { paras, andor,ps,pi } = _payload;
    const [raw, values] = await ctx.service.data.parameters(paras,andor);
    const sql = `select * from ${_table} where ${raw} limit ${ps*(pi-1)},${ps}`;

    const data = await this.app.mysql.query(sql, values);
    if (!data) {
      this.ctx.throw(404, 'data not found');
    }
    const count = await ctx.service.data.datacount(_table);
    const datacount = _.size(count);
    return { count: datacount, list: data };
  }

  // datacount======================================================================================================>  ;
  async datacount(_table) {
    const { ctx, service } = this;
    const result = await this.app.mysql.query(`select id from ${_table} where IsValid=1`);
    return result;
  }

  // removes======================================================================================================>  ;
  async removes(_table, _id) {
    const { ctx, service } = this;
    const result = await this.app.mysql.update(_table,{id:_id,IsValid:0});
    return result.affectedRows;
  }

  // index======================================================================================================>;
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload;
    let res = [];
    let count = 0;
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10);
    if(isPaging) {
      if(search) {
        res = await this.ctx.model.User.find({mobile: { $regex: search } }).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({}).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec();
        count = await this.ctx.model.User.count({}).exec();
      }
    } else {
      if(search) {
        res = await this.ctx.model.User.find({mobile: { $regex: search } }).sort({ createdAt: -1 }).exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({}).sort({ createdAt: -1 }).exec();
        count = await this.ctx.model.User.count({}).exec();
      }
    }
    // 整理数据源 -> Ant Design Pro;
    let data = res.map((e,i) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.key = i;
      jsonObject.password = 'Are you ok?';
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt);
      return jsonObject;
    });

    return { count: count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) };
  }  

  //解析参数;
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
          keysql.push(`${k} like ?`);
        }
        values.push(paras[k]);
      }
    });
  
    const raw = _.size(keysql)>0 ? `(${_.join(keysql, ` ${andor} `)})`:'';
    return [raw, values];
  }
}

module.exports = DataService;