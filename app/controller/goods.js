const Controller = require('egg').Controller;
const _ = require('lodash');
class GoodsController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    // 创建对象;
    async createGoods() {
        const {
            ctx,
            service
        } = this;
        // 校验参数;
        // ctx.validate(this.UserCreateTransfer);
        // 组装参数;
        const payload = ctx.request.body || {};
        // 调用 Service 进行业务处理;
        let data = _.pick(payload, ['GoodsId', 'Price', 'Amount', 'Remark', 'CreatedBy']);
        data['SumMoney'] = data.Price * data.Amount;
        let res = await service.knex.addData('kc_goodsin', data);

        //获取商品信息
        const goods = await service.knex.firstData('kc_goods', data.GoodsId);
        if (goods) {
            goods.Amount += data.Amount;
        }
        //更新库存信息
        res = await service.knex.updateData('kc_goods', {
            Id: data.GoodsId,
            Amount: goods.Amount
        });
        // 设置响应内容和响应状态码;
        ctx.helper.success({
            ctx,
            res
        });
    }

    async housegoods(){
        const {
            ctx,
            service
        } = this;
        const payload = ctx.request.body || {};
        const typeid = payload.typeid;

    }
}

module.exports = GoodsController;