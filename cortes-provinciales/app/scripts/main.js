var CHQ;

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

;(function(global, document, $, Tabletop){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$body =  $('body'); 

    CHQ.circles;

    CHQ.init = function(){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        Tabletop.init( { key: '1EqitwKNC18omv0NsAaFEmdU_hyYY_2LOLBkhWJ9NeSM',
                   callback: CHQ.dataLoaded,
                   simpleSheet: false,
                   parseNumbers: true
               } );

        if(CHQ.inIframe()){
          $('.iframe-show').show();
        } else {
          $('.no-iframe-show').show();
        }


    };

    CHQ.postProcess = function(e,i){
        e['id'] = i;
        return e;
    };

    CHQ.dataLoaded = function(data,tabletop){
        CHQ.rawData = data['DATASET-VIZ'].elements.map(CHQ.postProcess);
        console.log(CHQ.rawData);
        CHQ.provinciasGroup = d3.nest()
            .key(function(d) { return d.provincia; })
            .map(CHQ.rawData);
        CHQ.provincias = d3.keys(CHQ.provinciasGroup);

        console.log(CHQ.provincias);
        /*CHQ.dataById = d3.nest()
            .key(function(d) { return d.id; })
            .rollup(function(leaves) {
                return leaves[0];
            })
            .map(CHQ.rawData);
        CHQ.maxValue = d3.max(CHQ.rawData,function(d){
            return d.max;
        });*/
        CHQ.$body.removeClass('loading');
        CHQ.render();
        //CHQ.renderSelect();
        setTimeout(CHQ.startEvents,2000);
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

        //CHQ.filterData();

        //console.log(CHQ.data);

        var w = $('#chart-container').width();

        CHQ.smallDevice = (w < 990);

        var rowH = 100;
        var colW = w/3;

        var h = (CHQ.provincias.length+1)*rowH;

        var width = w,
            height = h,
            padding = 2, // separation between same-color circles
            clusterPadding = 2, // separation between different-color circles
            maxRadius = w/25,
            minRadius = w/100,
            max2Radius = w/75,
            min2Radius = w/150;

        /*CHQ.color = d3.scale.category20()
            .domain(CHQ.categories);

        var clusters,nodes,rScale;

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
                  return d.y; })
                .fontSize(12)
                ();

              CHQ.textGroup.selectAll('text').style('opacity',1);
            } else {
              CHQ.textGroup.selectAll('text').style('opacity',0);
            }

            //Render select
            //CHQ.renderSelect();

          break;
        }*/

        //RenderLegend
       /* var template = $('#tpl-legend').html();
        Mustache.parse(template);
        
        dataLegend.midSize = (dataLegend.minSize + dataLegend.maxSize)/2;
        dataLegend.midPadding = (dataLegend.maxSize - dataLegend.midSize)/2;
        dataLegend.minPadding = (dataLegend.maxSize - dataLegend.minSize)/2;
        dataLegend.txtPadding = (dataLegend.maxSize - 20)/2;

        var rendered = Mustache.render(template, dataLegend);
        $('#legend-container').html(rendered);*/

        //console.log(nodes);
        //console.log(clusters);

        /*var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(1)
            .on('tick', tick)
            .start();*/

        if(!CHQ.chart) {
            CHQ.chart = {};
            CHQ.chart.svg = d3.select('#chart-container').append('svg').attr('id','main-chart-svg');
            CHQ.chart.circlesGroup = CHQ.chart.svg.append('g').attr('id','circles-chart-group');
            CHQ.chart.provinciasGroup = CHQ.chart.svg.append('g').attr('id','provincias-chart-group');
            
            CHQ.tooltip = d3.select('body')
                .append('div')
                .attr('id','circle-tooltip');
            CHQ.selector = CHQ.chart.svg.append('circle')
                .attr('id','selector')
                .style('stroke-width',3)
                .style('opacity',0)
                .attr('fill','none');
        }

        CHQ.chart.svg
          .attr('width', width)
          .attr('height', height);

        CHQ.chart.provincias = CHQ.chart.provinciasGroup.selectAll('g.provincia-group')
          .data(CHQ.provincias);

        CHQ.chart.provincias
          .enter()
          .append('g')
          .classed('provincia-group',true)
          .each(function(d){
            
            var group = d3.select(this)
            
            group
              .append('text')
              .datum(d)
              .attr('y',rowH/2-5)
              .classed('text-provincia',true)
              .attr('text-anchor','end')
              .text(function(d){return d});

            group
              .append('rect')
              .datum(d)
              .classed('aliado-col',true)
              .attr('fill','orange');

            group
              .append('rect')
              .datum(d)
              .classed('opositor-col',true)
              .attr('fill','steelblue');

          });

        CHQ.chart.provincias
          .selectAll('rect.aliado-col')
          .attr('x',colW)
          .attr('width',colW)
          .attr('height',rowH);

        CHQ.chart.provincias
          .selectAll('rect.opositor-col')
          .attr('x',colW*2)
          .attr('width',colW)
          .attr('height',rowH);

        CHQ.chart.provincias
          .selectAll('text.text-provincia')
          .attr('x',colW);

        CHQ.chart.provincias
          .transition()
          .attr('transform',function(d,i){
            return 'translate(0,' + ((i+1)*rowH) + ')';
          });

        /*CHQ.chart.circles = CHQ.circlesGroup.selectAll('circle.juez')
            .data(nodes);

        CHQ.chart.circles
            .enter()
            .append('circle')
            .classed('juez',true)
            .on('click',function(d){
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

                var html = 'tooltip';

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
        */

        //CHQ.startEvents();

        //CHQ.selector.moveToFront();

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
      console.log(data);
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


})(window, document, jQuery, Tabletop);