const Controller = require('egg').Controller;

class DataController extends Controller {
  constructor(ctx) {
    super(ctx);

   // this.UserCreateTransfer = {;
    //   mobile: {type: 'string', required: true, allowEmpty: false, format: /^[0-9]{11}$/},;
    //   password: {type: 'password', required: true, allowEmpty: false, min: 6},;
    //   realName: {type: 'string', required: true, allowEmpty: false, format: /^[\u2E80-\u9FFF]{2,6}$/};
    // };

    // this.UserUpdateTransfer = {;
    //   mobile: { type: 'string', required: true, allowEmpty: false },;
    //   realName: {type: 'string', required: true, allowEmpty: false, format: /^[\u2E80-\u9FFF]{2,6}$/};
    // };
  }

  // 创建对象;
  async create() {
    const { ctx, service } = this;
    const { table } = ctx.params;
    // 校验参数;
    // ctx.validate(this.UserCreateTransfer);
    // 组装参数;
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理;
    const res = await service.data.create(table,payload);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx, res});
  }

  // 删除单个对象;
  async destroy() {
    const { ctx, service } = this;
    // 校验参数;
    const { table, id } = ctx.params;
    // 调用 Service 进行业务处理;
    const res = await service.data.destroy(table,id);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx,res});
  }

  // 修改对象;
  async update() {
    const { ctx, service } = this;
    // 校验参数;
    //ctx.validate(this.UserUpdateTransfer);
    // 组装参数;
    const { table, id } = ctx.params;
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理;
    await service.data.update(table, id, payload);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx});
  }

  // 获取单个对象;
  async show() {
    const { ctx, service } = this;
    // 组装参数;
    const { table, id } = ctx.params;
    // 调用 Service 进行业务处理;
    this.logger.info(`Id:${id}`);;
    const res = await service.data.show(table,id);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx, res});
  }

  // 获取所有对象(分页/模糊);
  async index() {
    const { ctx, service } = this;
    // 组装参数;
    const { table } = ctx.params;
    const payload = ctx.query;
    // 调用 Service 进行业务处理;
    const res = await service.data.index(payload);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx, res});
  }

    // 获取所有对象(分页/模糊);
    async list() {
      const { ctx, service } = this;
      // 组装参数;
      const { table } = ctx.params;
      const payload = ctx.request.body || {};

      // 调用 Service 进行业务处理;
      const res = await service.data.list(table,payload);
      // 设置响应内容和响应状态码;
      ctx.helper.success({ctx, res});
    }
    // 获取所有对象(分页/模糊);
    async listpage() {
      const { ctx, service } = this;
      // 组装参数;
      const { table } = ctx.params;
      const payload = ctx.request.body || {};

      // 调用 Service 进行业务处理;
      const res = await service.data.listpage(table,payload);
      // 设置响应内容和响应状态码;
      ctx.helper.success({ctx, res});
    }
  // 获取所有对象(分页/模糊);
  async table() {
    const { ctx, service } = this;
    // 组装参数;
    const { table } = ctx.params;
    // 调用 Service 进行业务处理;
    const res = await service.data.table(table);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx, res});
  }
  // 删除所选对象(条件id[]);
  async removes() {
    const { ctx, service } = this;
    // 组装参数;
    // const payload = ctx.queries.id;
    const { table } = ctx.params;
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];
    // 调用 Service 进行业务处理;
    const res = await service.data.removes(table,payload);
    // 设置响应内容和响应状态码;
    ctx.helper.success({ctx,res});
  }
}
module.exports = DataController;