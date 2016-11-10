console.log('\'Allo \'Allo!');
window.onload = function() {
}

var CHQ;

;(function(global, document, $, Tabletop){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$body =  $('body');

    CHQ.init = function(key){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }

  		cartodb.createVis('map', 'https://chequeado.carto.com/api/v2/viz/'+key+'/viz.json');

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