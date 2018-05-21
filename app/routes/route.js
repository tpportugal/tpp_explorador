import Ember from 'ember';
import mapBboxRoute from 'mobility-explorer/mixins/map-bbox-route';
import setLoading from 'mobility-explorer/mixins/set-loading';
import ENV from 'mobility-explorer/config/environment';

export default Ember.Route.extend(mapBboxRoute, setLoading, {
  queryParams: {
    onestop_id: {
      refreshModel: true
    },
    serves: {
      refreshModel: true
    },
    operated_by: {
      refreshModel: true
    },
    vehicle_type: {
      refreshModel: true
    },
    style_routes_by: {
    },
    pin: {
      replace: true,
    }
  },
  setupController: function (controller, model) {
    if (controller.get('bbox') !== null){
      var coordinateArray = [];
      var bboxString = controller.get('bbox');
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
      controller.set('leafletBounds', boundsArray);
    }
    controller.set('leafletBbox', controller.get('bbox'));
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/tpp/operator');
    this.store.unloadAll('data/tpp/stop');
    this.store.unloadAll('data/tpp/route');
    this.store.unloadAll('data/tpp/route_stop_pattern');

    params.total=true;

    var routes = this.store.query('data/tpp/route', params);
    var stops;

    if (params.serves){
      // var url = ENV.tppDatastoreHost + '/v1/stops.geojson?onestop_id=' + params.serves;
      // var stopServedByRoutes = Ember.$.ajax({ url });
      // return Ember.RSVP.hash({
      //   routes: routes,
      //   stopServedByRoutes: stopServedByRoutes
      // });
      stops = this.store.query('data/tpp/stop', {onestop_id: params.serves});
      return Ember.RSVP.hash({
        routes: routes,
        stops: stops
      });

    } else if (params.onestop_id){
      var url = ENV.tppDatastoreHost + '/v1/stops.geojson?per_page=false&served_by=' + params.onestop_id;
      stops = Ember.$.ajax({ url });
      return Ember.RSVP.hash({
        routes: routes,
        stops: stops
      });
    } else {
      return Ember.RSVP.hash({
        routes: routes,
      });
    }
  },
  actions: {

  }
});
