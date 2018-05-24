/* global moment */
import { computed } from '@ember/object';

import Controller from '@ember/controller';
import mapBboxController from 'mobility-explorer/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-explorer/mixins/set-textbox-closed';
import sharedActions from 'mobility-explorer/mixins/shared-actions';


export default Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['onestop_id', 'isochrone_mode', 'pin', 'departure_time', 'include_operators', 'exclude_operators', 'include_routes', 'exclude_routes', 'stop'],

  onestop_id: null,
  departure_time: null,
  isochrone_mode: null,
  moment: moment(),
  mousedOver: false,
  include_operators: [],
  exclude_operators: [],
  include_routes: [],
  exclude_routes: [],
  stop: null,

  // this iterates through the arrays for the included and excluded query params, and sets the included or excluded
  // model attributes for the entities with listed onestopIDs
  markIncludedExcluded: computed('include_operators', function(){
    if (this.exclude_operators.length > 0) {
      for (var i = 0; i < this.exclude_operators.length; i++){
        var excludeOperator = this.exclude_operators[i];
        this.store.peekRecord('data/tpp/operator', excludeOperator).set('exclude', true);
      }
    }

    if (this.include_operators.length > 0) {
      for (var j = 0; j < this.include_operators.length; j++){
        var includeOperator = this.include_operators[j];
        this.store.peekRecord('data/tpp/operator', includeOperator).set('include', true);
      }
    }

    if (this.exclude_routes.length > 0) {
      for (var k = 0; k < this.exclude_routes.length; k++){
        var excludeRoute = this.exclude_routes[k];
        this.store.peekRecord('data/tpp/route', excludeRoute).set('exclude', true);
      }
    }

    if (this.include_routes.length > 0) {
      for (var l = 0; l < this.include_routes.length; l++){
        var includeRoute = this.include_routes[l];
        this.store.peekRecord('data/tpp/route', includeRoute).set('include', true);
      }
    }
    return true;
  }),

  actions: {
    updateLeafletBbox(e) {
      var leafletBounds = e.target.getBounds();
      this.set('leafletBbox', leafletBounds.toBBoxString());
    },
    updateMapMoved(e){
      if (this.mousedOver === true){
        this.set('mapMoved', true);
      }
    },
    mouseOver(){
      this.set('mousedOver', true);
    },
    closePopup: function(e){
      e.target.closePopup();
    },
    updatePin: function(e){
      var lat = e.target._latlng.lat;
      var lng = e.target._latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      var bounds = this.leafletBbox;
      this.set('bbox', bounds);
    },
    removePin: function(){
      this.set('pin', null);
      this.set('isochrone_mode', null);
    },
    setIsochroneMode: function(mode){
      this.set('departure_time', null);
      if (this.isochrone_mode === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    },
    change(date){
      var dateString = date.toString();
      var dateArray = dateString.split(' ');
      var monthString = dateArray[1];
      var day = dateArray[2];
      var year = dateArray[3];
      var timeArray = dateArray[4].split(':');
      var hour = timeArray[0];
      var minute = timeArray[1];
      var month = {
        'Jan' : '01',
        'Fev' : '02',
        'Mar' : '03',
        'Abr' : '04',
        'Mai' : '05',
        'Jun' : '06',
        'Jul' : '07',
        'Ago' : '08',
        'Set' : '09',
        'Out' : '10',
        'Nov' : '11',
        'Dez' : '12'
      };
      var newDepartureTime = year + '-' + month[monthString] + '-' + day + 'T' + hour + ':' + minute;

      // This is the local date and time at the location.
      // value:
      // the date and time is specified in ISO 8601 format (YYYY-MM-DDThh:mm) in
      // the local time zone of departure or arrival. For example "2016-07-03T08:06"
      // ISO 8601 uses the 24-hour clock system.
      // A single point in time can be represented by concatenating a complete date expression,
      // the letter T as a delimiter, and a valid time expression. For example, "2007-04-05T14:30".

      this.set('departure_time', newDepartureTime);
    },
    resetDepartureTime: function(){
      this.set('moment', moment());
      this.set('departure_time', null);
    },
    includeOperator: function(operator){
      if (this.include_operators.includes(operator.id)){
        this.include_operators.removeObject(operator.id);
        this.store.peekRecord('data/tpp/operator', operator.id).set('include', false);
      } else {
        this.include_operators.pushObject(operator.id);
        this.store.peekRecord('data/tpp/operator', operator.id).set('include', true);
        if (this.exclude_operators.includes(operator.id)){
          this.exclude_operators.removeObject(operator.id);
          this.store.peekRecord('data/tpp/operator', operator.id).set('exclude', false);
        }
      }
      this.exclude_operators.clear();
    },
    excludeOperator: function(operator){
      if (this.exclude_operators.includes(operator.id)){
        this.store.peekRecord('data/tpp/operator', operator.id).set('exclude', false);
        this.exclude_operators.removeObject(operator.id);
      } else {
        this.store.peekRecord('data/tpp/operator', operator.id).set('exclude', true);
        this.exclude_operators.pushObject(operator.id);
        if (this.include_operators.includes(operator.id)){
          this.store.peekRecord('data/tpp/operator', operator.id).set('include', false);
          this.include_operators.removeObject(operator.id);
        }
      }
      this.include_operators.clear();
    },
    includeRoute: function(route){
      if (this.include_routes.includes(route.id)){
        this.store.peekRecord('data/tpp/route', route.id).set('include', false);
        this.include_routes.removeObject(route.id);
      } else {
        this.store.peekRecord('data/tpp/route', route.id).set('include', true);
        this.include_routes.pushObject(route.id);
        if (this.exclude_routes.includes(route.id)){
          this.store.peekRecord('data/tpp/route', route.id).set('exclude', false);
          this.exclude_routes.removeObject(route.id);
        }
      }
      this.exclude_routes.clear();
    },
    excludeRoute: function(route){
      if (this.exclude_routes.includes(route.id)){
        this.exclude_routes.removeObject(route.id);
        this.store.peekRecord('data/tpp/route', route.id).set('exclude', false);
      } else {
        this.exclude_routes.pushObject(route.id);
        this.store.peekRecord('data/tpp/route', route.id).set('exclude', true);
        if (this.include_routes.includes(route.id)){
          this.include_routes.removeObject(route.id);
          this.store.peekRecord('data/tpp/route', route.id).set('include', false);
        }
      }
      this.include_routes.clear();
    }
  }
});
