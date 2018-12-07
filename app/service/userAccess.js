'use strict'

const Service = require('egg').Service
const dayjs = require('dayjs')

class UserAccessService extends Service {

  async login(payload) {
    const {
      ctx,
      service
    } = this
    const user = await service.knex.dataByPara("sys_user", "UserId", payload.UserId)
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    // let verifyPsw = await ctx.compare(payload.Pwd, user[0].Pwd) 
    let verifyPsw = payload.Pwd == user[0].Pwd;
    if (!verifyPsw) {
      ctx.throw(404, 'user password is error')
    }
    // 更新登录记录
    const ct = await service.knex.updateData("sys_user", {
      Id: user[0].Id,
      LastLoginTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    // console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))
    // 生成Token令牌
    return {
      token: await service.actionToken.apply(user[0].UserId)
    }
  }

  async logout() {}

  async resetPsw(values) {
    const {
      ctx,
      service
    } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }

    let verifyPsw = await ctx.compare(values.oldPassword, user.password)
    if (!verifyPsw) {
      ctx.throw(404, 'user password error')
    } else {
      // 重置密码
      values.password = await ctx.genHash(values.password)
      return service.user.findByIdAndUpdate(_id, values)
    }
  }

  async current() {
    const {
      ctx,
      service
    } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id
    // const user = await service.user.find(_id)
    // if (!user) {
    //   ctx.throw(404, 'user is not found')
    // }
    let user = {
      id: _id,
      password: 'How old are you?'
    };
    return user
  }

  // 修改个人信息
  async resetSelf(values) {
    const {
      ctx,
      service
    } = this
    // 获取当前用户
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    return service.user.findByIdAndUpdate(_id, values)
  }

  // 更新头像
  async resetAvatar(values) {
    const {
      ctx,
      service
    } = this
    await service.upload.create(values)
    // 获取当前用户
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    return service.user.findByIdAndUpdate(_id, {
      avatar: values.url
    })
  }

}

module.exports = UserAccessService