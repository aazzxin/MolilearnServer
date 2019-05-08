module.exports = class extends think.Model {
  get pk() {
    return 'qid';
  }
  /**
   * 获取对应cid的题目列表
   * @returns {Promise.<*>}
   */
  async getQuestionList(openId, cid, page, size, edit) {
    let collisionQst = await this.model('collisionQst').where({openId: openId}).buildSelectSql();
    const data = await this.join({
      table: collisionQst,
      join: 'left',
      as: 'collect',
      on: ['qid','qid']
    }).field(['questions.*', 'collect.isColl']).where({cid: cid})
    .page(page || 1, size || 5).order('idx ASC').select();

    const questions = [];
    // 字符解析

    for (let i = 0; i < data.length; i++) {
      let qst = data[i];
      let res = {
        qid: qst.qid,
        cid: qst.cid,
        index: qst.idx,
        type: 'select',
        single: qst.single,
        title: qst.title,
        checkboxList: JSON.parse(qst.qst),
        note: qst.note,
        selectValue: [],
        isColl: qst.isColl ? true : false
      }
      if (edit) {
        res.selectValue = JSON.parse(qst.answer)
      }
      questions.push(res);
    }
    return questions;
  }
  /**
   * 创建cid相应的question列表
   * @returns {Promise.<*>}
   */
  async addQuestionList(cid, questions) {
    for (let i = 0; i < questions.length; i++) {
      let id = this.add({
        qid: think.uuid(6),
        cid: cid,
        idx: questions[i].index,
        single: questions[i].single ? 1 : 0,
        title: questions[i].title,
        qst: JSON.stringify(questions[i].checkboxList),
        answer: JSON.stringify(questions[i].selectValue),
        note: ''
      });
    }
  }
  /**
   * 保存修改的编辑题目
   */
  async editQuestionList(cid, questions) {
    var qidSet = new Set();
    for(let i = 0; i < questions.length; i++) {
      let curQst = questions[i];
      let id = this.where({qid: curQst.qid}).update({
        idx: curQst.index,
        single: curQst.single ? 1 : 0,
        title: curQst.title,
        qst: JSON.stringify(curQst.checkboxList),
        answer: JSON.stringify(curQst.selectValue),
        note: ''
      })
    }
  }
};