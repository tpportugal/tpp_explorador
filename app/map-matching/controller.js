/* global L */

import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';
import setTextboxClosed from 'mobility-playground/mixins/set-textbox-closed';
import sharedActions from 'mobility-playground/mixins/shared-actions';
import xml2js from 'npm:xml2js';
import polylineEncoded from 'npm:polyline-encoded';

export default Ember.Controller.extend(mapBboxController, setTextboxClosed, sharedActions, {
  queryParams: ['bbox','pin','trace', 'costing'],
  zoom: 14,
  trace: null,
  costing: null,
  uploading: false,
  showMapMatch: false,
  selectedAttribute: null,
  gpxPlaceholder: Ember.computed('trace', function(){
    if (this.get('trace')){
      return this.get('trace');
    } else {
      return "Select a sample GPX trace...";
    }
  }),
  edges: null,
  attributesForSelection: [{ attribute: "weighted_grade", display_name: "grade" }, { attribute: "speed", display_name: "speed" }],
  html:'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="15px" width="15px" viewBox="0 0 180 180" enable-background="new 0 0 180 180" xml:space="preserve"> <path d="M90,14c-42.053,0-76,33.947-76,76c0,42.054,33.947,76,76,76c42.054,0,76-33.946,76-76C166,47.947,132.054,14,90,14L90,14z"/></svg>',
  hoverSegment: null,
  segmentPopupContent: Ember.computed('hoverSegment', function(){
    var selectedAttribute = this.get('selectedAttribute');
    var attributes = this.get('hoverSegment').attributes;
    var attributeValue = attributes[selectedAttribute]
    if (selectedAttribute === 'weighted_grade') {
      if (attributes.max_upward_grade !== 0 && attributes.max_downward_grade !== 0) {
        return "weighted grade: " + attributes.weighted_grade + "%";
      } else if (attributes.max_upward_grade !== 0) {
        return "max upward grade: " + attributes.max_upward_grade + "%";
      } else if (attributes.max_downward_grade !== 0) {
        return "max downward grade: " + attributes.max_downward_grade + "%"; 
      }
    } else {
      return "speed: " + attributes[selectedAttribute] + " mph";
    }
  }),
  selectedSegment: null,
  segmentAttributes: Ember.computed('selectedSegment', function(){
    if (this.get('selectedSegment')){
      var segments = this.get('selectedSegment').attributes;
      var attributeArray = [];
      for (var segment in segments){
        attributeArray.push({"attribute":segment, "value":segments[segment]})
      };
      return attributeArray;
    } else {
      return false;
    }
  }),
  traceAttributeSegments: Ember.computed('selectedAttribute', function() {
    if (this.get('trace')){
      var points = L.PolylineUtil.decode(this.model.mapMatchRequests.attributesRequest.shape, 6);
      var edges = this.model.mapMatchRequests.attributesRequest.edges;
      var selectedAttribute = this.get('selectedAttribute');
      var edgeCoordinates = [];
      var attributeArray = [];
      var attributeArraySum = 0;

      for (var i = 0; i < edges.length; i++){
        var attribute;
        // decide whether to use max_upward_grade and max_downward_grade or wieghted_grade
        if (selectedAttribute === 'weighted_grade') {
          if (edges[i].max_upward_grade !== 0 && edges[i].max_downward_grade !== 0) {
            attribute = edges[i].weighted_grade;
          } else if (edges[i].max_upward_grade !== 0) {
            attribute = edges[i].max_upward_grade;
          } else if (edges[i].max_downward_grade !== 0) {
            attribute = edges[i].max_downward_grade; 
          }
        } else {
          // set attribute to the value for the selected attribute
          attribute = edges[i][selectedAttribute];
        }
        // add attribute to attributeArray
        attributeArray.push(attribute);
        // increment attributeArraySum, to use to find average later
        attributeArraySum = attributeArraySum + attribute;
      }
      // sort attributeArray in ascending order
      attributeArray.sort(function(a,b){return a - b;});
      // find the minimum value in attributeArray
      var attributeArrayMin = attributeArray[0];
      // find the maximum value in attributeArray
      var attributeArrayMax = attributeArray[attributeArray.length-1];
      // find the average value for the attribute
      var attributeArrayAverage = attributeArraySum / attributeArray.length;
      // find the median value for the attribute (to use to test with different attributes)
      var attributeArrayMedian = attributeArray[Math.floor(attributeArray.length/2)];

      for (var i = 0; i < edges.length; i++){
        // create coordinate array for segment
        var begin = edges[i].begin_shape_index;
        var end =  edges[i].end_shape_index;
        var pointsSlice = points.slice(begin, end+1);
        var attributes = edges[i];    
        var mid = attributeArrayAverage;
        // var mid = attributeArrayMedian;  
        var min = attributeArrayMin;
        var max = attributeArrayMax;
      
        // may want to set midpoing to zero for grade attributes
        // if (this.get('styleAttribute') === "weighted_grade"){
        //   mid = 0;
        // }

        var attr = edges[i][selectedAttribute];
        
        // find color
          
        // Hue is a degree on the color wheel; 0 (or 360) is red, 120 is green, 240 is blue. Numbers in between reflect different shades.
        // Saturation is a percentage value; 100% is the full colour.
        // Lightness is also a percentage; 0% is dark (black), 100% is light (white), and 50% is the average.

        // HSL
        // blue: 240
        // green: 120
        // yellow: 60
        // red: 0 or 360

        var range = attributeArrayMax - attributeArrayMin;
        var percentage = (attr + attributeArrayMin) / range;

        var highColor = 0;
        var midColor = 120;
        var lowColor = 280;
    
        // set color scale around midpoint
        if (attr <= mid){
          var hue = (percentage * (midColor - lowColor));
          var color = 'hsl(' + hue + ', 90%, 50%)';
        } else if (attr > mid) {
          var hue = (percentage * (highColor - midColor));
          var color =  'hsl(' + hue + ', 90%, 50%)';
        }
        // add segment info to edgeCoordinates array, to use to draw polyline layers on map 
        edgeCoordinates.push({
          coordinates: pointsSlice,
          color: color,
          attribute: attribute,
          attributes: attributes
        })
      }
      return edgeCoordinates;
    }
  }),

// if attribute style selected, show key for colors
// if hoverSegment, show attribute value for selected attribute
// if no selected style, color segment, provide some detail on hover
// onclick for all, show full attribute table
 
  actions: {
    updatebbox(e) {
      var newbox = e.target.getBounds();
      this.set('bbox', newbox.toBBoxString());
    },
    setTrace(trace){
      this.set('trace', null);
      this.set('costing', null);
      this.set('uploading', false);
      if (document.getElementById('gpxFileUpload')){
        document.getElementById('gpxFileUpload').value = "";
      };
      this.set('selectedSegment', null);      
      this.set('showMapMatch', false);
      this.set('selectedAttribute', null);
      this.set('trace', trace.name);
    },
    setUploading(){
      this.toggleProperty('uploading');
    },
    setShowMapMatch(){
      if (this.get('showMapMatch')){
        this.set('showMapMatch', false);
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
      } else {
        this.set('selectedAttribute', null);
        this.set('showMapMatch', true);
      }
    },
    styleByAttribute(attribute){
      if (this.get('selectedAttribute') === attribute){
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
      } else {
        this.set('selectedAttribute', null);
        this.set('selectedSegment', null);      
        var attributesForSelection = this.get('attributesForSelection');
        for (var i = 0; i < attributesForSelection.length; i++){
          if (attributesForSelection[i].attribute === attribute){
            this.set('selectedAttribute', attributesForSelection[i].attribute);
          }
        }   
      }
    },
    selectSegment(segment){
      this.set('hoverSegment', segment);
    },
    unselectSegment(segment){
      this.set('hoverSegment', null);
    },
    setSegment(segment){
      this.set('selectedSegment', segment);      
    },
    uploadGpx(){
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        this.set('trace', 'user_upload');
        this.set('selectedAttribute', null);
      } else {
       alert('Sorry, this functionality is not fully supported in your browser.');
      }
    },
    fileUploadTest(files){
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        this.set('trace', 'user_upload');
        this.set('selectedAttribute', null);
      } else {
       alert('Sorry, this functionality is not fully supported in your browser.');
      }
    },
    setCosting(mode){
      if (this.get('costing') === mode){
        this.set('costing', null);
      } else {
        this.set('costing', mode);
      }
    }
  }
});