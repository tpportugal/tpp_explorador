import { moduleForModel, test } from 'ember-qunit';

moduleForModel('data/tpp/route-stop-patterns', 'Unit | Model | data/tpp/route stop patterns', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
