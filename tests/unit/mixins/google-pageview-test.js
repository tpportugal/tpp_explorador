import EmberObject from '@ember/object';
import GooglePageviewMixin from 'mobility-playground/mixins/google-pageview';
import { module, test } from 'qunit';

module('Unit | Mixin | google pageview', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let GooglePageviewObject = EmberObject.extend(GooglePageviewMixin);
    let subject = GooglePageviewObject.create();
    assert.ok(subject);
  });
});
