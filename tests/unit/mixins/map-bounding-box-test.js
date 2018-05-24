import EmberObject from '@ember/object';
import MapBoundingBoxMixin from 'mobility-playground/mixins/map-bounding-box';
import { module, test } from 'qunit';

module('Unit | Mixin | map bounding box', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let MapBoundingBoxObject = EmberObject.extend(MapBoundingBoxMixin);
    let subject = MapBoundingBoxObject.create();
    assert.ok(subject);
  });
});
