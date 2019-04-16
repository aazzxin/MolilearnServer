const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {   
    const model = this.model('cards');
    const page = this.get('page');
    const size = this.get('size');

    const data = await model.getCardsList(page, size);

    return this.success(data);
  }
};
