const Base = require('./base.js');

module.exports = class extends Base {
  async cardAction() {
    const openId = this.getLoginUserId();
    const cid = this.get('cid');
    const coll = this.get('coll');

    const model = this.model('collisionCard');

    let id = await model.where({openId: openId, cid: cid}).find();
    if (think.isEmpty(id)) {
      await model.add({
        openId: openId,
        cid: cid,
        isColl: coll,
        time: this.getDate()
      })
    } else {
      await model.where({openId: openId, cid: cid}).update({isColl: coll, time: this.getDate()});
    }

    // 重新计数题库收藏数，和创建者被收藏量
    const cards = this.model('cards');
    let collCount = await model.where({cid: cid, isColl: true}).count('*');
    cards.where({cid: cid}).update({coll: collCount})
    let creator = await cards.field(['openId']).where({cid: cid}).getField('openId', true);
    
    let userCardCollCount = await model.join('cards ON cards.cid=collisionCard.cid')
    .where({'cards.openId': creator, 'collisionCard.isColl': true}).count('*');
    this.model('usersinfo').where({openId: creator}).update({collNum: userCardCollCount});

    return this.success();
  }

  async questionAction() {
    const openId = this.getLoginUserId();
    const qid = this.get('qid');
    const coll = this.get('coll');

    const model = this.model('collisionQst');
    let id = await model.where({openId: openId, qid: qid}).find();
    if (think.isEmpty(id)) {
      await model.add({
        openId: openId,
        qid: qid,
        isColl: coll,
        time: this.getDate()
      })
    } else {
      await model.where({openId: openId, qid: qid}).update({isColl: coll, time: this.getDate()});
    }
  }
};
