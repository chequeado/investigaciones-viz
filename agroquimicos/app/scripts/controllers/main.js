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

        $scope.renderChart(false);
    });

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){$scope.renderChart(true)}, 500);
    });

    //Questions
    $scope.start = function(){
        $scope.myAnswers = {values:[]};
        $scope.myCoordinates = {x:0,y:0};
        $scope.updateMyCoordinates();
        $scope.currentId = 1;
        $scope.current = $scope.preguntas['pregunta_'+$scope.currentId];
        $scope.myGroup
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr('opacity',1)
            .attr('transform', 'translate(' + ($scope.x(0)-6) + ',' + ($scope.y(0)-6) + ')');

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

    $scope.updateMyCoordinates = function(resize){
        $scope.myCoordinates = $scope.getCoordinates($scope.myAnswers);
        if(resize){
            $scope.myGroup
                .style('opacity',1)
                .attr('transform', 'translate(' + ($scope.x($scope.myCoordinates.x)-6) + ',' + ($scope.y($scope.myCoordinates.y)-6) + ')');
        } else {
            $scope.myGroup
                .transition()
                .duration(1000)
                .ease("elastic")
                .style('opacity',1)
                .attr('transform', 'translate(' + ($scope.x($scope.myCoordinates.x)-6) + ',' + ($scope.y($scope.myCoordinates.y)-6) + ')');
        }
        
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
    $scope.myGroup;
    $scope.x;
    $scope.y;

    //Chart
    $scope.renderChart = function(resize){
        var data = $scope.entrevistas;

        if(data){

            var w = $('#chart-container').html("").width();

            var margin = {top: 25, right: 25, bottom: 25, left: 25}

            if($scope.isMobile()){
                margin = {top: 0, right: 0, bottom: 20, left: 20}
            }

            var width = w - margin.left - margin.right
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
            $scope.myGroup = main.append("svg:g").classed("myGroup",true).attr("opacity",0);

                    
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
                    {x:-10,y:10,color:'white'},
                    {x:0,y:0,color:'white'},
                    {x:0,y:10,color:'white'},
                    {x:-10,y:0,color:'white'}
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
            
            if(resize){        
                $scope.dots
                    .style("opacity",1)
                    .attr("x", function (d,i) { return $scope.x(d.x)-13; } )
                    .attr("y", function (d) { return $scope.y(d.y)-13; } );
            } else {
                $scope.dots.transition()
                    .delay(function(d,i){return i*200;})
                    .duration(1000)
                    .ease("elastic")
                    .style("opacity",1)
                    .attr("x", function (d,i) { return $scope.x(d.x)-13; } )
                    .attr("y", function (d) { return $scope.y(d.y)-13; } );
            }

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

            $scope.myGroup.append("svg:circle")
                .attr('class', 'scatter-dots my-dot')
                .attr("cx", 6)
                .attr("cy", 6 )
                .attr("r", 12);

            $scope.myGroup.append("svg:text")
                .attr('class', 'my-text')
                .text("VOS")
                .attr("x", 6)
                .attr("y", 9)
                .attr("text-anchor", "middle");

            if($scope.state!='start'){
                $scope.updateMyCoordinates(resize);
            }

            axisGroup
                .append("text")
                .attr("class","axis-label")
                .attr("x", -height/2)
                .attr("y", -5)
                .text("← El Estado debe intervenir nada o mucho →")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(270)");

            axisGroup
                .append("text")
                .attr("class","axis-label")
                .attr("x", height/2)
                .attr("y", height+14)
                .text("← Los agroquímicos afectan el medioambiente nada o mucho →")
                .attr("text-anchor", "middle");
        }

    }

    $scope.isMobile = function() {
        var isMobile = false; //initiate as false
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;        
            return isMobile;
    }

  });
