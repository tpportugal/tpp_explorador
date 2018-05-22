import Ember from 'ember';

export default Ember.Component.extend({
  route: null,
  closeTextbox: Ember.inject.service(),
  textOptions: {
      // 'index' : 'Learn about multimodal transportation around the world. Search for a place or browse the map, and use the buttons to view transit routes, stops, and operators.',
      'index' : 'Existem tantas maneiras de ir do ponto A ao ponto B! Utilize o Explorador de Mobilidade TPP para entender as redes de transportes em Portugal. Encontre um local utilizando a caixa de pesquise ou navegando pelo mapa e utilize os botões para começar a explorar.',
      'routes' : '',
      'route-stop-patterns' : '',
      'stops' : '',
      'operators' : '',
      'isochrones' : ''
  },
  text: Ember.computed('route', function(){
    return this.get('textOptions')[this.get('route')];
  }),
  actions:{
    close: function(){
      this.sendAction();
    }
  }
});
