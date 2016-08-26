var CHQ;

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

;(function(global, document, $, Tabletop, Mustache){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$body =  $('body'); 

    CHQ.init = function(){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        Tabletop.init( { key: '1upUGqPIAWsGpk00BecZbVpoWowPuGHm96pwPv_hppAs',
                   callback: CHQ.dataLoaded,
                   simpleSheet: true,
                   parseNumbers: true
               } );

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }

    };

    CHQ.dataLoaded = function(data,tabletop){
    	console.log('data',data);
        CHQ.$body.removeClass('loading');
        CHQ.render();
        setTimeout(CHQ.startEvents,2000);
    };

    CHQ.startEvents = function(){

        $(window).resize(function() {
            clearTimeout(CHQ.timeoutId);
            CHQ.timeoutId = setTimeout(CHQ.render, 500);
            
        });

    };

    CHQ.render = function(){

        var w = $('#chart-container').width();
        console.log('render!');

    };

    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery, Tabletop, Mustache);