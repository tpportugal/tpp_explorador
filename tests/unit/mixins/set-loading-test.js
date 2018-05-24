import EmberObject from '@ember/object';
import SetLoadingMixin from 'mobility-playground/mixins/set-loading';
import { module, test } from 'qunit';

module('Unit | Mixin | set loading', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let SetLoadingObject = EmberObject.extend(SetLoadingMixin);
    let subject = SetLoadingObject.create();
    assert.ok(subject);
  });
});
