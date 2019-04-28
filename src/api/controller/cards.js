const Base = require('./base.js');

module.exports = class extends Base {
  async totalAction() {
    const cid = this.get('cid');
    var total = await this.model('cards').field(['total']).where({cid: cid}).find();

    if (think.isEmpty(total)) {
      total = 1
    }

    return this.success(total)
  }

  async menuAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');
    const model = this.model('cards');

    const data = await model.field(['cid', 'title', 'time', 'total', 'coll']).where({openId: openId})
      .page(page || 1, size || 10).order('time DESC').select();

    return this.success(data);
  }

  async addAction() {
    const title = this.get('title');
    const questions = JSON.parse(this.get('questions'));
    const model = this.model('cards');
    const cid = think.uuid(6);
    console.log('cid', cid);
    console.log('questions', questions);

    let card = await model.add({
      cid: cid,
      title: title,
      openId: this.getLoginUserId(),
      time: this.getDate(),
      total: questions.length,
      coll: 0
    });

    const qstsModel = this.model('questions');
    qstsModel.addQuestionList(cid, questions);
    
    return this.success();
  }
};
