module.exports = class extends think.Model {
  get pk() {
    return 'cid';
  }
  /**
  * 获取首页题库列表
  * @returns {Promise.<*>}
  */
  async getCardsList(openId, key, page, size) {
    let collisionCard = await this.model('collisionCard').where({openId: openId}).buildSelectSql();
    const field = await this.join('users ON cards.openId=users.openId').join({
      table: collisionCard,
      join: 'left',
      as: 'collect',
      on: ['cid','cid']
    }).field(['cards.*', 'users.nickName', 'users.avatar', 'collect.isColl']);
    let data = field;
    const filter = ['cards.title']
    if (!think.isEmpty(key)) {
      data = field.where('cards.time = '+ key 
      + ' OR cards.title LIKE %' + key + '%'
      + ' OR users.nickName LIKE %' + key + '%')
    }
    data = data.order('time DESC').page(page || 1, size || 10).select();

    return this.dataToCards(data);
  };

  async dataToCards(data) {
    const cards = [];
    for (let i = 0; i < data.length; i++) {
      const card = data[i];
      cards.push({
        cid: card.cid,
        publisher: card.nickName,
        avatar: card.avatar,
        title: card.title,
        time: card.time,
        coll: card.coll,
        isColl: card.isColl ? true : false
      });
    }

      return cards;
    }
  }