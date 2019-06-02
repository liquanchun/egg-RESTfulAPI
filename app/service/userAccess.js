'use strict'

const Service = require('egg').Service;
const moment = require('moment');
class UserAccessService extends Service {

  async login(payload) {
    const {
      ctx,
      service
    } = this;
    const user = await service.knex.dataByPara('vw_sys_useraccess', 'UserId', payload.userName)
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    // let verifyPsw = await ctx.compare(payload.Pwd, user[0].Pwd) 
    //如果未修改密码，则不验证，任何密码都通过
    if (user[0].Pwd) {
      let paypwd = await ctx.genHash(payload.password);
      let verifyPsw = paypwd == user[0].Pwd;
      if (!verifyPsw) {
        ctx.throw(404, 'user password is error');
      }
    }
    // 更新登录记录
    const ct = await service.knex.updateData('sys_user', {
      Id: user[0].Id,
      Times:user[0].Times + 1,
      LastLoginTime: moment().format('YYYY-MM-DD hh:mm:ss')
    });
    // 生成Token令牌
    return {
      msg: 'ok',
      user: {
        token: await service.actionToken.apply(user[0].UserId),
        userid: user[0].UserId,
        id: user[0].Id,
        roleids:user[0].RoleIds,
        rolenames:user[0].RoleIdsTxt,
        username:user[0].UserName,
        avatar:user[0].Avatar,
        profile:user[0].Profile,
        mobile:user[0].Mobile,
        wechat:user[0].Wechat,
        email:user[0].Email,
        time: +new Date()
      }
    };
  }

  async logout() {}

  async resetPsw(values) {
    const {
      ctx,
      service
    } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }

    // let verifyPsw = await ctx.compare(values.oldPassword, user.Pwd)
    // if (!verifyPsw) {
    //   ctx.throw(404, 'user password error')
    // } else {
    // 重置密码
    values.password = await ctx.genHash(values.password);
    const ct = await service.knex.updateData('sys_user', {
      Id: _id,
      Pwd: values.password
    });
    return ct;
    //}
  }

  async current() {
    const {
      ctx,
      service
    } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    // const user = await service.user.find(_id)
    // if (!user) {
    //   ctx.throw(404, 'user is not found')
    // }
    let user = {
      id: _id,
      password: 'How old are you?'
    };
    return user;
  }

  // 修改个人信息
  async resetSelf(values) {
    const {
      ctx,
      service
    } = this;
    // 获取当前用户
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    return service.user.findByIdAndUpdate(_id, values);
  }

  // 更新头像
  async resetAvatar(values) {
    const {
      ctx,
      service
    } = this;
    await service.upload.create(values);
    // 获取当前用户
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    return service.user.findByIdAndUpdate(_id, {
      avatar: values.url
    });
  }

}

module.exports = UserAccessService;