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

        CHQ.provinciasGroup = d3.nest()
            .key(function(d) { return d.provincia; })
            .map(CHQ.rawData);
        CHQ.provincias = d3.keys(CHQ.provinciasGroup);
        CHQ.$body.removeClass('loading');
        CHQ.render();
        setTimeout(CHQ.startEvents,2000);
    };


    CHQ.filters = {
      genero:'',
      car:''
    };

    CHQ.startEvents = function(){

      $(window).resize(function() {
          clearTimeout(CHQ.timeoutId);
          CHQ.timeoutId = setTimeout(CHQ.render, 500);
          
      });
      $('.btn-filter-genero').on('click',function(){
          $('.btn-filter-genero').removeClass('btn-selected');
          $(this).addClass('btn-selected');
          CHQ.filters.genero = ($(this).data('value')!='')?'.genero-'+$(this).data('value'):'';
          CHQ.udpdateFilters();
      });

      $('.btn-filter-car').on('click',function(){
          $('.btn-filter-car').removeClass('btn-selected');
          $(this).addClass('btn-selected');
          CHQ.filters.car = ($(this).data('value')!='')?'.car-'+$(this).data('value'):'';
          CHQ.udpdateFilters();
      });

    };

    CHQ.udpdateFilters = function(){
      CHQ.chart.circles
        .style('opacity',0.3);

      CHQ.chart.circlesGroup.selectAll('circle'+CHQ.filters.genero+CHQ.filters.car)
        .transition()
        .style('opacity',1);
    };

    CHQ.render = function(){

        var w = $('#chart-container').width();

        CHQ.smallDevice = (w < 990);

        var rowH = 75;
        var colW = w/3;

        var h = (CHQ.provincias.length+1)*rowH;

        var width = w,
            height = h,
            padding = 1, // separation between same-color circles
            clusterPadding = 5, // separation between different-color circles
            maxRadius = w/25,
            minRadius = w/100,
            max2Radius = w/75,
            min2Radius = w/150;

        if(!CHQ.chart) {
            CHQ.chart = {};
            CHQ.chart.svg = d3.select('#chart-container').append('svg').attr('id','main-chart-svg');
            CHQ.chart.provinciasGroup = CHQ.chart.svg.append('g').attr('id','provincias-chart-group');
            CHQ.chart.circlesGroup = CHQ.chart.svg.append('g').attr('id','circles-chart-group');
            
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
              .attr('y',rowH/2+5)
              .classed('text-provincia',true)
              .attr('text-anchor','end')
              .text(function(d){return d});

            group
              .append('rect')
              .datum(d)
              .classed('aliado-col',true)
              .attr('fill','#FFF');

            group
              .append('rect')
              .datum(d)
              .classed('opositor-col',true)
              .attr('fill','#FFF');

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
          .attr('transform',function(d,i){
            return 'translate(0,' + ((i)*rowH) + ')';
          });

        //nodes

        var nodes = prepareNodes();

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0)
            .charge(1)
            .on('tick', tick)
            .start();

        CHQ.chart.circles = CHQ.chart.circlesGroup.selectAll('circle.juez')
            .data(nodes);

        CHQ.chart.circles
            .enter()
            .append('circle')
            .attr('class',function(d){
              var clases = [];
              clases.push('genero-'+d.data.genero);
              if(d.data.familiares=='SI'){
                clases.push('car-familiares' );
              }
              if(d.data.cargos_publicos=='SI'){
                clases.push('car-cargos' );
              }
              return clases.join(' ');
            })
            .classed('juez',true)
            .on('click',function(d){

            })
            .on('mouseenter',function(d){
              console.log(d);
              var c = d3.select(this);
              CHQ.selector
                .attr('r',Math.round(c.attr('r')))
                .attr('cx',c.attr('cx'))
                .attr('cy',c.attr('cy'))
                .style('opacity',1)
                .transition()
                .delay(200)
                .style('opacity',0)
                .attr('r',Math.round(c.attr('r'))+30);

                var html = '<strong>'+d.data.nombre + '</strong> fue designado por ' + '<strong>'+d.data.gobernador+'</strong>';

              CHQ.tooltip
                .html(html)
                .style('opacity',1);

                c.attr('fill','red');
            })
            .on('mousemove', function(){
                CHQ.tooltip
                  .style('top',(d3.event.pageY-20)+'px')
                  .style('left',(d3.event.pageX+20)+'px');
            })
            .on('mouseout',function(d){
                CHQ.tooltip.style('opacity',0);
            });

        CHQ.chart.circles
            .attr('id',function(d){return 'e'+d.data.nombre})
            .attr('r', function(d) {
              return d.radius; 
            })
            .style('fill', function(d) { 
              return (d.data.relacion_gobernador=='opositor')?'orange':'steelblue';
            })
            .call(force.drag);

        CHQ.chart.circles.exit().remove();

        CHQ.selector.moveToFront();

        function tick(e) {
          CHQ.chart.circles
              .each(cluster(10 * e.alpha * e.alpha))
              .each(collide(.5))
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
          return function(d) {

            var cluster = CHQ.chart.clusters[d.cluster];
            var k = 1;

            if(cluster){
                // For cluster nodes, apply custom gravity.
                if (cluster === d) {
                  if(CHQ.chart.clusterPoints){
                    cluster = CHQ.chart.clusterPoints[d.cluster];
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

        function prepareNodes() {

          CHQ.chart.clusters = {};
          CHQ.chart.clusterPoints = {};

          d3.selectAll('g.provincia-group').each(function(d){
            var g = d3.select(this);
            var aliado = g.select('rect.aliado-col');
            var opositor = g.select('rect.opositor-col');

            CHQ.chart.clusterPoints[d+'-compatible'] = {
              x: d3.transform(g.attr('transform')).translate[0]+aliado.attr('width')/2+colW,
              y: d3.transform(g.attr('transform')).translate[1]+aliado.attr('height')/2,
              radius:7
            };

            CHQ.chart.clusterPoints[d+'-opositor'] = {
              x: d3.transform(g.attr('transform')).translate[0]+opositor.attr('width')/2+colW*2,
              y: d3.transform(g.attr('transform')).translate[1]+opositor.attr('height')/2,
              radius:7
            };
          });

          return CHQ.rawData
              .map(function(d) {
                var i = d.provincia+'-'+d.relacion_gobernador,
                  r = 10,
                  c = {cluster: i, radius:7, data:d};

                  if (!CHQ.chart.clusters[i] || (r > CHQ.chart.clusters[i].radius)){
                    CHQ.chart.clusters[i] = c;
                  }

                return c;
              });

        };

    };




    CHQ.inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };


})(window, document, jQuery, Tabletop);