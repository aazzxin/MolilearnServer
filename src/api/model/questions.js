module.exports = class extends think.Model {
  get pk() {
    return 'qid';
  }
  /**
   * 获取对应cid的题目列表
   * @returns {Promise.<*>}
   */
  async getQuestionList(cid, page, size, edit) {
    const data = await this.where({cid: cid})
      .page(page || 1, size || 5).order('idx ASC').select();

    const questions = [];
    // 字符解析

    for (let i = 0; i < data.length; i++) {
      let qst = data[i];
      let res = {
        qid: qst.qid,
        cid: qst.cid,
        index: qst.Idx,
        type: 'select',
        single: qst.single,
        title: qst.title,
        checkboxList: JSON.parse(qst.qst),
        note: qst.note,
        selectValue: []
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
        Idx: questions[i].index,
        single: questions[i].single,
        title: questions[i].title,
        qst: JSON.stringify(questions[i].checkboxList),
        answer: JSON.stringify(questions[i].selectValue),
        note: ''
      });
    }
  }
};