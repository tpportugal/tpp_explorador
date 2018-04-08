import Ember from 'ember';

export default Ember.Component.extend({
  mode: Ember.computed('isochrone_mode', function(){
    if (this.get('isochrone_mode') === 'pedestrian'){
      return 'caminhar';
    } else if (this.get('isochrone_mode') === 'bicycle'){
      return 'pedalar';
    } else if (this.get('isochrone_mode') === 'multimodal'){
      return 'viajar';
    } else if (this.get('isochrone_mode') === 'auto'){
      return 'conduzir';
    }
  })
});
