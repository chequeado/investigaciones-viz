var CHQ;

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var es_ES = {
        'decimal': ',',
        'thousands': '.',
        'grouping': [3],
        'currency': ['$', ''],
        'dateTime': '%a %b %e %X %Y',
        'date': '%d/%m/%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        'shortDays': ['Dom', 'Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sab'],
        'months': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'shortMonths': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
};

var d3ES = d3.locale(es_ES);


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
            if(i!='anio'&&i!='ente'){
                e[i] = (e[i]+'').replace(/\./g,'');
                e[i] = parseInt(e[i]);
                /*if(i=='deudas'){
                    e[i] *= -1;
                }*/
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
        $('#anios').change(function(){
            CHQ.updateChart($(this).val());
        });

    };

    CHQ.render = function(){

        var vars = ['value_GCBA','value_OA','patrimonio_total'];

        CHQ.totals = CHQ.rawData.map(function(e){
                    $.extend(e,{value_GCBA:0,value_OA:0,value_NACION:0});
                    e['value_'+e.ente] = e.patrimonio_total;
                    return e;
                });

        var chart = c3.generate({
            bindto: '#chart-container',
            data: {
                json: CHQ.totals,
                keys: {
                    x: 'anio',
                    value: vars,
                },
                types: {
                    value_GCBA: 'bar',
                    value_OA: 'bar',
                    patrimonio_total: 'line'
                },
                colors: {
                    value_GCBA: '#FFBD00',
                    value_OA: '#1A80C2',
                    patrimonio_total: '#aaa'
                },
                groups: [
                    ['value_GCBA','value_OA']
                ],
                names: {
                    value_GCBA: 'GCBA',
                    value_OA: 'OA',
                    patrimonio_total: 'Patrimonio total'    
                },
                onclick: function (d, element) {
                    $('#anios').val(d.index).change();
                }
            },
            point: {
                show: false
            },
            tooltip: {
                grouped: false, // Default true,
                format: {
                    value: d3ES.numberFormat('$,')
                    //value: function (value, ratio, id, index) { console.log('value',value); return value; }
                }
            },
            axis:{
                x:{
                    type: 'category',
                    tick: {
                      rotate: 90
                    }
                },
                y:{
                    tick: {
                      format: function (x) { return '$'+x/1000000;  }
                    }
                }

            },
            grid: {
                y: {
                    lines: [{value:0}]
                }
            },
            onrendered: function () { setTimeout(function(){
                $('#anios').val('9').change();
                $('#anios option[value="-1"]').remove();
            },2000); }
        });

    };

    CHQ.updateChart = function(index){
        d3.selectAll('rect.c3-event-rect').classed('selected-chq',false);
        d3.select('rect.c3-event-rect-'+index).classed('selected-chq',true);
        
        var data = CHQ.rawData[index];
        var detailData = [
            {label:'Bienes',value:data.bienes,icon:'bienes'},
            {label:'Acciones',value:data.acciones,icon:'acciones'},
            {label:'Ahorros',value:data.ahorros,icon:'ahorros'},
            {label:'Créditos',value:data.creditos,icon:'creditos'},
            {label:'Bienes del hogar',value:data.bienes_hogar,icon:'bienes_hogar'},
            {label:'Otros',value:data.otros,icon:'otros'},
            {label:'Bienes en el exterior',value:data.bienes_exterior,icon:'bienes_exterior'},
            {label:'Ahorros en el exterior',value:data.ahorros_exterior,icon:'ahorros_exterior'},
            {label:'Deudas',value:data.deudas,icon:'deudas'},
            {label:'Ingreso Mensual',value:data.ingreso_mensual_publico,icon:'ingreso_mensual_publico'},
        ];

        //var c10 = d3.scale.category10();

        var c10 = d3.scale.ordinal()
                  .domain(d3.range(0,detailData.length))
                  .range(['#00557C', '#66B7DD' , '#11998C', '#50D3C7', '#5151B7', '#DD8EDA', '#94408C', '#FCAF70', '#ED5F5F', '#AF1515']);

        var w = $('#chart-container').width();

        var width = w,
            barHeight = 70;

        var x = d3.scale.linear()
            .domain([0, d3.max(detailData,function(d){return parseInt(d.value); })])
            .range([0, width-barHeight-100]);

        var chart = d3.select('#detail-chart')
            .attr('width', width)
            .attr('height', barHeight * detailData.length);

        var bar = chart.selectAll('g')
            .data(detailData)

        bar.enter()
            .append('g')
            .each(function(){
                d3.select(this).append('rect');
                d3.select(this).append('text').classed('value',true);
                d3.select(this).append('text').classed('label',true);

                d3.select(this)
                    .append('svg:image')
                    .attr('xlink:href', function(d){return 'images/icons/'+d.icon+'.svg';})
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', barHeight)
                    .attr('height', barHeight);
            });
        
        bar.attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; });

        bar.select('rect')
            .attr('height', barHeight/3)
            .attr('y', barHeight/2)
            .attr('x', barHeight)
            .attr('fill',function(d,i){ return c10(i)})
            .transition()
            .attr('width', function(d){ return x(d.value);});

        bar.select('text.label')
            .text(function(d) { return  d.label; })
            .attr('y', barHeight/2-5)
            .transition()
            .attr('x', barHeight);

        bar.select('text.value')
            .text(function(d) { return (isNaN(d.value))? '':d3ES.numberFormat('$,')(d.value); })
            .attr('y', barHeight-17)
            .attr('fill',function(d,i){ return c10(i)})
            .transition()
            .attr('x', function(d) { return x(d.value) + barHeight + 5; });

    };

    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery, Tabletop, Mustache);