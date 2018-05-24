import { computed } from '@ember/object';
import Controller from '@ember/controller';
import mapBboxController from 'mobility-explorer/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-explorer/mixins/set-textbox-closed';
import sharedActions from 'mobility-explorer/mixins/shared-actions';

export default Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox','pin'],
  center: computed('pin', function(){
    if (this.pin){
      return this.pinLocation;
    } else {
      return this.mapCenter;
    }
  }),
  zoom: 12,

  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
    },
    setIsochroneMode: function(mode){
      if (this.isochrone_mode === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    }
  }
});
