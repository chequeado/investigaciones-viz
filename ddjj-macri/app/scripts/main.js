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

    CHQ.postProcess = function(e,ix){
        $.each(e,function(i,item){
            if(i!='anio'){
                e[i] = (e[i]+'').replace(/\./g,'');
                e[i] = parseInt(e[i]);
                if(i=='deudas'){
                    e[i] *= -1;
                }
            }
        });
        e['id'] = ix;
        return e;
    };

    CHQ.dataLoaded = function(data,tabletop){
        CHQ.rawData = data.map(CHQ.postProcess);
    	console.log('data',CHQ.rawData);
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
//        console.log('render!');

        var vars = ['bienes','ahorros','acciones', 'deudas', 'bienes_hogar','otros'];

        var chart = c3.generate({
            bindto: '#chart-container',
            data: {
                json: CHQ.rawData,
                keys: {
                    x: 'anio',
                    value: vars,
                },
                type: 'bar',
                groups: [
                    vars
                ]
            },
            axis:{
                x:{
                    type: 'category'
                }
            },
            grid: {
                y: {
                    lines: [{value:0}]
                }
            }
        });

        var vars = ['bienes_exterior','ahorros_exterior'];

        var chart = c3.generate({
            bindto: '#chart-exterior-container',
            data: {
                json: CHQ.rawData,
                keys: {
                    x: 'anio',
                    value: vars,
                },
                type: 'bar',
                groups: [
                    vars
                ]
            },
            axis:{
                x:{
                    type: 'category'
                }
            },
            grid: {
                y: {
                    lines: [{value:0}]
                }
            }
        });

        var vars = ['patrimonio_total'];

        var chart = c3.generate({
            bindto: '#chart-total-container',
            data: {
                json: CHQ.rawData,
                keys: {
                    x: 'anio',
                    value: vars,
                },
                type: 'line',
            },
            axis:{
                x:{
                    type: 'category'
                }
            },
            grid: {
                y: {
                    lines: [{value:0}]
                }
            }
        });

        

    };

    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery, Tabletop, Mustache);