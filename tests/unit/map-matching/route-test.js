import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | map matching', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:map-matching');
    assert.ok(route);
  });
});
