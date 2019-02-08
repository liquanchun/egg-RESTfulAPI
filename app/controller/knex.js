const Controller = require('egg').Controller

const _ = require('lodash')
class KnexController extends Controller {

  // 获取表或试图字段
  async columnlist(){
    const { ctx, service } = this
    const { table } = ctx.params
    const res = await service.knex.columnList(table)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
  
  // 获取表或试图列表
  async tablelist(){
    const { ctx, service } = this
    const res = await service.knex.tableList()
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
    // 创建对象
  async create() {
    const { ctx, service } = this
    const { table } = ctx.params
    // 校验参数
    // ctx.validate(this.UserCreateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.knex.addData(table,this.ctx.helper.newBody(payload))
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
    await service.knex.updateData(table, this.ctx.helper.newBody(payload))
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }
 
  // 获取单个对象
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { table, id } = ctx.params
    // 调用 Service 进行业务处理
    const data = await service.knex.firstData(table,id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, data})
  }

  async listBySql(){
    const { ctx, service } = this
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.knex.datalistBySql(payload.sql)
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
      const res = await service.knex.dataByWhere(table,this.ctx.helper.newBody(payload))
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
      const {res,total} = await service.knex.dataListWherePage(table,this.ctx.helper.newBody(payload))
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx, res, total})
    }
    async getlistpage() {
      const { ctx, service } = this
      // 组装参数
      const { table } = ctx.params
      const payload = ctx.request.query
      const newpayload = _.pick(payload, ['pi','ps','like','andor'])
      newpayload.pi = _.toInteger(newpayload.pi)
      newpayload.ps = _.toInteger(newpayload.ps)
      newpayload.paras = _.omit(payload, ['pi','ps','like','andor'])
      // 调用 Service 进行业务处理
      const {res,total} = await service.knex.dataListWherePage(table,newpayload)
      // 设置响应内容和响应状态码
      ctx.helper.success({ctx, res, total})
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