import Route from '@ember/routing/route';
import setLoading from 'mobility-explorer/mixins/set-loading';

export default Route.extend(setLoading, {
  queryParams: {
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
  actions: {
  }
});



