import Component from '@ember/component';

export default Component.extend({
  bBox: null,
  queryParams: {
    bBox: {
      replace: true
    }
  },
  activeRoute: 'index',
  test: false,
  activeIndexRoute: function(){
    if (this.test === true){
      return true;
    }
  },
  activeOperatorsRoute: function(){
    if (this.activeRoute === 'operators'){
      return true;
    }
  },
  activeRoutesRoute: function(){
    if(this.activeRoute === 'routes'){
      return true;
    }
  },
  activeStopsRoute: function(){
    if(this.activeRoute === 'stops'){
      return true;
    }
  }
});
