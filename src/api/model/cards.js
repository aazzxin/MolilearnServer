module.exports = class extends think.Model {
  get pk() {
    return 'cid';
  }
  /**
  * 获取首页题库列表
  * @returns {Promise.<*>}
  */
  async getCardsList(openId, page, size) {
    const data = await this.join('users ON cards.openId=users.openId').join('collisionCard ON cards.cid=collisionCard.cid')
      .field(['cards.*', 'users.nickName', 'users.avatar', 'collisionCard.isColl'])
      .where({'collisionCard.openId': openId}).order('time DESC')
      .page(page || 1, size || 10).select();

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
        isColl: card.isColl
      });
    }

      return cards;
    }
  };