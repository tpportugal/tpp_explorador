import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    bbox: {
      replace: true,
      refreshModel: true
    }
  }
});
