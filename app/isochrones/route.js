import { hash } from 'rsvp';
import $ from 'jquery';
import Route from '@ember/routing/route';
import setLoading from 'mobility-explorer/mixins/set-loading';
import ENV from 'mobility-explorer/config/environment';

export default Route.extend(setLoading, {
  queryParams: {
    isochrone_mode: {
      replace: true,
      refreshModel: true,
    },
    pin: {
      replace: true,
      refreshModel: true
    },
    departure_time: {
      replace: true,
      refreshModel: true
    },
    include_operators: {
      replace: true,
      refreshModel: true
    },
    exclude_operators: {
      replace: true,
      refreshModel: true
    },
    include_routes: {
      replace: true,
      refreshModel: true
    },
    exclude_routes: {
      replace: true,
      refreshModel: true
    },
    stop: {
      replace: true,
      refreshModel: true
    }

  },
  setupController: function (controller, model) {
    if (controller.bbox !== null){
      var coordinateArray = [];
      var bboxString = controller.bbox;
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
    controller.set('leafletBbox', controller.bbox);
    this._super(controller, model);

  },
  model: function(params){
    this.store.unloadAll('data/tpp/operator');
    this.store.unloadAll('data/tpp/stop');
    this.store.unloadAll('data/tpp/route');
    this.store.unloadAll('data/tpp/route_stop_pattern');

    if (params.isochrone_mode){
      var pinLocation = params.pin;

      if (typeof(pinLocation)==="string"){
        var pinArray = pinLocation.split(',');
        pinLocation = pinArray;
      }

      var mode = params.isochrone_mode;
      var url = ENV.valhallaHost + '/isochrone?json=';
      var linkUrl = ENV.valhallaHost + '/isochrone?json=';
      var json = {
        locations: [{'lat':pinLocation[0], 'lon':pinLocation[1]}],
        costing: mode,
        denoise: 0.3,
        polygons: true,
        generalize: 50,
        costing_options: {'pedestrian':{'use_ferry':0},'bicycle':{'use_ferry':0}},
        contours: [{'time':15},{'time':30},{'time':45},{'time':60}],
      };

      if (json.costing === 'multimodal'){
        json.denoise = 0;
        // transit_start_end_max_distance default is 2145 or about 1.5 miles for start/end distance:
        // transit_transfer_max_distance default is 800 or 0.5 miles for transfer distance:

        // exclude - exclude all of the ids listed in the filter
        // include - include only the ids listed in the filter

        // Once /routes?operated_by= accepts a comma-separated list:
        // Only query for routes operated by selected operators.

        json.costing_options.pedestrian = {
            'use_ferry':0,
            'transit_start_end_max_distance':100000,
            'transit_transfer_max_distance':100000
        };

        json.costing_options['transit']={};
        json.costing_options.transit['filters']={};

        if (params.include_operators.length > 0) {
            json.costing_options.transit.filters['operators'] = {
              'ids': params.include_operators,
              'action':'include'
            };
        } else if (params.exclude_operators.length > 0) {
          json.costing_options.transit.filters['operators'] = {
            'ids': params.exclude_operators,
            'action':'exclude'
          };
        }

        if (params.include_routes.length > 0) {
            json.costing_options.transit.filters['routes'] = {
              'ids': params.include_routes,
              'action':'include'
            };
        } else if (params.exclude_routes.length > 0) {
            json.costing_options.transit.filters["routes"] = {
              "ids": params.exclude_routes,
              'action':'exclude'
            };
        }

        if (params.departure_time){
          json.date_time = {'type': 1, 'value': params.departure_time};
        }
      }

      url = encodeURI(url + JSON.stringify(json));
      linkUrl = encodeURI(linkUrl + JSON.stringify(json));

      var isochrones = $.ajax({ url });
      var operators = this.store.query('data/tpp/operator', {bbox: params.bbox});
      var routes;

      if (params.include_operators.length > 0){
        // change routes query to be only for the selected operator(s) routes
        var includeOperators = '';
        for (var j = 0; j < params.include_operators.length; j++){
          if (j > 0){
            includeOperators += ',';
          }
          includeOperators += params.include_operators[j];
        }
        routes = this.store.query('data/tpp/route', {bbox: params.bbox, operated_by: includeOperators, include_geometry: false});
      } else {
        routes = this.store.query('data/tpp/route', {bbox: params.bbox, include_geometry: false});
      }


      return hash({
        operators: operators,
        routes: routes,
        isochrones: isochrones,
        linkUrl: linkUrl
      });
    }

  },
  actions: {
  }
});



