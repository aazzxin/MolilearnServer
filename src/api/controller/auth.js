const Base = require('./base.js');

module.exports = class extends Base {
  async loginByWeixinAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const clientIp = this.ctx.ip;

    // 解释用户数据
    const userInfo = await this.service('weixin', 'api').login(code, fullUserInfo);
    if (think.isEmpty(userInfo)) {
      return this.fail('登录失败');
    }

    // 根据unionId查找用户是否已经注册
    let userId = await this.model('users').where({ openId: userInfo.openId }).getField('openId', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('users').add({
        // username: '微信用户' + think.uuid(6),
        // password: '',
        openId: userInfo.openId,
        register_time: this.getDate(),
        register_ip: clientIp,
        // mobile: '',
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 0, // 性别 0：男、1：女
        nickName: userInfo.nickName
      });
      userId = await this.model('usersinfo').add({
        openId: userInfo.openId,
        collNum: 0,
        correctNum: 0
      })
    }

    // 查询用户信息
    const newUserInfo = await this.model('users').field(['nickName', 'gender', 'avatar']).where({ openId: userInfo.openId }).find();

    // 更新登录信息
    userId = await this.model('users').where({ openId: userInfo.openId }).update({
      last_login_time: this.getDate(),
      last_login_ip: clientIp
    });

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: userInfo.openId });

    if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }

  async logoutAction() {
    return this.success();
  }
};
