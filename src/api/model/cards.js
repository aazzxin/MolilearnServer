module.exports = class extends think.Model {
  get pk() {
    return 'cid';
  }
  /**
  * 获取首页题库列表
  * @returns {Promise.<*>}
  */
  async getCardsList(page, size) {
    const model = this.model('cards');
    const data = await model.join('users ON cards.unionId=users.unionId')
      .field(['cards.*', 'users.nickName'])
      .page(page || 1, size || 10).countSelect();

    const cards = [];
    for (let i = 0; i < data.length; i++) {
      const card = data[i];
      cards.push({
        cid: card.cid,
        publisher: card.nickName,
        title: card.title,
        time: card.time,
        coll: card.coll
      });
    }

      return goodsList;
    }
  };