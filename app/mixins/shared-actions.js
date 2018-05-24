/* global L */

import $ from 'jquery';

import { isBlank } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import ENV from 'mobility-explorer/config/environment';

export default Mixin.create({
  bbox: null,
  closeTextbox: service(),
  currentlyLoading: service(),
  icon: L.icon({
    iconUrl: 'assets/images/marker1.png',
    iconSize: (20, 20),
    iconAnchor: [10, 24],
  }),
  leafletBbox: null,
  leafletBounds: [[41.12, -8.66],[41.16, -8.58]],
  mapCenter: [41.14, -8.62],
  pin: null,
  pinLocation: computed('pin', function(){
    if (typeof(this.pin)==='string'){
      var pinArray = this.pin.split(',');
      return pinArray;
    } else {
      return this.pin;
    }
  }),
  place: null,
  textboxIsClosed: computed('closeTextbox.textboxIsClosed', function(){
    if (localStorage.getItem('mobility-explorer-hide-intro') === 'true'){
        return true;
    } else {
      return this.closeTextbox.get('textboxIsClosed');
    }
  }),
  searchbarContent: computed(function(){
    if (this.media.isMobile){
      return 'Pesquise um local';
    } else {
      return 'Pesquise um local';
    }
  }),
  valhallaServicesEnabled: alias(ENV.valhallaServicesEnabled),
  webGL: computed(function(){
    var canvas = document.createElement('canvas');
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
      this.set('leafletBbox', this.bbox);
    },
    removePin: function(){
      var pinCoordinateArray = this.pin.split(',');
      pinCoordinateArray[0] = parseFloat(pinCoordinateArray[0]);
      pinCoordinateArray[1] = parseFloat(pinCoordinateArray[1]);
      this.set('mapCenter', pinCoordinateArray);
      this.set('pin', null);
    },
    searchRepo: function(term) {
      if (isBlank(term)) { return []; }
      const url = ENV.geocodeHost + `/search.php?format=json&q=${term}`;
      return $.ajax({ url }).then(json => json);
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
      this.transitionToRoute('index', {queryParams: {pin: this.pin, bbox: null}});
    },
    clearPlace: function(){
      this.set('place', null);
    }
  }
});
