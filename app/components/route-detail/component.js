import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  routes: computed('routes', function(){
    var data = this.routes;
    var routes = [];
    routes = routes.concat(data.map(function(route){return route.name;}));
    return routes;
  })
});

