import TppSerializer from "../serializer";

export default TppSerializer.extend({
  // attrs: {
  //  routes: {
  //    key: 'routes_serving_stop.route_onestop_id'
  //  }
  // },
  modelNameFromPayloadKey: function(payloadKey){
    return 'data/tpp/stop';
  }
});
