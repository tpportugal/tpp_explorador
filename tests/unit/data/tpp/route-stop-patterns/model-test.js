import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | data/tpp/route stop patterns', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('data/tpp/route-stop-patterns'));
    // let store = this.store();
    assert.ok(!!model);
  });
});
