import { computed } from '@ember/object';
import Controller from '@ember/controller';
import setTextboxClosed from 'mobility-explorer/mixins/set-textbox-closed';
import sharedActions from 'mobility-explorer/mixins/shared-actions';

export default Controller.extend(setTextboxClosed, sharedActions, {
  queryParams: ['traversed_by', 'pin'],

  traversed_by: null,
  onestop_id: null,
  serves: null,
  displayStops: false,
  hoverStop: null,
  displayRspStops: false,
  selectedRsp: null,
  bounds: computed('bbox', function(){
    if (this.bbox === null){
      var defaultBoundsArray = [];
      defaultBoundsArray.push([36.94111143010769, -13.24951171875]);
      defaultBoundsArray.push([36.94111143010769, -13.24951171875]);
      return defaultBoundsArray;
    } else {
      var coordinateArray = [];
      var bboxString = this.bbox;
      var tempArray = [];
      var boundsArray = [];

      coordinateArray = bboxString.split(',');

      for (var i = 0; i < coordinateArray.length; i++){
        tempArray.push(parseFloat(coordinateArray[i]));
      }

      var arrayOne = [];
      var arrayTwo = [];
      arrayOne.push(tempArray[1]);
      arrayOne.push(tempArray[0]);
      arrayTwo.push(tempArray[3]);
      arrayTwo.push(tempArray[2]);
      boundsArray.push(arrayOne);
      boundsArray.push(arrayTwo);
      return boundsArray;
    }
  }),
  mapMoved: false,
  mousedOver: false,

  actions: {
    updateLeafletBbox(e) {
      var leafletBounds = e.target.getBounds();
      this.set('leafletBbox', leafletBounds.toBBoxString());
    },
    updatebbox(e) {
      var bounds = this.leafletBbox;
      this.set('bbox', bounds);
      this.set('mapMoved', false);
    },
    updateMapMoved(){
      if (this.mousedOver === true){
        this.set('mapMoved', true);
      }
    },
    mouseOver(){
      this.set('mousedOver', true);
    },
    onEachFeature(feature, layer){
      layer.setStyle(feature.properties);
    },
    setOnestopId(route) {
      var onestopId = route.id;
      this.set('onestop_id', onestopId);
      this.set('selectedRoute', route);
      this.set('serves', null);
      this.set('operated_by', null);
    },
    displayStops(){
      this.toggleProperty('displayStops');
    },
    selectStop(stop){
      this.set('hoverStop', stop);
    },
    unselectStop(stop){
      this.set('hoverStop', null);
    },
    setStopOnestopId(stop) {
      var onestopId = stop.id;
      this.set('serves', null);
      this.set('hoverStop', null);
      this.set('onestop_id', onestopId);
      this.set('displayStops', false);
      this.transitionToRoute('stops', {queryParams: {bbox: this.bbox, onestop_id: this.onestop_id}});
    },
    setRsp(rsp){
      var stops, stopsLength, stopId, i;
      if (this.selectedRsp!== null){
        stops = this.selectedRsp.get('stop_pattern');
        stopsLength = stops.length;
        for (i = 0; i < stopsLength; i++){
          stopId = stops[i];
          this.store.peekRecord('data/tpp/stop',stopId).set('rsp_stop_pattern_number', null);
        }
      }
      if (this.selectedRsp!== null && this.selectedRsp.get('id') === rsp.get('id')){
        this.set('selectedRsp', null);
        rsp.set('is_selected', false);
        rsp.set('default_opacity', 0);
      } else if (this.selectedRsp!== null){
        stops = this.selectedRsp.get('stop_pattern');
        stopsLength = stops.length;
        for (i = 0; i < stopsLength; i++){
          stopId = stops[i];
          this.store.peekRecord('data/tpp/stop',stopId).set('rsp_stop_pattern_number', null);
        }
        this.selectedRsp.set('default_opacity', 0);
        rsp.set('default_opacity', 1);
        this.selectedRsp.set('is_selected', false);
        rsp.set('is_selected', true);
        this.set('selectedRsp', rsp);
        stops = this.selectedRsp.get('stop_pattern');
        stopsLength = stops.length;
        for (i = 0; i < stopsLength; i++){
          stopId = stops[i];
          this.store.peekRecord('data/tpp/stop',stopId).set('rsp_stop_pattern_number', i+1);
        }
      }
      else {
        this.set('selectedRsp', rsp);
        rsp.set('is_selected', true);
        rsp.set('default_opacity', 1);
        stops = this.selectedRsp.get('stop_pattern');
        stopsLength = stops.length;
        for (i = 0; i < stopsLength; i++){
          stopId = stops[i];
          this.store.peekRecord('data/tpp/stop',stopId).set('rsp_stop_pattern_number', i+1);
        }
      }
    }
  }
});
