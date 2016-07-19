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

    CHQ.$details = $('#details');

    CHQ.$body =  $('body'); 

    CHQ.$colChart = $('#col-chart-container');

    CHQ.circles;

    CHQ.year = '2015';
    CHQ.group = 'center';

    CHQ.init = function(){
        var w = CHQ.$body.width();
        CHQ.$body.css('min-height',(w*9)/16);

        Tabletop.init( { key: '1lZH4R70Ln3vqZFnDvySuA681kKJJWc49GEoFJwpKLDc',
                   callback: CHQ.dataLoaded,
                   simpleSheet: false,
                   parseNumbers: true
               } );
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

    CHQ.dataLoaded = function(data,tabletop){
        CHQ.rawData = data.detalle.elements.map(CHQ.postProcess);
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
        setTimeout(CHQ.startEvents,2000);
    };

    CHQ.filterData = function(){
        var filtered = CHQ.rawData.filter(function(d){
            return !isNaN(d['porcentaje_'+CHQ.year]);
        });
        CHQ.data = filtered.map(function(d){return {id:d.id,empresa:d.empresa,sector:d.sector,anio:CHQ.year,porcentaje:d['porcentaje_'+CHQ.year]}});
    };

    CHQ.startEvents = function(){

        CHQ.circles
            .on('click',function(d){
                CHQ.openDetails(CHQ.dataById[d.data.id]);
                d3.selectAll('circle').classed('selected',false);
                d3.select(this).classed('selected',true);
                //$('#details').html('BASE: ' + JSON.stringify(d.data)+ ' HISTORICO: '+JSON.stringify(CHQ.dataById[d.data.id]));
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
              CHQ.tooltip
                .html(
                  '<strong>'+d.data.empresa+'</strong> pagó el <strong>'+(d.data.porcentaje+'').replace('.',',')+'%</strong> en el año <strong>'+d.data.anio+'</strong>'
                )
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
                d3.select(this).attr('fill',function(){

                });
            });

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

        var w = $('#chart-container').width();

        var h = (CHQ.$colChart.hasClass('col-md-12'))?(w*9)/16:w;

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

        switch(CHQ.group){
          case 'center':
            rScale = d3.scale.linear()
              .domain([0,CHQ.maxValue])
              .range([minRadius,maxRadius]);
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
          break;
          case 'sector':
            rScale = d3.scale.linear()
              .domain([0,CHQ.maxValue])
              .range([min2Radius,max2Radius]);

            clusters = new Array(CHQ.categories.length);
            var clusterPoints = new Array(CHQ.categories.length);
            var examples = [];

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
                    clusterPoints[i] = {x:cols[ixCols],y:rows[ixRows],radius:3};
                    examples.push(clusterPoints[i]);
                  }

                  if (!clusters[i] || (r > clusters[i].radius)){
                    clusters[i] = d;
                  }

              return d;
            });

           /* console.log(clusterPoints);

            CHQ.points = CHQ.svg.selectAll('circle.cluster')
              .data(examples);
        
            CHQ.points.enter()
                .append('circle')
                .classed('cluster',true)
                
            CHQ.points.attr('r', function(d) { return 3; })
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .style('fill', 'red');

            CHQ.points.exit().remove();*/

          break;
        }

        //console.log(nodes);
        //console.log(clusters);

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on('tick', tick)
            .start();

        if(!CHQ.svg) {
            CHQ.svg = d3.select('#chart-container').append('svg');
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

        CHQ.circles = CHQ.svg.selectAll('circle.company')
            .data(nodes);

        CHQ.circles
            .enter()
            .append('circle')
            .classed('company',true);

        CHQ.circles
            .attr('id',function(d){return 'e'+d.data.id})
            .attr('r', function(d) { return d.radius; })
            .style('fill', function(d) { return CHQ.color(d.cluster); })
            .call(force.drag);

        CHQ.circles.exit().remove();

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
                    cluster = {x: width / 2, y: height / 2, radius: -d.radius};
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

    CHQ.openDetails = function(data){

      CHQ.selectedId = data.id;

      if(CHQ.$colChart.hasClass('col-md-12')){
        CHQ.$colChart.removeClass('col-md-12').addClass('col-md-6');
        CHQ.render();
        CHQ.$details.fadeIn();
      }

      var template = $('#tpl-details').html();
      Mustache.parse(template);   // optional, speeds up future uses
      data.color = CHQ.color(data.sector);
      data.selectedYear = CHQ.year;
      data.selectedValue = (data['porcentaje_'+CHQ.year]+'').replace('.',',');
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
              show:false
            },
            x: {
              type: 'category'
            }
        },
        grid: {
              y: {
                lines: [
                  {value: 0, text: ' '}
                ]
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
                }
              },
              x: {
                type: 'category',
                tick:{
                  outer:false
                }
              }
          },
          grid: {
                y: {
                  lines: [
                    {value: 0, text: ' '}
                  ]
                }
              }
        });
      } else {
        CHQ.chart.load(config);
      }
    };

    CHQ.closeDetails = function(){
      CHQ.selectedId = false;
      CHQ.$colChart.removeClass('col-md-6').addClass('col-md-12');
      CHQ.render();
      CHQ.$details.hide();
      d3.selectAll('circle').classed('selected',false);
    };


})(window, document, jQuery, Tabletop, Mustache);