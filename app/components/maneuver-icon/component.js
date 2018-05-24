import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  maneuverIcon: computed('trace', function(){
    // this icon logic comes from the Turn-by-Turn demo
    var id = this.maneuver.type;

    // Zero-pad this id to two digits
    id = ('0' + id.toString()).slice(-2);

    if (id === '00' || id === '02' || id === '03' || id === '36') {
      id = '01';
    }

    id = 'maneuver-' + id;

    return id;
  }),
});
