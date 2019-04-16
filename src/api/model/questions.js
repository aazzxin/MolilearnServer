module.exports = class extends think.Model {
  get pk() {
    return 'qid';
  }
  /**
   * 获取对应cid的题目列表
   * @returns {Promise.<*>}
   */
  async getQuestionList(cid, page, size, edit) {
    const model = this.model('questions');
    const data = await model.where({cid: cid})
      .page(page || 1, size || 5).countSelect().order('idx ASC');

    const questions = [];
    // 字符解析

    for (let i = 0; i < data.length; i++) {
      let qst = data[i];
      let res = {
        qid: qst.qid,
        cid: qst.cid,
        index: qst.idx,
        single: qst.single,
        title: qst.title,
        note: qst.note,
        selectValue: []
      }
      if (edit) {
        res.selectValue = qst.answer
      }
      questions.push(res);
    }
    return questions;
  }
};