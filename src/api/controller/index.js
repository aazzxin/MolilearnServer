const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {   
    const openId = this.getLoginUserId();
    const model = this.model('cards');
    const key = this.get('key')
    const page = this.get('page');
    const size = this.get('size');

    const data = await model.getCardsList(openId, key, page, size);

    return this.success(data);
  }
};
