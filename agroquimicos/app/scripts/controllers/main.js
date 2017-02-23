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
    
    TabletopService.getData().then(function(data){

        $scope.entrevistas = data.entrevistas.elements;
        $scope.preguntas = {};
        
        $scope.current = false;
        
        angular.forEach(data.preguntas.elements,function(p){
            $scope.preguntas[p.id] = p;
        });
        $scope.opciones = data.opciones.elements;
    	$scope.getAllCoordinates();

        $scope.state = 'start';
    });

    var preguntas = d3.range(1,6);

    //Questions
    $scope.start = function(){
        $scope.myAnswers = {values:[]};
        $scope.myCoordinates = {x:0,y:0};
        $scope.currentId = 1;
        $scope.current = $scope.preguntas['pregunta_'+$scope.currentId];
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
    };

    $scope.getCoordinates = function(e){
        e.values = [];
    	var x = $scope.getAsnwerValue('pregunta_1',e) + $scope.getAsnwerValue('pregunta_2',e) + $scope.getAsnwerValue('pregunta_3',e);
    	var y = $scope.getAsnwerValue('pregunta_4',e) + $scope.getAsnwerValue('pregunta_5',e);
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

  });
