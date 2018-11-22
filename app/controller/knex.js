const Controller = require('egg').Controller

class KnexController extends Controller {
    // 创建对象
  async create() {
    const { ctx, service } = this
    const { table } = ctx.params
    // 校验参数
    // ctx.validate(this.UserCreateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.knex.addData(table,payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 删除单个对象
  async destroy() {
    const { ctx, service } = this
    // 校验参数
    const { table, id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.knex.deleteData(table,id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res})
  }

  // 修改对象
  async update() {
    const { ctx, service } = this
    // 校验参数
    //ctx.validate(this.UserUpdateTransfer)
    // 组装参数
    const { table, id } = ctx.params
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.knex.updateData(table, payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }
 
  // 获取单个对象
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { table, id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.knex.firstData(table,id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

    // 获取所有对象(分页/模糊)
    async list() {
      const { ctx, service } = this
      // 组装参数
      const { table } = ctx.params
      const payload = ctx.request.body || {}

      // 调用 Service 进行业务处理
      const res = await service.knex.dataByWhere(table,payload)
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx, res})
    }
    // 获取所有对象(分页/模糊)
    async listpage() {
      const { ctx, service } = this
      // 组装参数
      const { table } = ctx.params
      const payload = ctx.request.body || {}

      // 调用 Service 进行业务处理
      const res = await service.knex.dataListWherePage(table,payload)
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx, res})
    }
  // 获取所有对象
  async table() {
    const { ctx, service } = this
    // 组装参数
    const { table } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.knex.data(table)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
    
  // 删除所选对象(条件id[])
  async removes() {
    const { ctx, service } = this
    // 组装参数
    // const payload = ctx.queries.id
    const { table } = ctx.params
    const { id } = ctx.request.body
    const payload = id.split(',') || []
    // 调用 Service 进行业务处理
    const res = await service.knex.deleteData(table,payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res})
  }
}

module.exports = KnexController