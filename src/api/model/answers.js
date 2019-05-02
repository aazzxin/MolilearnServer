module.exports = class extends think.Model {
  get pk() {
    return 'openId';
  }

  async checkout(openId, answers, allAnswer) {
    const usersinfo = this.model('usersinfo');
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
  
      let id = await this.where({openId: openId, qid: qid}).find();
      if (think.isEmpty(id)) {
        let id = await this.add({
          openId: openId,
          qid: qid,
          correct: correct ? 1 : 0
        })
      } else {
        let id = await this.where({openId: openId, qid: qid}).update({correct: correct ? 1 : 0})
      }
    }
    const correctNum = await this.where({openId: openId, correct: true}).count('*');
    usersinfo.where({openId: openId}).update({correctNum: correctNum});

    return res;
  }
};