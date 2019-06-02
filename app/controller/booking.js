const Controller = require('egg').Controller;
const moment = require('moment');
const _ = require('lodash');
class BookingController extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  async newbooking() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};

    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try{ 

      let booking = this.ctx.helper.newBody(payload.booking);
      let bookid = 0;
      let res = {};
      if(!payload.booking.Id){
          res = await conn.insert(
            'bus_booking',
            booking
          );
          bookid = res['insertId'];
      }else{
        if(booking['PreHouseId']){
          delete booking['PreHouseId'];
        }
         res = await conn.update(
          'bus_booking',
          booking
        );
        bookid = payload.booking.Id;
      }
      // 服务项目
      if(payload.service){
        for (let i = 0; i < payload.service.length; i++) {
          if(payload.service[i]['Id']){
              let ser = {};
              
              ser['BookId'] = bookid;
              ser['ServiceItemId'] = payload.service[i]['Id'];
              ser['Amount'] = 1;
              ser['Price'] = payload.service[i]['Price'];
              ser['Status'] = '预约';
              
              await conn.insert(
                'bus_bookingser',
                ser
              );
          }
        }
      }
    
      await conn.commit(); // 提交事务
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }

  getBookHouse(){
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};
    const data = '10002';
    ctx.helper.success({ ctx, data });
  }
 // 测试mysql事务执行
 async testTrans(){

     const { ctx, service } = this;
    // 组装参数
    const payload = ctx.request.body || {};

    const conn = await this.app.mysql.beginTransaction(); // 初始化事务

    try{ 

      const res = await conn.insert(
            'sys_log',
            {
                method: 'test',
                ip: ctx.request.ip,
                url: ctx.url,
                user: 'test',
                msg: this.app.mysql.literals.now,
            }
      );
     
      const res2 = await conn.update(
            'kc_goods',
            {
              id:14795,
              remark2: this.app.mysql.literals.now,
            }
      );
      await conn.commit(); // 提交事务
      ctx.helper.success({ ctx, res });
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }

  }
}

module.exports = BookingController;