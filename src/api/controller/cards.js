const Base = require('./base.js');

module.exports = class extends Base {
  async totalAction() {
    const cid = this.get('cid');
    var res = await this.model('cards').field(['total']).where({cid: cid}).find();

    if (think.isEmpty(res)) {
      res = {total: 1}
    }

    // 记录历史
    const history = this.model('history');
    const openId = this.getLoginUserId();
    var id = await history.where({openId: openId, cid: cid}).find();
    if (think.isEmpty(id)) {
      history.add({
        openId: openId,
        cid: cid,
        time: this.getDate()
      });
    } else {
      history.where({openId: openId, cid: cid}).update({time: this.getDate()});
    }

    return this.success(res.total);
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

  async saveAction() {
    const cid = this.get('cid');
    const title = this.get('title');
    const editList = JSON.parse(this.get('editList'));
    const newList = JSON.parse(this.get('newList'));
    const deleteList = this.get('deleteList').split(',');
    const model = this.model('cards');
    const qstsModel = this.model('questions');

    const verifyTitle = await model.where({cid: cid}).update({title: title});
    for (let i = 0; i < deleteList.length; i++) {
      qstsModel.where({qid: deleteList[i]}).delete();
    }
    qstsModel.addQuestionList(cid, newList);
    qstsModel.editQuestionList(cid, editList);

    return this.success();
  }

  async renameAction() {
    const cid = this.get('cid');
    const title = this.get('title');
    const model = this.model('cards');

    let id = await model.where({cid: cid}).update({title: title});

    return this.success();
  }

  async deleteAction() {
    const cid = this.get('cid');
    const model = this.model('cards');

    let affectedRows = await model.where({cid: cid}).delete();

    const answersData = this.model('answers');
    const usersinfo = this.model('usersinfo');
    const correctNum = await answersData.where({openId: openId, correct: true}).count('*');
    usersinfo.where({openId: openId}).update({correctNum: correctNum});

    return this.success()
  }

  async historyAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');

    const history = await this.model('history').where({openId: openId}).buildSelectSql();
    const collisionCard = await this.model('collisionCard').where({openId: openId}).buildSelectSql();
    const cards = this.model('cards');
    const data = await cards.join({
      table: history,
      join: 'right',
      as: 'history',
      on: ['cid', 'cid']
    }).join('users ON cards.openId=users.openId')
    .join({
      table: collisionCard,
      join: 'left',
      as: 'collect',
      on: ['cid', 'cid']
    })
    .field(['cards.*', 'users.nickName', 'users.avatar', 'collect.isColl'])
    .order('time DESC').page(page || 1, size || 10).select();

    let res = await cards.dataToCards(data);
    return this.success(res);
  }

  async collListAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');
    const collisionCard = await this.model('collisionCard').where({openId: openId, isColl: true}).buildSelectSql();
    const cards = this.model('cards');
    const data = await cards.join('users ON cards.openId=users.openId').join({
      table: collisionCard,
      join: 'right',
      as: 'collect',
      on: ['cid', 'cid']
    }).field(['cards.*', 'users.nickName', 'users.avatar', 'collect.isColl'])
    .order('time DESC').page(page || 1, size || 10).select();
    let res = await cards.dataToCards(data);
    return this.success(res);
  }
};
