/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mobility-explorer',
    environment: environment,
    baseURL: '/',
    location: '#',
    tppDatastoreHost: 'https://api.tpp.pt',
    valhallaHost: 'https://routing.tpp.pt',
    geocodeHost: 'https://search.tpp.pt',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    moment: {
      includeLocales: ['pt']
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    valhallaServicesEnabled: true
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.tppDatastoreHost = 'https://api.tppgeo.cf';
    ENV.valhallaHost = 'https://routing.tppgeo.cf';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    if (process.env['BUILD'] === 'staging') {
      // Production build for staging domain. Use BUILD=staging before ember build command
      ENV.tppDatastoreHost = 'https://api.tppgeo.cf';
      ENV.valhallaHost = 'https://routing.tppgeo.cf';
      ENV.geocodeHost = 'https://search.tpp.pt';
      ENV.baseURL = '/explorador/';
      ENV.valhallaServicesEnabled = true;
    } else {
      // Production build for production domain.
      ENV.tppDatastoreHost = 'https://api.tpp.pt';
      ENV.valhallaHost = 'https://routing.tpp.pt';
      ENV.geocodeHost = 'https://search.tpp.pt';
      ENV.baseURL = '/explorador/';
      ENV.valhallaServicesEnabled = true;
    }
  }

  return ENV;
};
