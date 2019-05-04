const Base = require('./base.js');

module.exports = class extends Base {
  async cardAction() {
    const openId = this.getLoginUserId();
    const cid = this.get('cid');
    const coll = this.get('coll');

    const model = this.model('collisionCard');

    let id = model.where({openId: openId, cid: cid}).getField('openId', true);
    if (think.isEmpty(id)) {
      model.add({
        openId: openId,
        cid: cid,
        isColl: coll ? 1 : 0,
        time: this.getDate()
      })
    } else {
      model.where({openId: openId, cid: cid}).update({isColl: coll ? 1 : 0, time: this.getDate()});
    }

    return this.success();
  }
};
