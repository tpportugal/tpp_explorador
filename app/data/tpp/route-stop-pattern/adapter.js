import TppAdapter from "../adapter";

export default TppAdapter.extend({
  pathForType: function(modelName){
    return "route_stop_patterns";
  }
});
