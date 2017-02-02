'use strict';

/**
 * @ngdoc function
 * @name agroquimicosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agroquimicosApp
 */
angular.module('agroquimicosApp')
  .controller('MainCtrl', function ($scope,TabletopService) {
    
    TabletopService.getData().then(function(data){
    	$scope.entrevistas = data.entrevistas.elements;
    	$scope.preguntas = {};
    	angular.forEach(data.preguntas.elements,function(p){
    		$scope.preguntas[p.id] = p;
    	});
    	$scope.opciones = data.opciones.elements;
    	console.log($scope.preguntas);

    	$scope.getAllCoordinates();
    });

    var preguntas = d3.range(1,6);

    $scope.getAllCoordinates = function(){
    	angular.forEach($scope.entrevistas,function(e){
    		e.values = [];
    		var resp = $scope.getCoordinates(e);
    		e.x = resp.x;
    		e.y = resp.y;
    	});
    	console.log($scope.entrevistas);
    };

    $scope.getCoordinates = function(e){
    	var x = $scope.getAsnwerValue('pregunta_1',e) + $scope.getAsnwerValue('pregunta_2',e) + $scope.getAsnwerValue('pregunta_3',e);
    	var y = $scope.getAsnwerValue('pregunta_4',e) + $scope.getAsnwerValue('pregunta_5',e);
    	return {x:x,y:y};
    };

    $scope.getAsnwerValue = function(q,e){
    	var a = e[q];
    	var value = 0;
    	if(a && a!=''){
	    	var v = $scope.preguntas[q][e[q]];
	    	value = (v && v!='')?v:0;    		
    	} else {
    		value = 0;
    	}
    	e.values.push(value);
    	return value;
    };

  });
