const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 提交题库内各个题目的答案
   */
  async submitAction() {
    const openId = this.getLoginUserId();
    const cid = this.get('cid');
    const answers = JSON.parse(this.get('answers'));
    const questions = this.model('questions');
  
    const total = await this.model('cards').field(['total']).where({cid: cid}).find();
    // 提交用户答案， 计算用户答对题数，并登记错题集
    if (think.isEmpty(total)) {
      return this.fail('找不到对应题库')
    }
  
    // 返回题库答案
    const allAnswer = await questions.field(['qid', 'answer']).where({cid: cid}).select();
    const res = await this.model('answers').checkout(openId, allAnswer);
  
    return this.success(res);
  }

  /**
   * 提交某个题目的答案
   */
  async oneAction() {
    const openId = this.getLoginUserId();
    const qid = this.get('qid');
    const answers = JSON.parse(this.get('answers'));
    const questions = this.model('questions');

    const allAnswer = await questions.field(['qid', 'answer']).where({qid: qid}).select();
    const res = await this.model('answers').checkout(openId, allAnswer);

    return this.success(res[qid]);
  }
};
