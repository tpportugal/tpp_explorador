/* global L */

import Ember from 'ember';

export default Ember.Component.extend({
  lat: 39.64,
  lng: -8.15,
  zoom: 7,
  bbox: null,
  resetButton: false,
  testLocation: [38.73, -9.15],
  testLocationTwo: [41.14, -8.61],
  icon: L.icon({
    iconUrl: 'assets/images/marker.png',
    iconSize: (20, 20)
  }),
  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
      this.get('getbbox')(newbox);
    }
  }
});
