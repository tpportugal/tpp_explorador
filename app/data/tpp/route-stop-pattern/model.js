import { alias } from '@ember/object/computed';
import DS from 'ember-data';

var Route_stop_pattern = DS.Model.extend({
  identifiers: DS.attr(),
  imported_from_feed_onestop_ids: DS.attr(),
  imported_from_feed_version_sha1s: DS.attr(),
  created_or_updated_in_changeset_id: 2259,
  onestop_id: alias('id'),
  route_onestop_id: DS.attr('string'),
  stop_pattern: DS.attr(),
  stop_distances: DS.attr(),
  geometry: DS.attr(),
  color: DS.attr('string'),
  is_generated: DS.attr('boolean'),
  is_modified: DS.attr('boolean'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  trips: DS.attr(),
  tags: DS.attr(),
  default_color: 'white',
  default_opacity: 0,
  is_selected: false,
  location: (function(){
    var coordinates = this.geometry['coordinates'];
    var coordinatesLength = coordinates.length;
    var reversedCoordArray = [];
    for (var i = 0; i < coordinatesLength; i++){
        var tempCoord = null;
        var lat = this.geometry['coordinates'][i][0];
        var lon = this.geometry['coordinates'][i][1];
        tempCoord = lat;
        lat = lon;
        lon = tempCoord;
        var coordArray = [];
        coordArray.push(lat);
        coordArray.push(lon);
        reversedCoordArray.push(coordArray);
    }
    return reversedCoordArray;
  }).property('geometry'),
  rsp_as_geojson_with_outline: (function(){
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: this.geometry,
          properties: {
            color: '#444444',
            weight: 6,
            opacity: this.default_opacity
          },
          id: this.onestop_id,
          onestop_id: this.onestop_id,
        },
        {
          type: 'Feature',
          geometry: this.geometry,
          properties: {
            color: this.default_color,
            weight: 3,
            opacity: this.default_opacity
          },
        },
      ]
    };
  }).property('is_selected'),
});

export default Route_stop_pattern;
