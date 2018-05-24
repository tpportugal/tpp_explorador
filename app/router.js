import EmberRouter from '@ember/routing/router';
import config from 'mobility-explorer/config/environment';


const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('routes', function(){
    this.route('route', { path: "/:route-id" });
    this.route('loading');
  });
  this.route('stops', function(){
    this.route('by-frequency');
    this.route('walkshed');
    this.route('transitshed');
    this.route('stop', { path: "/:stop-id" });
  });
  this.route('operators', function(){
    this.route('service-areas');
    this.route('operator', { path: "/:operator-id" });
  });
  this.route('route-stop-patterns', function(){
  });
  this.route('error', { path: "*path" });
  this.route('isochrones');
  this.route('map-matching');
});

export default Router;
