const Base = require('./base.js');

module.exports = class extends Base {
  async totalAction() {
    const cid = this.get('cid');
    var total = await this.model('cards').field(['total']).where({cid: cid}).find();

    if (think.isEmpty(total)) {
      total = 1
    }

    return this.success(total)
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
    const model = this.model('cards');
    
    return this.success();
  }
};
