import DS from 'ember-data';
import ENV from 'mobility-explorer/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.tppDatastoreHost,
  namespace: 'v1',
  coalesceFindRequests: true,
  ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);
    if (type === 'GET') {
      let data = {};
      if (typeof(hash.data) === 'string') {
        data = JSON.parse(hash.data);
      } else if (typeof(hash.data) !== 'undefined') {
        data = hash.data;
      } else {
        data = {};
      }
      data['per_page'] = false;
      data['sort_key'] = 'onestop_id';
      data['sort_order'] = 'desc';
      hash.data = data;
    }
    return hash;
  }
});
