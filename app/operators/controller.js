/* global L */

import { computed } from '@ember/object';

import Controller from '@ember/controller';
import mapBboxController from 'mobility-explorer/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-explorer/mixins/set-textbox-closed';
import sharedActions from 'mobility-explorer/mixins/shared-actions';


export default Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox', 'onestop_id','pin'],

  queryIsInactive: false,
  onestop_id: null,
  selectedOperator: null,
  hoverOperator: null,
  placeholderMessage: computed('leafletBbox', function(){
    var total = this.model.get('meta.total');
    if (total > 1){
      return  total + ' operadores';
    } else if (total === 1) {
      return total + ' operador';
    }
  }),
  onlyOperator: computed('onestop_id', function(){
    var data = this.operators;
    var onlyOperator = data.get('firstObject');
    if (this.onestop_id === null){
      return null;
    } else {
      return onlyOperator;
    }
  }),
  operators: computed('model', function(){
    if (this.model === null){
      return;
    } else {
      var data = this.model;
      var operators = [];
      operators = operators.concat(data.map(function(operator){return operator;}));
      return operators;
    }
  }),
  mapMoved: false,
  mousedOver: false,
  operatorSelectContent: computed(function(){
    if (this.media.isMobile){
      return 'Selecione um operador para ver informação';
    } else {
      return 'Paire sobre um operador para ver informação';
    }
  }),

  actions: {
    setOperator(operator){
      var onestop_id = operator.get('id');
      this.set('onestop_id', onestop_id);
      this.set('selectedOperator', operator);
    },
    updateLeafletBbox(e) {
      var leafletBounds = e.target.getBounds();
      this.set('leafletBbox', leafletBounds.toBBoxString());
    },
    updatebbox(e) {
      var bounds = this.leafletBbox;
      this.set('bbox', bounds);
      this.set('mapMoved', false);
    },
    updateMapMoved(){
      if (this.mousedOver === true){
        this.set('mapMoved', true);
      }
    },
    mouseOver(){
      this.set('mousedOver', true);
    },
    setOnestopId(operator) {
      var onestopId = operator.id;
      this.set('onestop_id', onestopId);
      this.set('selectedOperator', operator);
    },
    selectOperator(operator){
      this.set('mousedOver', true);
      this.set('selectedOperator', null);
      operator.set('operator_path_opacity', 1);
      operator.set('operator_path_weight', 3);
      this.set('hoverOperator', operator);
    },
    unselectOperator(operator){
      operator.set('operator_path_opacity', 0.5);
      operator.set('operator_path_weight', 1.5);
      this.set('hoverOperator', null);
    }
  }
});
