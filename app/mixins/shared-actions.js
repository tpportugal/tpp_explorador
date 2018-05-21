/* global L */

import Ember from 'ember';
import ENV from 'mobility-explorer/config/environment';

export default Ember.Mixin.create({
  bbox: null,
  closeTextbox: Ember.inject.service(),
  currentlyLoading: Ember.inject.service(),
  icon: L.icon({
    iconUrl: 'assets/images/marker1.png',
    iconSize: (20, 20),
    iconAnchor: [10, 24],
  }),
  leafletBbox: null,
  leafletBounds: [[41.12, -8.66],[41.16, -8.58]],
  mapCenter: [41.14, -8.62],
  pin: null,
  pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==='string'){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
  }),
  place: null,
  textboxIsClosed: Ember.computed('closeTextbox.textboxIsClosed', function(){
    if (localStorage.getItem('mobility-explorer-hide-intro') === 'true'){
        return true;
    } else {
      return this.get('closeTextbox').get('textboxIsClosed');
    }
  }),
  searchbarContent: Ember.computed(function(){
    if (this.media.isMobile){
      return 'Pesquise um local';
    } else {
      return 'Pesquise um local';
    }
  }),
  valhallaServicesEnabled: Ember.computed.alias(ENV.valhallaServicesEnabled),
  webGL: Ember.computed(function(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
  }),

  actions: {
    dropPin: function(e){
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      this.set('mapCenter', coordinates);
      this.set('leafletBbox', this.get('bbox'));
    },
    removePin: function(){
      var pinCoordinateArray = this.get('pin').split(',');
      pinCoordinateArray[0] = parseFloat(pinCoordinateArray[0]);
      pinCoordinateArray[1] = parseFloat(pinCoordinateArray[1]);
      this.set('mapCenter', pinCoordinateArray);
      this.set('pin', null);
    },
    searchRepo: function(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = ENV.geocodeHost + `/search.php?format=json&q=${term}`;
      return Ember.$.ajax({ url }).then(json => json);
    },
    setPlace: function(selected){
      this.set('pin', null);
      //var lng = selected.geometry.coordinates[0];
      //var lat = selected.geometry.coordinates[1];
      var lng = selected.lon;
      var lat = selected.lat;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('place', selected);
      this.set('pin', coordinates);
      this.set('mapCenter', coordinates);
      this.transitionToRoute('index', {queryParams: {pin: this.get('pin'), bbox: null}});
    },
    clearPlace: function(){
      this.set('place', null);
    }
  }
});
