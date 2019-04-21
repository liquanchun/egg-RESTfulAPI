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
            
            const res = await conn.insert('bus_checkin', this.ctx.helper.newBody(payload));  // 第一步操作
            const res2 = await conn.update('hou_houseinfo',{id:payload.houseid,Status:'住人'});
            const res3 = await conn.insert('hou_housestatus', {HouseId:payload.houseid, OldStatus:'空净',NewStatus:'住人'}); 

            if(payload.bookid){
                const res4 = await conn.update('bus_booking',{id:payload.bookid, Status:'订单'});
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
        const payload = ctx.request.body || {};
        const conn = await this.app.mysql.beginTransaction(); // 初始化事务

        try {
            
            const res = await conn.update('bus_checkin', {
                id:payload.Id,
                Status:'已结算',
                Settle:payload.Settle,
                SettleMan:payload.SettleMan,
                SettlePayType:payload.SettlePayType,
                SettleTime:moment().format('YYYY-MM-DD HH:mm:ss')
            });  // 第一步操作
            const res2 = await conn.update('hou_houseinfo',{
                id:payload.HouseId,
                Status:'空脏'
            });
            const res3 = await conn.insert('hou_housestatus', {
                HouseId:payload.HouseId,
                CheckinId:payload.Id,
                OldStatus:'住人',
                NewStatus:'空脏'
            }); 
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

    // 取消订单
    async cancelOrder() {
        const { ctx, service } = this;
        // 组装参数
        const payload = ctx.request.body || {};
        const conn = await this.app.mysql.beginTransaction(); // 初始化事务

        try {
            
            const res = await conn.update('bus_checkin', {
                id:payload.id,
                Status:'取消'
            });  // 第一步操作
            const res2 = await conn.update('hou_houseinfo',{
                id:payload.houseid,
                Status:'空净'
            });
            const res3 = await conn.insert('hou_housestatus', {
                HouseId:payload.houseid,
                checkinid:payload.id, 
                OldStatus:'住人',
                NewStatus:'空净',
                remark:'取消'
            }); 

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