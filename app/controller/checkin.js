const Controller = require('egg').Controller;
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
}

module.exports = CheckinController;