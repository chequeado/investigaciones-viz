'use strict';

/**
 * @ngdoc function
 * @name agroquimicosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agroquimicosApp
 */
angular.module('agroquimicosApp')
  .controller('MainCtrl', function ($scope,TabletopService,$timeout,$rootScope) {
    
    $scope.state = 'loading';

    $scope.myAnswers = {values:[]};
    $scope.myCoordinates = {x:0,y:0};
    
    TabletopService.getData().then(function(data){

        $scope.entrevistas = data.entrevistas.elements;
        $scope.conclusiones = d3.nest()
            .key(function(d){return d.id})
            .rollup(function(leaves){return leaves[0];})
            .map(data.conclusiones.elements);

        $scope.myCoordinates.conclusion = $scope.conclusiones.NOSE;

        $scope.preguntas = {};
        
        $scope.current = false;

        $scope.preguntasKeys = [];
        
        angular.forEach(data.preguntas.elements,function(p){
            $scope.preguntas[p.id] = p;
            $scope.preguntasKeys.push(p.id);
        });


        $scope.opciones = data.opciones.elements;
        $scope.opcionesMap = {};
        angular.forEach($scope.opciones,function(p){
            $scope.opcionesMap[p.id] = p;
        });
    	$scope.getAllCoordinates();

        $scope.state = 'start';

        $scope.renderChart();
    });

    //Questions
    $scope.start = function(){
        $scope.myAnswers = {values:[]};
        $scope.myCoordinates = {x:0,y:0};
        $scope.updateMyCoordinates();
        $scope.currentId = 1;
        $scope.current = $scope.preguntas['pregunta_'+$scope.currentId];
        $scope.myCircle
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("r", 10)
            .attr("cx", function (d,i) { return $scope.x(0); } )
            .attr("cy", function (d) { return $scope.y(0); } );

        $scope.state = 'game';
    };

    $scope.select = function(o){
        $scope.current.answer = {
            id: o.id,
            text:'vos y x mas están '+o.opcion
        }
        $scope.myAnswers['pregunta_'+$scope.currentId] = $scope.current.answer.id;
        $scope.updateMyCoordinates();
        $scope.next();
    };

    $scope.next = function(){
        $scope.state = 'transition';
        $scope.current.answer = false;
        $scope.currentId++;
        if($scope.preguntas['pregunta_'+$scope.currentId]){
            $scope.current = $scope.preguntas['pregunta_'+$scope.currentId];
            $timeout(function(){
                $scope.state = 'game';
            },200);
        } else {
            $scope.state = 'end';
        }
    };

    //Coordinates
    $scope.getAllCoordinates = function(){
    	angular.forEach($scope.entrevistas,function(e){
    		var resp = $scope.getCoordinates(e);
    		e.x = resp.x;
            e.y = resp.y;
    		e.conclusion = resp.conclusion;
            e.cara_color = 'images/caritas/carita'+e.conclusion.id+'_'+e.genero+'_color.png';
            e.cara = 'images/caritas/carita'+e.conclusion.id+'_'+e.genero+'_negro.png';
    	});
    };

    $scope.updateMyCoordinates = function(){
        $scope.myCoordinates = $scope.getCoordinates($scope.myAnswers);
        $scope.myCircle
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("cx", function (d,i) { return $scope.x($scope.myCoordinates.x); } )
            .attr("cy", function (d) { return $scope.y($scope.myCoordinates.y); } );
    };

    $scope.getCoordinates = function(e){
        e.values = [];
    	var x = $scope.getAsnwerValue('pregunta_1',e) + $scope.getAsnwerValue('pregunta_3',e) + $scope.getAsnwerValue('pregunta_5',e);
    	var y = $scope.getAsnwerValue('pregunta_2',e) + $scope.getAsnwerValue('pregunta_4',e);
    	var conclusion;
        if(x>0 && y>0){
            conclusion = $scope.conclusiones.NO;
        } else if(x<0 && y<0){
            conclusion = $scope.conclusiones.SI;
        } else {
            conclusion = $scope.conclusiones.NOSE;
        }
        return {x:x,y:y,conclusion:conclusion};
    };

    $scope.getAsnwerValue = function(q,e){
        if(e[q]){
        	var a = e[q];
        	var value = 0;
        	if(a && a!=''){
    	    	var v = $scope.preguntas[q][e[q]];
    	    	value = (v && v!='')?v:0;    		
        	} else {
        		value = 0;
        	}
        	e.values.push(value);
        } else {
            value = 0;
        }
        return value;            
    };

    $scope.chart;
    $scope.myCircle;
    $scope.x;
    $scope.y;

    //Chart
    $scope.renderChart = function(){
        var data = $scope.entrevistas;

        var w = $('#chart-container').width();

        var margin = {top: 25, right: 25, bottom: 25, left: 25}
            , width = w - margin.left - margin.right
            , height = w - margin.top - margin.bottom;
    
        $scope.x = d3.scale.linear()
            .domain([-10,10])
            .range([ 0, width ]);
    
        $scope.y = d3.scale.linear()
            .domain([-10, 10])
            .range([ height, 0 ]);
 
        var chart = d3.select('#chart-container')
            .append('svg:svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart')
            .attr('id', 'chart');

        var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main');

        var layoutGroup = main.append("svg:g").classed("layoutGroup",true);
        var axisGroup = main.append("svg:g").classed("axisGroup",true);
        var dataGroup = main.append("svg:g").classed("dataGroup",true);

                
        // draw the x axis
        var xAxis = d3.svg.axis()
            .scale($scope.x)
            .orient('bottom')
            .ticks(20)
            .tickSize(2,2)
            .tickFormat("");

        axisGroup.append('g')
            .attr("transform", "translate(0," + $scope.y(0) + ")")
            .attr('class', 'main axis axis-x')
            .call(xAxis);

        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale($scope.y)
            .orient('left')
            .ticks(20)
            .tickSize(2,2)
            .tickFormat("");

        axisGroup.append('g')
            .attr("transform", "translate(" + $scope.x(0) + ",0)")
            .attr('class', 'main axis axis-y')
            .call(yAxis);

        d3.selectAll(".axis-y g.tick line")
            .attr("x2", 2)
            .attr("x1", -2);

        d3.selectAll(".axis-x g.tick line")
            .attr("y2", 2)
            .attr("y1", -2);
        
        var side = $scope.x(0);

        layoutGroup.selectAll('bg-rect')
            .data([
                {x:-10,y:10,color:'NOSE'},
                {x:0,y:0,color:'NOSE'},
                {x:0,y:10,color:'NO'},
                {x:-10,y:0,color:'SI'}
                ])
            .enter()
            .append("svg:rect")
            .attr('class', function(d){
                return 'bg-rect '+'fill-'+d.color;
            })
            .attr('width', side)
            .attr('height', side)
            .attr("x", function (d) { return $scope.x(d.x); } )
            .attr("y", function (d) { return $scope.y(d.y); } )

        $scope.dots = dataGroup.selectAll("scatter-image")
          .data(data);

        $scope.hoverCircle = dataGroup.append("svg:circle")
            .attr('class', 'hover-dot')
            .style("opacity",0)
            .attr("cx", function (d,i) { return $scope.x(0); } )
            .attr("cy", function (d) { return $scope.y(0); } )
            .attr("r", 15);

        $scope.dots
            .enter()
            .append("svg:image")
            .attr('class', 'scatter-image')
            .attr('width', 26)
            .attr('height', 26)
            .style("opacity",0)
            .attr("x", function (d,i) { return $scope.x(0)-13; } )
            .attr("y", function (d) { return $scope.y(0)-13; } )
            .attr("xlink:href",function(d){
                return d.cara
            });
        
        $scope.dots.transition()
            .delay(function(d,i){return i*200;})
            .duration(1000)
            .ease("elastic")
            .style("opacity",1)
            .attr("x", function (d,i) { return $scope.x(d.x)-13; } )
            .attr("y", function (d) { return $scope.y(d.y)-13; } );

        $scope.dots.on('click',function(d){
            $rootScope.openModal(d);
        })
        .on('mouseenter',function(){
            var x = parseInt(d3.select(this).attr('x'));
            var y = parseInt(d3.select(this).attr('y'));
            $scope.hoverCircle
                .transition()
                .style("opacity",1)
                .attr("cx", function (d) { return x+13; } )
                .attr("cy", function (d) { return y+13; } )
        })
        .on('mouseleave',function(){
            $scope.hoverCircle.style("opacity",0);
        });

        $scope.myCircle = dataGroup.append("svg:circle")
            .attr('class', 'scatter-dots my-dot')
            .attr("cx", function (d,i) { return $scope.x(0); } )
            .attr("cy", function (d) { return $scope.y(0); } )
            .attr("r", 0);

    }

  });
