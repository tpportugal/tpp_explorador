import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  mode: computed('isochrone_mode', function(){
    if (this.isochrone_mode === 'pedestrian'){
      return 'caminhar';
    } else if (this.isochrone_mode === 'bicycle'){
      return 'pedalar';
    } else if (this.isochrone_mode === 'multimodal'){
      return 'viajar';
    } else if (this.isochrone_mode === 'auto'){
      return 'conduzir';
    }
  })
});
