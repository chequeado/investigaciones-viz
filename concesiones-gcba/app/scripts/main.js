console.log('\'Allo \'Allo!');
window.onload = function() {
}

var CHQ;

;(function(global, document, $, Tabletop){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$body =  $('body');

    CHQ.init = function(){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }

  		cartodb.createVis('map', 'http://documentation.carto.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json');

  		CHQ.$body.removeClass('loading');

    };

    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery);