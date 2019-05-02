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
    const answers = JSON.parse(this.get('answers'));
    const users = this.model('users');
    const usersinfo = this.model('usersinfo');
    const questions = this.model('questions');
    const answersData = this.model('answers');

    const total = await this.model('cards').field(['total']).where({cid: cid}).find();
    // 提交用户答案， 计算用户答对题数，并登记错题集
    if (think.isEmpty(total)) {
      return this.fail('找不到对应题库')
    }

    // 返回题库答案
    const allAnswer = await questions.field(['qid', 'answer']).where({cid: cid}).select();
    const res = {};
    for (let i = 0; i < allAnswer.length; i++) {
      // 获得答案
      let qid = allAnswer[i].qid;
      res[qid] = allAnswer[i].answer;
      var correct = false;
      if (res[qid].startsWith("[") && res[qid].endsWith("]")) {
        res[qid] = JSON.parse(res[qid]);
        res[qid].sort();
        answers[qid].sort();
        correct = res[qid].join() === answers[qid].join();
      } else {
        correct = res[qid] === answers[qid];
      }

      let id = await answersData.where({openId: openId, qid: qid}).find();
      if (think.isEmpty(id)) {
        let id = await answersData.add({
          openId: openId,
          qid: qid,
          correct: correct ? 1 : 0
        })
      } else {
        let id = await answersData.where({openId: openId, qid: qid}).update({correct: correct ? 1 : 0})
      }
    }
    const correctNum = await answersData.where({openId: openId, correct: true}).count('*');
    usersinfo.where({openId: openId}).update({correctNum: correctNum});

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
