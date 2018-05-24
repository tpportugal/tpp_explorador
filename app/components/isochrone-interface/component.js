import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  pedestrianIsochrone: computed('isochrone_mode', function(){
    return this.isochrone_mode === 'pedestrian';
  }),
  bicycleIsochrone: computed('isochrone_mode', function(){
    return this.isochrone_mode === 'bicycle';
  }),
  multimodalIsochrone: computed('isochrone_mode', function(){
    return this.isochrone_mode === 'multimodal';
  }),
  autoIsochrone: computed('isochrone_mode', function(){
    return this.isochrone_mode === 'auto';
  }),
  actions:{
    setIsochroneMode(mode){
      if (this.isochrone_mode === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    },
    setIsochronesMode(){
      if (this.isochrones_mode === null){
        this.set('isochrones_mode', true);
      } else {
        this.set('isochrones_mode', null);
      }
    },
  }
});
