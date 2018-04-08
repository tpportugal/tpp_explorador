import Ember from 'ember';

export default Ember.Component.extend({
  queryUrl: Ember.computed('bbox', 'onestop_id', 'serves', 'operated_by', 'vehicle_type', 'served_by', 'url', 'traversed_by', function(){
    if (this.entity === 'isochrones'){
      return this.url;
    } else {
      var url = 'https://tppgeo.cf/api/v1/' + this.entity + '?';
      var arrayOfQueryParams = ['style_routes_by', 'isochrone_mode', 'bus_only'];
      for (var i = 0; i < this.get('queryParams').length; i++){
        if (arrayOfQueryParams.indexOf(this.get('queryParams')[i]) === -1 && this.get(this.get('queryParams')[i]) !== null){
          arrayOfQueryParams.push(this.get('queryParams')[i]);
          if (i === 0){
            url = url + this.get('queryParams')[i] + '=' + this.get(this.get('queryParams')[i]);
          } else {
            url = url + '&' + this.get('queryParams')[i] + '=' + this.get(this.get('queryParams')[i]);
          }
        }
      }
      return url;
    }
  }),
  geoJsonUrl: Ember.computed('bbox', 'onestop_id', 'serves', 'operated_by', 'vehicle_type', 'served_by', 'url', 'traversed_by', function(){
    var url = 'https://tppgeo.cf/api/v1/' + this.entity + '.geojson?';
    var arrayOfQueryParams = ['style_routes_by', 'isochrone_mode', 'bus_only'];
    for (var i = 0; i < this.get('queryParams').length; i++){
      if (arrayOfQueryParams.indexOf(this.get('queryParams')[i]) === -1 && this.get(this.get('queryParams')[i]) !== null){
        arrayOfQueryParams.push(this.get('queryParams')[i]);
        if (i === 0){
          url = url + this.get('queryParams')[i] + '=' + this.get(this.get('queryParams')[i]);
        } else {
          url = url + '&' + this.get('queryParams')[i] + '=' + this.get(this.get('queryParams')[i]);
        }
      }
    }
    return url;
  }),
});
