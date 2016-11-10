console.log('\'Allo \'Allo!');
window.onload = function() {
}

var CHQ;

;(function(global, document, $, Tabletop){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$body =  $('body');

    CHQ.init = function(zona){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }

  		cartodb.createVis('map', 'https://chequeado.carto.com/api/v2/viz/79775fb4-a789-11e6-80d8-0e3ebc282e83/viz.json')
        .done(function(vis, layers) {
            layers[1].getSubLayer(0).setSQL('SELECT * FROM concesiones_full WHERE zona = '+zona); 
        });

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