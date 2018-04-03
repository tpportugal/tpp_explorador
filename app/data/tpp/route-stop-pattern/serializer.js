import TppSerializer from "../serializer";

export default TppSerializer.extend({
  modelNameFromPayloadKey: function(payloadKey){
    return "data/tpp/route_stop_pattern";
  }
});
