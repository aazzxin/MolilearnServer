const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  async infoAction() {
    const openId = this.getLoginUserId();

    const model = this.model('usersinfo');
    const data = model.field(['collNum', 'correctNum']).where({openId: openId}).find();
    const cardsNum = this.model('cards').where({openId: openId}).count('*');

    return this.success({
      collNum: data.collNum,
      cardsNum: cardsNum,
      correctNum: data.correctNum
    })
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    fs.rename(avatar.path, avatarPath, function(res) {
      return this.success();
    });
  }
};
