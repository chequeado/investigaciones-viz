var CHQ;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

;(function(global, document, $, Mustache){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$details = $('#details');

    CHQ.$tips = $('#tips');

    CHQ.$body =  $('body');

    CHQ.$colChart = $('#col-chart-container');

    CHQ.$colOptions = $('#selectors');

    CHQ.circles;

    CHQ.year = 'promedio';
    CHQ.group = 'center';

    CHQ.init = function(){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        d3.csv(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSuIxxul7mZnK2hcayF8tR9slJ8O31jtGqACGiyEeaFy1NOOi2CT0JUOxML1GBYCT-QVguRHKdB-w4/pub?gid=1208382772&single=true&output=csv'
          , CHQ.dataLoaded
        );

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }

        //console.log('iframe?',CHQ.inIframe());
    };

    CHQ.postProcess = function(e,i){
        e['max'] = 0;
        e['id'] = i;
        $.each(e,function(i,item){
            if(i.indexOf('porcentaje_') == 0){
                e[i] = parseFloat(e[i].replace(',','.'));
                if(e[i]>e['max'])
                    e['max'] = e[i];
            }
        });
        return e;
    };

    CHQ.dataLoaded = function(data){
        CHQ.rawData = data.map(CHQ.postProcess);
        CHQ.groups = d3.nest()
            .key(function(d) { return d.sector.trim(); })
            .map(CHQ.rawData);
        CHQ.categories = d3.keys(CHQ.groups);
        CHQ.dataById = d3.nest()
            .key(function(d) { return d.id; })
            .rollup(function(leaves) {
                return leaves[0];
            })
            .map(CHQ.rawData);
        CHQ.maxValue = d3.max(CHQ.rawData,function(d){
            return d.max;
        });
        CHQ.$body.removeClass('loading');
        CHQ.render();
        CHQ.renderSelect();
        setTimeout(CHQ.startEvents,2000);
    };

    CHQ.filterData = function(){
        var filtered = $.extend(true, [], CHQ.rawData).map(function(d){
          if(isNaN(d['porcentaje_'+CHQ.year])) {
            d.noPresentaron = true;
            d['porcentaje_'+CHQ.year] = 0;
          } else {
            d.noPresentaron = false;
          }
          return d;
        });
        CHQ.data = filtered.map(function(d){return {id:d.id,empresa:d.empresa,sector:d.sector,noPresentaron:d.noPresentaron,anio:CHQ.year,porcentaje:d['porcentaje_'+CHQ.year]}});
    };

    CHQ.startEvents = function(){

//        CHQ.circles


        $(window).resize(function() {
            clearTimeout(CHQ.timeoutId);
            CHQ.timeoutId = setTimeout(CHQ.render, 500);

        });
        $('.btn-year').on('click',function(){
            $('.btn-year').removeClass('btn-selected');
            $(this).addClass('btn-selected');
            CHQ.year = $(this).data('value');
            CHQ.render();
        });
        $('.btn-order').on('click',function(){
            $('.btn-order').removeClass('btn-selected');
            $(this).addClass('btn-selected');
            CHQ.group = $(this).data('value');
            CHQ.render();
        });
        $('#close-details').on('click',CHQ.closeDetails);
    };

    CHQ.render = function(){
//        console.log(CHQ.data);
//        console.log(CHQ.groups);
//        console.log(CHQ.categories);
//        console.log(CHQ.maxValue);

        CHQ.filterData();

        //console.log(CHQ.data);

        var w = $('#chart-container').width();

        CHQ.smallDevice = (w < 990);

        var h = (!CHQ.smallDevice && !CHQ.selectedId)?(w*9)/16:(w*3)/4;

        var width = w,
            height = h,
            padding = 2, // separation between same-color circles
            clusterPadding = 2, // separation between different-color circles
            maxRadius = w/25,
            minRadius = w/100,
            max2Radius = w/75,
            min2Radius = w/150;

        CHQ.color = d3.scale.category20()
            .domain(CHQ.categories);

        var clusters,nodes,rScale;

        var dataLegend = {
          max: Math.ceil(CHQ.maxValue),
          min: 0,
          minSize:0,
          maxSize:0,
          classContainer: (!CHQ.smallDevice && !CHQ.selectedId && !CHQ.group!='center')?'col-md-7':'col-sm-12 col-xs-12',
          //classRef: (!CHQ.smallDevice && !CHQ.selectedId && !CHQ.group!='center')?'col-md-4':'col-sm-4 col-xs-12'
        };

        switch(CHQ.group){
          case 'center':
            rScale = d3.scale.linear()
              .domain([0,CHQ.maxValue])
              .range([minRadius,maxRadius]);

            dataLegend.minSize = (minRadius<5)?20:minRadius*2;
            dataLegend.maxSize = maxRadius*2;

            // The largest node for each cluster.
            clusters = new Array(CHQ.categories.length);

            nodes = CHQ.data.map(function(d) {
              var i = d.sector,
                  r = rScale(d.porcentaje),
                  d = {cluster: i, radius: r,data:d};

                  if (!clusters[i] || (r > clusters[i].radius)){
                    clusters[i] = d;
                  }

              return d;
            });

            if(CHQ.textGroup){
              CHQ.textGroup.selectAll('text').style('opacity',0);
            }
          break;
          case 'sector':
            rScale = d3.scale.linear()
              .domain([0,CHQ.maxValue])
              .range([min2Radius,max2Radius]);

            dataLegend.minSize = (min2Radius<5)?20:min2Radius*2;
            dataLegend.maxSize = max2Radius*2;

            clusters = new Array(CHQ.categories.length);
            var clusterPoints = new Array(CHQ.categories.length);
            var textos = [];

            var wCol = Math.floor(width/11),
                hRow = Math.floor(height/4),
                cols = d3.range(0,width,wCol),
                rows = d3.range(0,height,hRow),
                ixCols = 0,
                ixRows = 1;

            nodes = CHQ.data.map(function(d) {
              var i = d.sector,
                  r = rScale(d.porcentaje),
                  d = {cluster: i, radius: r,data:d};

                  if (!clusterPoints[i]){
                    if(cols[ixCols+2]){
                      ixCols += 1;
                    }else{
                      ixCols = 1;
                      ixRows += 1;
                    }

                    var qty = CHQ.groups[d.cluster].length;
                    var gap = 0;
                    gap = (qty>5)?max2Radius*1:gap;
                    gap = (qty>10)?max2Radius*1.5:gap;
                    gap = (qty>15)?max2Radius*2:gap;

                    textos.push({x:cols[ixCols],y:rows[ixRows]-max2Radius*5,radius:3,title:i,anchor:'middle'});
                    clusterPoints[i] = {x:cols[ixCols],y:rows[ixRows]-max2Radius*2+gap,radius:3,title:i,anchor:'middle'};
                  }

                  if (!clusters[i] || (r > clusters[i].radius)){
                    clusters[i] = d;
                  }

              return d;
            });

            if(!CHQ.smallDevice){
              //titles
              d3plus.textBox()
                .select('g#text-chart-group')
                .data(textos)
                .width(wCol)
                .text(function(d) { return d.title; })
                .textAnchor(function(d) { return d.anchor; })
                .x(function(d) { return d.x-(wCol/2); })
                .y(function(d) {
                  /*if(d.title == 'Bancos'){
                    return d.y - max2Radius*6;
                  }
                  var qty = CHQ.groups[d.title].length;
                  var gap = max2Radius*3;
                  gap = (qty>5)?max2Radius*4:gap;
                  gap = (qty>10)?max2Radius*5:gap;
                  gap = (qty>15)?max2Radius*5.5:gap;*/
                  return d.y; })
                .fontSize(12)
                ();

              CHQ.textGroup.selectAll('text').style('opacity',1);
            } else {
              CHQ.textGroup.selectAll('text').style('opacity',0);
            }

            //Render select
            CHQ.renderSelect();

          break;
        }

        //RenderLegend
        var template = $('#tpl-legend').html();
        Mustache.parse(template);

        dataLegend.midSize = (dataLegend.minSize + dataLegend.maxSize)/2;
        dataLegend.midPadding = (dataLegend.maxSize - dataLegend.midSize)/2;
        dataLegend.minPadding = (dataLegend.maxSize - dataLegend.minSize)/2;
        dataLegend.txtPadding = (dataLegend.maxSize - 20)/2;

        var rendered = Mustache.render(template, dataLegend);
        $('#legend-container').html(rendered);

        //console.log(nodes);
        //console.log(clusters);

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(1)
            .on('tick', tick)
            .start();

        if(!CHQ.svg) {
            CHQ.svg = d3.select('#chart-container').append('svg').attr('id','main-chart-svg');
            CHQ.circlesGroup = CHQ.svg.append('g').attr('id','circles-chart-group');
            CHQ.textGroup = CHQ.svg.append('g').attr('id','text-chart-group');

            CHQ.tooltip = d3.select('body')
                .append('div')
                .attr('id','circle-tooltip');
            CHQ.selector = CHQ.svg.append('circle')
                .attr('id','selector')
                .style('stroke-width',3)
                .style('opacity',0)
                .attr('fill','none');
        }

        CHQ.svg
          .attr('width', width)
          .attr('height', height);

        CHQ.circles = CHQ.circlesGroup.selectAll('circle.company')
            .data(nodes);

        CHQ.circles
            .enter()
            .append('circle')
            .classed('company',true)
            .on('click',function(d){
                CHQ.openDetails(CHQ.dataById[d.data.id]);
                d3.selectAll('circle').classed('selected',false);
                d3.select(this).classed('selected',true);
            })
            .on('mouseenter',function(d){
              var c = d3.select(this);
              CHQ.selector
                .attr('stroke',d3.rgb(CHQ.color(d.data.sector)).darker().toString())
                .attr('r',Math.round(c.attr('r')))
                .attr('cx',c.attr('cx'))
                .attr('cy',c.attr('cy'))
                .style('opacity',1)
                .transition()
                .delay(200)
                .style('opacity',0)
                .attr('r',Math.round(c.attr('r'))+30);

                var html = '';
                if(d.data.noPresentaron){
                  html += '<strong>No declaró</strong> públicamente sus ganancias ';
                } else {
                  html += '<strong>'+d.data.empresa+'</strong> pagó el <strong>'+(d.data.porcentaje+'').replace('.',',')+'%</strong>';
                }

                if(d.data.anio=='promedio'){
                  html += ' en promedio entre <strong>2012 y 2015</strong>';
                } else {
                  html += ' en el año <strong>'+d.data.anio+'</strong>';
                }

              CHQ.tooltip
                .html(html)
                .style('opacity',1);

                c.attr('stroke',d3.rgb(CHQ.color(d.data.sector)).darker().toString());
            })
            .on('mousemove', function(){
                CHQ.tooltip
                  .style('top',(d3.event.pageY-20)+'px')
                  .style('left',(d3.event.pageX+20)+'px');
            })
            .on('mouseout',function(d){
                CHQ.tooltip.style('opacity',0);
            });

        CHQ.circles
            .attr('id',function(d){return 'e'+d.data.id})
            .attr('stroke',function(d){
              if(d.data.noPresentaron){
                return 'black';
              }
              return CHQ.color(d.data.sector);
            })
            .classed('zero',function(d){
              return (d.data.porcentaje == 0)?true:false;
            })
            .attr('r', function(d) {
              if(d.data.noPresentaron){
                return rScale(0);
              }
              return d.radius;
            })
            .style('fill', function(d) {
              if(d.data.noPresentaron){
                return 'black';
              }
              if(d.data.porcentaje == 0){
                return 'white';
              }
              return CHQ.color(d.cluster);
            })
            .call(force.drag);

        CHQ.circles.exit().remove();

        //CHQ.startEvents();

        CHQ.selector.moveToFront();

        if(CHQ.selectedId){
          CHQ.openDetails(CHQ.dataById[CHQ.selectedId]);
          d3.selectAll('circle').classed('selected',false);
          d3.select('#e'+CHQ.selectedId).classed('selected',true);
        }

        function tick(e) {
          CHQ.circles
              .each(cluster(10 * e.alpha * e.alpha))
              .each(collide(.5))
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
          return function(d) {

            var cluster = clusters[d.cluster];
            var k = 1;

            if(cluster){
                // For cluster nodes, apply custom gravity.
                if (cluster === d) {
                  if(clusterPoints){
                    cluster = clusterPoints[d.cluster];
                    cluster = {x: cluster.x, y: cluster.y, radius: -cluster.radius};
                    k = .5 * Math.sqrt(d.radius);
                  } else {
                    cluster = {x: width / 2, y: height / 3, radius: -d.radius};
                    k = .1 * Math.sqrt(d.radius);
                  }
                }

                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                  l = (l - r) / l * alpha * k;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  cluster.x += x;
                  cluster.y += y;
                }
            }

          };
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
          var quadtree = d3.geom.quadtree(nodes);
          return function(d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
    };

    CHQ.renderSelect = function(cat){
      if(CHQ.selectedId){
        var selected = CHQ.dataById[CHQ.selectedId];
  //      cat = selected.sector;
        cat = (cat)?cat:selected.sector;
      }
      var template = $('#tpl-select-industry').html();
      Mustache.parse(template);

      var data = {
        categories: CHQ.categories.map(function(c){
          var sel = (cat)?c==cat:false;
          return {val: c, txt: c, sel: sel};
        }),
        empresasOption: (cat)?true:false,
        empresas: (cat)?CHQ.groups[cat].map(function(e){
          var sel = e.id==CHQ.selectedId;
          return {val: e.id, txt: e.empresa, sel: sel}
        }):false
      };

      data.categories.unshift({val: '', txt: '< sector >', sel: (cat)?false:true});

      var rendered = Mustache.render(template, data);
      $('#select-block').html(rendered);

      $('#category').on('change',function(){
        var cat = $(this).val();
        if(cat != '' ){
          CHQ.renderSelect(cat);
          $('#empresa').change();
        }
      });

      $('#empresa').on('change',function(){
        var id = $(this).val();
        CHQ.openDetails(CHQ.dataById[id]);
        d3.selectAll('circle').classed('selected',false);
        d3.select('circle#e'+id).classed('selected',true).style('stroke',function(d){
          return d3.rgb(CHQ.color(d.data.sector)).darker().toString();
        });
      });


    };

    CHQ.openDetails = function(data){

      $('body').addClass('detailsOpened');

      CHQ.selectedId = data.id;

      if(CHQ.$colChart.hasClass('col-md-12')){
        CHQ.$colChart.removeClass('col-md-12').addClass('col-md-7');
        CHQ.render();
        CHQ.$details.fadeIn();
        CHQ.$tips.hide();
        CHQ.$colOptions.removeClass('col-sm-7').addClass('col-sm-12');
      }

      var template = $('#tpl-details').html();
      Mustache.parse(template);   // optional, speeds up future uses
      data.color = CHQ.color(data.sector);
      data.selectedYear = CHQ.year;
      data.isPromedio = (CHQ.year == 'promedio');
      data.selectedValue = (data['porcentaje_'+CHQ.year]+'').replace('.',',');
      data.noPresentaron = (isNaN(data['porcentaje_'+CHQ.year]))?true:false;
      var rendered = Mustache.render(template, data);
      $('#details-block').html(rendered);

      var years = {};

      $.each(data,function(i,item){
        if(i.indexOf('_') !== -1){
          i = i.split('_');
          years[i[1]] = true;
        }
      });

      years = d3.keys(years).sort();

      var json = [];

      $.each(years,function(ix,year){
        var obj = {anio:year};
        $.each(data,function(i,item){
          if(i.indexOf('_') !== -1){
            i = i.split('_');
            if(i[1]==year){
              obj[i[0]] = item;
            }
          }
        });
        json.push(obj);
      });

      var promedio = json.filter(function(a){
                return a.anio == 'promedio'
              })[0];

      var lines = [
                  {value: promedio.porcentaje, text: promedio.porcentaje + '% promedio'},
                ];

      json = json.filter(function(e){
                return e.anio != 'promedio';
              });

      var pconfig = {
              json: json,
              keys: {
                x: 'anio',
                value: ['porcentaje'],
              },
              type: 'bar',
              colors: {
                porcentaje: data.color
              }
          };

      CHQ.pchart = c3.generate({
        bindto: '#per-chart',
        data: pconfig,
        bar: {
          width: {
            ratio: 0.5
          }
        },
        size: {
            height: 100
        },
        axis: {
            y:{
              label: 'Porcentaje',
              min: 0,
              show:false,
              padding: {bottom: 0,top:10}
            },
            x: {
              type: 'category'
            }
        },
        grid: {
              y: {
                lines: lines
              }
            },
        legend: {
          show: false
        },
        tooltip: {
          format: {
            value: function (value, ratio, id, index) { return (value+'%').replace('.',','); }
          }
        }
      });

      var config = {
              json: json,
              keys: {
                x: 'anio',
                value: ['ganancias', 'ventas'],
              },
              type: 'line',
              names: {
                ventas: 'Ventas',
                ganancias: 'Pago de ganancias',
              },
              colors: {
                ganancias: data.color,
                ventas: d3.rgb(data.color).darker()
              }
          };

      if(!CHQ.chart){
        CHQ.chart = c3.generate({
          bindto: '#line-chart',
          data: config,
          axis: {
              y:{
                min: 0,
                tick: {
                  //format: d3.format('$,'),
                  format: function (d) { return d3.format('$,')(d).replace(/,/g,'.'); }
                },
                padding: {bottom: 0}
              },
              x: {
                type: 'category',
                tick:{
                  outer:false
                }
              }
          }
        });
      } else {
        CHQ.chart.load(config);
      }
      //Render select
      CHQ.renderSelect();
    };

    CHQ.closeDetails = function(){
      $('body').removeClass('detailsOpened');
      CHQ.selectedId = false;
      CHQ.$colChart.removeClass('col-md-7').addClass('col-md-12');
      CHQ.$colOptions.removeClass('col-sm-12').addClass('col-sm-7');
      CHQ.render();
      CHQ.$details.hide();
      CHQ.$tips.show();
      d3.selectAll('circle').classed('selected',false);
    };

    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery, Mustache);
