import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    loading(transition, originRoute){
      let controller = this.controllerFor(this.routeName);
      controller.set('currentlyLoading.isLoading', true);
      transition.promise.finally(function(){
        controller.set('currentlyLoading.isLoading', false);
      });
    }
  }
});
