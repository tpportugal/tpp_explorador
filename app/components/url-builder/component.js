import { computed } from '@ember/object';
import Component from '@ember/component';
import ENV from 'mobility-explorer/config/environment';

export default Component.extend({
  queryUrl: computed('bbox', 'onestop_id', 'serves', 'operated_by', 'vehicle_type', 'served_by', 'url', 'traversed_by', function(){
    if (this.entity === 'isochrones'){
      return this.url;
    } else {
      var url = ENV.tppDatastoreHost + '/v1/' + this.entity + '?';
      var arrayOfQueryParams = ['style_routes_by', 'isochrone_mode', 'bus_only'];
      for (var i = 0; i < this.queryParams.length; i++){
        if (arrayOfQueryParams.indexOf(this.queryParams[i]) === -1 && this.get(this.queryParams[i]) !== null){
          arrayOfQueryParams.push(this.queryParams[i]);
          if (i === 0){
            url = url + this.queryParams[i] + '=' + this.get(this.queryParams[i]);
          } else {
            url = url + '&' + this.queryParams[i] + '=' + this.get(this.queryParams[i]);
          }
        }
      }
      return url;
    }
  }),
  geoJsonUrl: computed('bbox', 'onestop_id', 'serves', 'operated_by', 'vehicle_type', 'served_by', 'url', 'traversed_by', function(){
    var url = ENV.tppDatastoreHost + '/v1/' + this.entity + '.geojson?';
    var arrayOfQueryParams = ['style_routes_by', 'isochrone_mode', 'bus_only'];
    for (var i = 0; i < this.queryParams.length; i++){
      if (arrayOfQueryParams.indexOf(this.queryParams[i]) === -1 && this.get(this.queryParams[i]) !== null){
        arrayOfQueryParams.push(this.queryParams[i]);
        if (i === 0){
          url = url + this.queryParams[i] + '=' + this.get(this.queryParams[i]);
        } else {
          url = url + '&' + this.queryParams[i] + '=' + this.get(this.queryParams[i]);
        }
      }
    }
    return url;
  }),
});
