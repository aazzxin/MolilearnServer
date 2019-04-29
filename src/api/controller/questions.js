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

  async submitAction() {
    const openId = this.getLoginUserId();
    const cid = this.get('cid');
    const answers = this.post('answers');

    const users = this.model('users');
    const usersinfo = this.model('usersinfo');
    const questions = this.model('questions');
    const answersData = this.model('answers');

    const total = await this.model('cards').field(['total']).where({cid: cid}).find();
    // 提交用户答案， 计算用户答对题数，并登记错题集
    if (think.isEmpty(total)) {
      return this.fail('找不到对应题库')
    }
    for (let qid in answers) {
      let answer = await questions.field(['answer']).where({qid: qid}).find();
      let id = await answersData.where({openId: openId, qid: qid}).find();
      let correct = answer === answers[qid]
      if (think.isEmpty(id)) {
        answersData.add({
          openId: openId,
          qid: qid,
          correct: correct
        })
      } else {
        answersData.where({openId: openId, qid: qid}).update({correct: correct})
      }
    }
    const correctNum = await answersData.where({openId: openId, correct: true}).count('*');
    usersinfo.where({openId: openId}).update({correctNum: correctNum});

    // 返回题库答案
    const allAnswer = await questions.field(['qid', 'answer']).where({cid: cid});
    const res = {};
    for (let i = 0; i < allAnswer.length; i++) {
      let qid = allAnswer[i].qid;
      res[qid] = allAnswer[i].answer;
      if (res[qid].startsWith("[") && res[qid].endsWith("]")) {
        res[qid] = JSON.parse(res[qid]);
      }
    }

    return this.success(res);
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
};
