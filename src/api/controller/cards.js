const Base = require('./base.js');

module.exports = class extends Base {
  async totalAction() {
    const cid = this.get('cid');
    var total = this.model('cards').field(['total']).where({cid: cid}).find();

    return this.success(total)
  }

  async menuAction() {
    const openId = this.getLoginUserId();
    const page = this.get('page');
    const size = this.get('size');
    const model = this.model('cards');

    const data = model.field(['cid', 'title', 'time', 'total', 'coll']).where({openId: openId})
      .page(page || 1, size || 10).order('time DESC').countSelect();

    return this.success(data);
  }
};
