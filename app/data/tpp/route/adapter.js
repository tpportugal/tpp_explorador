import TppAdapter from '../adapter';

export default TppAdapter.extend({
  pathForType: function(modelName){
    return 'routes';
  }
});
