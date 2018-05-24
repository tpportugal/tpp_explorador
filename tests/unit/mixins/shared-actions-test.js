import EmberObject from '@ember/object';
import SharedActionsMixin from 'mobility-playground/mixins/shared-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | shared actions', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let SharedActionsObject = EmberObject.extend(SharedActionsMixin);
    let subject = SharedActionsObject.create();
    assert.ok(subject);
  });
});
