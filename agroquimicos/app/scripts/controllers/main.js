'use strict';

/**
 * @ngdoc function
 * @name agroquimicosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agroquimicosApp
 */
angular.module('agroquimicosApp')
  .controller('MainCtrl', function ($scope,TabletopService,$timeout) {
    
    $scope.state = 'loading';

    $scope.myAnswers = {values:[]};
    $scope.myCoordinates = {x:0,y:0};
    $scope.myConclusion;
    
    TabletopService.getData().then(function(data){

        $scope.entrevistas = data.entrevistas.elements;
        $scope.conclusiones = d3.nest()
            .key(function(d){return d.id})
            .rollup(function(leaves){return leaves[0];})
            .map(data.conclusiones.elements);

        $scope.myConclusion = $scope.conclusiones.NOSE;

        $scope.preguntas = {};
        
        $scope.current = false;
        
        angular.forEach(data.preguntas.elements,function(p){
            $scope.preguntas[p.id] = p;
        });
        $scope.opciones = data.opciones.elements;
    	$scope.getAllCoordinates();

        $scope.state = 'start';

        $scope.renderChart();
    });

    var preguntas = d3.range(1,6);

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
            .attr("cy", function (d) { return $scope.y(0); } )
            .style("fill", "red");

        $scope.state = 'game';
    };

    $scope.select = function(o){
        console.log('respuesta:',o);
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

        if($scope.myCoordinates.x>0 && $scope.myCoordinates.y>0){
            $scope.myConclusion = $scope.conclusiones.NO;
        } else if($scope.myCoordinates.x<0 && $scope.myCoordinates.y<0){
            $scope.myConclusion = $scope.conclusiones.SI;
        } else {
            $scope.myConclusion = $scope.conclusiones.NOSE;
        }

        console.log($scope.conclusiones);
    };

    $scope.getCoordinates = function(e){
        e.values = [];
    	var x = $scope.getAsnwerValue('pregunta_1',e) + $scope.getAsnwerValue('pregunta_3',e) + $scope.getAsnwerValue('pregunta_5',e);
    	var y = $scope.getAsnwerValue('pregunta_2',e) + $scope.getAsnwerValue('pregunta_4',e);
    	return {x:x,y:y};
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
    $scope.dataGroup;

    //Chart
    $scope.renderChart = function(){
        var data = $scope.entrevistas;

        var w = $('#chart-container').width();

        var margin = {top: 50, right: 50, bottom: 50, left: 50}
            , width = w - margin.left - margin.right
            , height = w - margin.top - margin.bottom;
    
        $scope.x = d3.scale.linear()
            .domain([-9,9])
            .range([ 0, width ]);
    
        $scope.y = d3.scale.linear()
            .domain([-9, 9])
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
                
        // draw the x axis
        var xAxis = d3.svg.axis()
            .scale($scope.x)
            .orient('bottom');

        main.append('g')
            .attr("transform", "translate(0," + $scope.y(0) + ")")
            .attr('class', 'main axis axis-x')
            .call(xAxis);

        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale($scope.y)
            .orient('left');

        main.append('g')
            .attr("transform", "translate(" + $scope.x(0) + ",0)")
            .attr('class', 'main axis axis-y')
            .call(yAxis);

        $scope.dataGroup = main.append("svg:g"); 
        
        $scope.dataGroup.selectAll("scatter-dots")
          .data(data)
          .enter()
            .append("svg:circle")
            .attr('class', 'scatter-dots')
            .attr("cx", function (d,i) { return $scope.x(0); } )
            .attr("cy", function (d) { return $scope.y(0); } )
            .transition()
            .delay(function(d,i){return i*200;})
            .duration(1000)
            .ease("elastic")
            .attr("cx", function (d,i) { return $scope.x(d.x); } )
            .attr("cy", function (d) { return $scope.y(d.y); } )
            .attr("r", 8);

        $scope.myCircle = $scope.dataGroup.append("svg:circle")
                    .attr('class', 'scatter-dots my-dot')
                    .attr("cx", function (d,i) { return $scope.x(0); } )
                    .attr("cy", function (d) { return $scope.y(0); } )
                    .attr("r", 0);

    }

  });
