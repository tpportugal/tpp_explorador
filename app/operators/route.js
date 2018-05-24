import Route from '@ember/routing/route';
import mapBboxRoute from 'mobility-explorer/mixins/map-bbox-route';
import setLoading from 'mobility-explorer/mixins/set-loading';

export default Route.extend(mapBboxRoute, setLoading, {
  queryParams: {
    onestop_id: {
      // replace: true,
      refreshModel: true
    },
    bbox: {
      replace: true,
      refreshModel: true
    },
    pin: {
      replace: true,
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
    params.total=true;
    params.pin=null;

    return this.store.query('data/tpp/operator', params);
  },
  actions:{

  }
});
