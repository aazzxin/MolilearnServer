const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {   
    const openId = this.getLoginUserId();
    const model = this.model('cards');
    const page = this.get('page');
    const size = this.get('size');

    const data = await model.getCardsList(openId, page, size);

    return this.success(data);
  }
};
