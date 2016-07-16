var CHQ;

;(function(global, document, $, Tabletop, Mustache){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.$details = $('#details');

    CHQ.$body =  $('body'); 

    CHQ.$colChart = $('#col-chart-container');

    CHQ.circles;

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
            .key(function(d) { return d.sector; })
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
        CHQ.filterData('2015');
        CHQ.render();
        setTimeout(CHQ.startEvents,1000);
    };

    CHQ.filterData = function(y){
        var filtered = CHQ.rawData.filter(function(d){
            return !isNaN(d['porcentaje_'+y]);
        });
        CHQ.data = filtered.map(function(d){return {id:d.id,empresa:d.empresa,sector:d.sector,anio:y,porcentaje:d['porcentaje_'+y]}});
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
              CHQ.tooltip
                .html(
                  '<strong>'+d.data.empresa+'</strong> pagó el <strong>'+d.data.porcentaje+'%</strong> en el año <strong>'+d.data.anio+'</strong>'
                )
                .style('opacity',1);

                d3.select(this).attr('stroke',d3.rgb(CHQ.color(d.data.sector)).darker().toString());
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
        $('#year').change(function(){
            CHQ.filterData($(this).val());
            CHQ.render();
        });
        $('#close-details').on('click',CHQ.closeDetails);
    };

    CHQ.render = function(){
//        console.log(CHQ.data);
//        console.log(CHQ.groups);
//        console.log(CHQ.categories);
//        console.log(CHQ.maxValue);

        var w = $('#chart-container').width();

        var h = (CHQ.$colChart.hasClass('col-md-12'))?(w*9)/16:w;

        var width = w,
            height = h,
            padding = 1.5, // separation between same-color circles
            clusterPadding = 10, // separation between different-color circles
            maxRadius = w/25,
            minRadius = w/100;

        CHQ.color = d3.scale.category20()
            .domain(CHQ.categories);

        var rScale = d3.scale.linear()
            .domain([0,CHQ.maxValue])
            .range([minRadius,maxRadius]);


        // The largest node for each cluster.
        var clusters = new Array(CHQ.categories.length);

        var nodes = CHQ.data.map(function(d) {
          var i = d.sector,
              r = rScale(d.porcentaje),
              d = {cluster: i, radius: r,data:d};
              
              if (!clusters[i] || (r > clusters[i].radius)){
                clusters[i] = d;
              }

          return d;
        });
        
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
        }

        CHQ.svg
            .attr('width', width)
            .attr('height', height);

        CHQ.circles = CHQ.svg.selectAll('circle')
            .data(nodes);

        CHQ.circles
            .enter()
            .append('circle');

        CHQ.circles
            .attr('r', function(d) { return d.radius; })
            .style('fill', function(d) { return CHQ.color(d.cluster); })
            .call(force.drag);

        CHQ.circles.exit().remove();

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
                  cluster = {x: width / 2, y: height / 2, radius: -d.radius};
                  k = .1 * Math.sqrt(d.radius);
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

      if(CHQ.$colChart.hasClass('col-md-12')){
        CHQ.$colChart.removeClass('col-md-12').addClass('col-md-6');
        CHQ.render();
        CHQ.$details.fadeIn();
      }

      var template = $('#template').html();
      Mustache.parse(template);   // optional, speeds up future uses
      data.color = CHQ.color(data.sector);
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

      var config = {
              json: json,
              keys: {
                x: 'anio',
                value: ['ganancias', 'ventas','porcentaje'],
              },
              axes: {
                'porcentaje': 'y2'
              },
              type: 'line',
              types:{
                'porcentaje':'bar'
              }
          };

      if(!CHQ.chart){
        CHQ.chart = c3.generate({
          bindto: '#line-chart',
          data: config,
          bar: {
            width: {
              ratio: 0.2
            }
          },
          axis: {
              y2: {
                  show: true,
                  min: 0,
                  label: 'Porcentaje'
              },
              y:{
                min: 0,
                label: 'Ganancias / Ventas'
              },
              x: {
                min: 0,
                type: 'category'
              }
          }
        });
      } else {
        CHQ.chart.load(config);
      }
    };

    CHQ.closeDetails = function(){
      CHQ.$colChart.removeClass('col-md-6').addClass('col-md-12');
      CHQ.render();
      CHQ.$details.hide();
    };


})(window, document, jQuery, Tabletop, Mustache);