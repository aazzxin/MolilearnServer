const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {   
    const cid = this.get('cid');
    const page = this.get('page');
    const size = this.get('size');

    const model = this.model('questions');
    const data = await model.getQuestionList(cid, page, size, false);
    return this.success(data);
  }

  async oneAction() {
    const qid = this.get('qid');
    const model = this.model('questions');
    const qst = await model.where({qid: qid}).find();
    return this.success({
      qid: qst.qid,
      cid: qst.cid,
      index: qst.idx,
      type: 'select',
      single: qst.single,
      title: qst.title,
      checkboxList: JSON.parse(qst.qst),
      note: qst.note,
      selectValue: []
    });
  }

  async editListAction() {
    const openId = this.getLoginUserId();
    const cid = this.get('cid');
    const page = this.get('page');
    const size = this.get('size');

    const model = this.model('questions');
    const data = await model.getQuestionList(cid, page, size, true);
    
    return this.success(data);
  }

  async collListAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');
    const model = this.model('collsionQst');

    const data = await model.join('questions ON collsionQst.qid=questions.qid')
    .field(['questions.qid', 'questions.title as title']).where({openId: openId, isColl: true})
    .page(page || 1, size || 10).order('time DESC').select();

    return this.success(data);
  }

  async wrongListAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');
    const model = this.model('answers');

    const data = await model.join('questions ON answers.qid=questions.qid')
      .field(['questions.qid', 'questions.title as title']).where({openId: openId, correct: true})
      .page(page || 1, size || 10).select();

    return this.success(data);
  }
};
