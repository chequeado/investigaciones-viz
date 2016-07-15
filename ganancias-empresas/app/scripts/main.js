var CHQ;

;(function(global, document, $, Tabletop){

    'use strict';
    CHQ = {};

    CHQ.pymChild = pym.Child({ polling: 500 });

    CHQ.init = function(){
        console.log('init');
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
        CHQ.filterData('2015');
        CHQ.render();
        CHQ.startEvents();
    };

    CHQ.filterData = function(y){
        var filtered = CHQ.rawData.filter(function(d){
            return !isNaN(d['porcentaje_'+y]);
        });
        CHQ.data = filtered.map(function(d){return {id:d.id,empresa:d.empresa,sector:d.sector,anio:y,porcentaje:d['porcentaje_'+y]}});
    };

    CHQ.startEvents = function(){
        /*$(window).resize(function() {
            clearTimeout(CHQ.timeoutId);
            CHQ.timeoutId = setTimeout(CHQ.render, 500);
            
        });*/
        $('#year').change(function(){
            $('#detalle').html('');
            CHQ.filterData($(this).val());
            CHQ.render();
        });
    };

    CHQ.render = function(){
//        console.log(CHQ.data);
        console.log(CHQ.groups);
        console.log(CHQ.categories);
//        console.log(CHQ.maxValue);

        var w = $('#chart-container').width();

        var width = w,
            height = (w*9)/16,
            padding = 1.5, // separation between same-color circles
            clusterPadding = 10, // separation between different-color circles
            maxRadius = w/20;

        var color = d3.scale.category20()
            .domain(CHQ.categories);

            console.log('color',color.domain());

        var rScale = d3.scale.linear()
            .domain([0,CHQ.maxValue])
            .range([0,maxRadius]);


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

        var circle = CHQ.svg.selectAll('circle')
            .data(nodes);

        circle
            .enter()
            .append('circle')
            .on('click',function(d){
                $('#detalle').html('BASE: ' + JSON.stringify(d.data)+ ' HISTORICO: '+JSON.stringify(CHQ.dataById[d.data.id]));
            })
            .on('mouseenter',function(d){
              CHQ.tooltip
                .html(
                  '<strong>'+d.data.empresa+'</strong> pagó el <strong>'+d.data.porcentaje+'%</strong> en el año <strong>'+d.data.anio+'</strong>'
                )
                .style('opacity',1);

                d3.select(this).attr('stroke',d3.rgb(color(d.data.sector)).darker().toString());
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

        circle
            .attr('r', function(d) { return d.radius; })
            .style('fill', function(d) { return color(d.cluster); })
            .call(force.drag);

        circle.exit().remove();

        function tick(e) {
          circle
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


})(window, document, jQuery, Tabletop);