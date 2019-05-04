const Controller = require('egg').Controller;
const moment = require('moment');
const _ = require('lodash');
class CheckinController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  async createCheckin() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try {
      let newbody = this.ctx.helper.newBody(payload);
      // 预计退房时间
      newbody.checkouttime = moment().add(newbody.days,'days').format('YYYY-MM-DD HH:mm:ss');
      const res = await conn.insert(
        'bus_checkin',
        newbody
      );
      
      // 第一步操作
      const res2 = await conn.update('hou_houseinfo', {
        id: payload.houseid,
        Status: '住人'
      });
      const res3 = await conn.insert('hou_housestatus', {
        HouseId: payload.houseid,
        OldStatus: '空净',
        NewStatus: '住人'
      });

      if (payload.bookid) {
        const res4 = await conn.update('bus_booking', {
          id: payload.bookid,
          Status: '订单'
        });
      }
      // await conn.update(table, row2);  // 第二步操作
      await conn.commit(); // 提交事务

      // 设置响应内容和响应状态码
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }
  // 结算
  async createCheckout() {
    const { ctx, service } = this;
    // 组装参数
    const {order,goods} = ctx.request.body || {};
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try {
      const res = await conn.update('bus_checkin', {
        id: order.Id,
        Status: '已结算',
        Settle: order.Settle,
        SettleMan: order.SettleMan,
        SettlePayType: order.SettlePayType,
        SettleTime: moment().format('YYYY-MM-DD HH:mm:ss')
      }); // 第一步操作
      const res2 = await conn.update('hou_houseinfo', {
        id: order.HouseId,
        Status: '空脏'
      });
      const res3 = await conn.insert('hou_housestatus', {
        HouseId: order.HouseId,
        CheckinId: order.Id,
        OldStatus: '住人',
        NewStatus: '空脏'
      });
      // await conn.update(table, row2);  // 第二步操作
      if(goods && goods.length > 0){
        for (let index = 0; index < goods.length; index++) {
          let data = _.pick(goods[index], ['Price', 'Amount', 'Num', 'CreatedBy']);
          data['GoodsId'] = goods[index]['Id'];
          data['CheckinId'] = order.Id;
          await conn.insert('bus_settlegoods',data);
          await this.app.mysql.query('update hou_house_goods set blance = blance - ? where isValid = 1 and houseid = ? and goodsid = ? ', [data['Num'], order.HouseId , data['goodsId']]);
        }
      }
      await conn.commit(); // 提交事务

      // 设置响应内容和响应状态码
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }

  // 取消订单
  async cancelOrder() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try {
      const res = await conn.update('bus_checkin', {
        id: payload.id,
        Status: '取消',
        remark:payload.remark
      }); // 第一步操作
      const res2 = await conn.update('hou_houseinfo', {
        id: payload.houseid,
        Status: '空净'
      });
      const res3 = await conn.insert('hou_housestatus', {
        HouseId: payload.houseid,
        checkinid: payload.id,
        OldStatus: '住人',
        NewStatus: '空净',
        remark: `取消，原因：${payload.remark}`,
        createdby: payload.createdby
      });

      await conn.commit(); // 提交事务
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }
  // 换房
  async changeHouse() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try {
      const res = await conn.update('bus_checkin', {
        id: payload.checkid,
        houseId: payload.newhouseid
      });

      const res2 = await conn.update('hou_houseinfo', {
        id: payload.oldhouseid,
        Status: payload.status
      });

      const res5 = await conn.update('hou_houseinfo', {
        id: payload.newhouseid,
        Status: '住人'
      });

      const res3 = await conn.insert('hou_housestatus', {
        HouseId: payload.oldhouseid,
        checkinid: payload.chenkid,
        OldStatus: '住人',
        NewStatus: payload.status,
        remark: `换房，原房号${payload.oldhouseno}`,
        createdby: payload.createdby
      });

      const res4 = await conn.insert('hou_housestatus', {
        HouseId: payload.newhouseid,
        checkinid: payload.chenkid,
        OldStatus: '空净',
        NewStatus: '住人',
        remark: `换房，原房号${payload.oldhouseno}`,
        createdby: payload.createdby
      });
      await conn.commit(); // 提交事务
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback();
      throw err;
    }
  }
  // 订单续住
  async orderAdddays() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try {
      // 修改预计结算时间
      const res = await this.app.mysql.query('update bus_checkin set checkouttime = DATE_ADD(checkouttime,INTERVAL ? day) where id = ?', [payload.days, payload.checkinid]);
      let newbody = this.ctx.helper.newBody(payload);
      newbody['SettleTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
      const res2 = await conn.insert(
        'bus_checkin_add',
         newbody
        ); // 第一步操作

      await conn.commit(); // 提交事务
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }

}

module.exports = CheckinController;
