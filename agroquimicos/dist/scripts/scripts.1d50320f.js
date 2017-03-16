"use strict";angular.module("agroquimicosApp",["ngRoute","ngAnimate"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"}),b.hashPrefix("")}]).service("TabletopService",["$q",function(a){this.data=!1,this.getData=function(){var b=this;return a(function(a,c){b.data?a(angular.copy(b.data)):Tabletop.init({key:"1JEqsDFXcDOk5SEjUj8PEex_lmIHvQWVixhNo2p-r85w",callback:function(c,d){b.data=c,a(angular.copy(b.data))},parseNumbers:!0})})}}]).run(["$rootScope",function(a){pym.Child({polling:500});a.selected=!1,$("#modal").modal({show:!1}).on("hide.bs.modal",function(b){a.selected=!1}),a.openModal=function(b){a.selected=b,a.$apply(),$("#modal").modal("show")}}]),angular.module("agroquimicosApp").controller("MainCtrl",["$scope","TabletopService","$timeout","$rootScope",function(a,b,c,d){a.state="loading",a.myAnswers={values:[]},a.myCoordinates={x:0,y:0},b.getData().then(function(b){a.entrevistas=b.entrevistas.elements,a.conclusiones=d3.nest().key(function(a){return a.id}).rollup(function(a){return a[0]}).map(b.conclusiones.elements),a.myCoordinates.conclusion=a.conclusiones.NOSE,a.preguntas={},a.current=!1,a.preguntasKeys=[],angular.forEach(b.preguntas.elements,function(b){a.preguntas[b.id]=b,a.preguntasKeys.push(b.id)}),a.opciones=b.opciones.elements,a.opcionesMap={},angular.forEach(a.opciones,function(b){a.opcionesMap[b.id]=b}),a.getAllCoordinates(),a.state="start",a.renderChart()});var e;$(window).resize(function(){clearTimeout(e),e=setTimeout(a.renderChart,500)}),a.start=function(){a.myAnswers={values:[]},a.myCoordinates={x:0,y:0},a.updateMyCoordinates(),a.currentId=1,a.current=a.preguntas["pregunta_"+a.currentId],a.myGroup.transition().duration(1e3).ease("elastic").attr("opacity",1).attr("transform","translate("+(a.x(0)-6)+","+(a.y(0)-6)+")"),a.state="game"},a.select=function(b){a.current.answer={id:b.id,text:"vos y x mas están "+b.opcion},a.myAnswers["pregunta_"+a.currentId]=a.current.answer.id,a.updateMyCoordinates(),a.next()},a.next=function(){a.state="transition",a.current.answer=!1,a.currentId++,a.preguntas["pregunta_"+a.currentId]?(a.current=a.preguntas["pregunta_"+a.currentId],c(function(){a.state="game"},200)):a.state="end"},a.getAllCoordinates=function(){angular.forEach(a.entrevistas,function(b){var c=a.getCoordinates(b);b.x=c.x,b.y=c.y,b.conclusion=c.conclusion,b.cara_color="images/caritas/carita"+b.conclusion.id+"_"+b.genero+"_color.png",b.cara="images/caritas/carita"+b.conclusion.id+"_"+b.genero+"_negro.png"})},a.updateMyCoordinates=function(){a.myCoordinates=a.getCoordinates(a.myAnswers),a.myGroup.transition().duration(1e3).ease("elastic").attr("transform","translate("+(a.x(a.myCoordinates.x)-6)+","+(a.y(a.myCoordinates.y)-6)+")")},a.getCoordinates=function(b){b.values=[];var c,d=a.getAsnwerValue("pregunta_1",b)+a.getAsnwerValue("pregunta_3",b)+a.getAsnwerValue("pregunta_5",b),e=a.getAsnwerValue("pregunta_2",b)+a.getAsnwerValue("pregunta_4",b);return c=d>0&&e>0?a.conclusiones.NO:0>d&&0>e?a.conclusiones.SI:a.conclusiones.NOSE,{x:d,y:e,conclusion:c}},a.getAsnwerValue=function(b,c){if(c[b]){var d=c[b],e=0;if(d&&""!=d){var f=a.preguntas[b][c[b]];e=f&&""!=f?f:0}else e=0;c.values.push(e)}else e=0;return e},a.chart,a.myGroup,a.x,a.y,a.renderChart=function(){var b=a.entrevistas,c=$("#chart-container").html("").width(),e={top:25,right:25,bottom:25,left:25};console.log(a.isMobile()),a.isMobile()&&(e={top:0,right:0,bottom:20,left:20});var f=c-e.left-e.right,g=c-e.top-e.bottom;a.x=d3.scale.linear().domain([-10,10]).range([0,f]),a.y=d3.scale.linear().domain([-10,10]).range([g,0]);var h=d3.select("#chart-container").append("svg:svg").attr("width",f+e.right+e.left).attr("height",g+e.top+e.bottom).attr("class","chart").attr("id","chart"),i=h.append("g").attr("transform","translate("+e.left+","+e.top+")").attr("width",f).attr("height",g).attr("class","main"),j=i.append("svg:g").classed("layoutGroup",!0),k=i.append("svg:g").classed("axisGroup",!0),l=i.append("svg:g").classed("dataGroup",!0);a.myGroup=i.append("svg:g").classed("myGroup",!0).attr("opacity",0);var m=d3.svg.axis().scale(a.x).orient("bottom").ticks(20).tickSize(2,2).tickFormat("");k.append("g").attr("transform","translate(0,"+a.y(0)+")").attr("class","main axis axis-x").call(m);var n=d3.svg.axis().scale(a.y).orient("left").ticks(20).tickSize(2,2).tickFormat("");k.append("g").attr("transform","translate("+a.x(0)+",0)").attr("class","main axis axis-y").call(n),d3.selectAll(".axis-y g.tick line").attr("x2",2).attr("x1",-2),d3.selectAll(".axis-x g.tick line").attr("y2",2).attr("y1",-2);var o=a.x(0);j.selectAll("bg-rect").data([{x:-10,y:10,color:"NOSE"},{x:0,y:0,color:"NOSE"},{x:0,y:10,color:"NO"},{x:-10,y:0,color:"SI"}]).enter().append("svg:rect").attr("class",function(a){return"bg-rect fill-"+a.color}).attr("width",o).attr("height",o).attr("x",function(b){return a.x(b.x)}).attr("y",function(b){return a.y(b.y)}),a.dots=l.selectAll("scatter-image").data(b),a.hoverCircle=l.append("svg:circle").attr("class","hover-dot").style("opacity",0).attr("cx",function(b,c){return a.x(0)}).attr("cy",function(b){return a.y(0)}).attr("r",15),a.dots.enter().append("svg:image").attr("class","scatter-image").attr("width",26).attr("height",26).style("opacity",0).attr("x",function(b,c){return a.x(0)-13}).attr("y",function(b){return a.y(0)-13}).attr("xlink:href",function(a){return a.cara}),a.dots.transition().delay(function(a,b){return 200*b}).duration(1e3).ease("elastic").style("opacity",1).attr("x",function(b,c){return a.x(b.x)-13}).attr("y",function(b){return a.y(b.y)-13}),a.dots.on("click",function(a){d.openModal(a)}).on("mouseenter",function(){var b=parseInt(d3.select(this).attr("x")),c=parseInt(d3.select(this).attr("y"));a.hoverCircle.transition().style("opacity",1).attr("cx",function(a){return b+13}).attr("cy",function(a){return c+13})}).on("mouseleave",function(){a.hoverCircle.style("opacity",0)}),a.myGroup.append("svg:circle").attr("class","scatter-dots my-dot").attr("cx",6).attr("cy",6).attr("r",12),a.myGroup.append("svg:text").attr("class","my-text").text("VOS").attr("x",6).attr("y",9).attr("text-anchor","middle"),k.append("text").attr("class","axis-label").attr("x",-g/2).attr("y",-5).text("El Estado debe intervenir nada o mucho").attr("text-anchor","middle").attr("transform","rotate(270)"),k.append("text").attr("class","axis-label").attr("x",g/2).attr("y",g+14).text("Los agroquímicos afectan el medioambiente nada o mucho").attr("text-anchor","middle")},a.isMobile=function(){var a=!1;return(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(a=!0),a}}]),angular.module("agroquimicosApp").run(["$templateCache",function(a){a.put("views/main.html",'<div class="row"> <div id="game-col" class="col-md-5"> <h1 class="text-center">AGROQUÍMICOS</h1> <h2 class="text-center">¿de qué lado estás?</h2> <p class="text-center">¿Es posible un campo sin agroquímicos? ¿Existen riesgos para nuestra salud? La discusión tiene cada vez más detractores y defensores, cada uno con sus argumentos. Conocelos todos acá y respondé nuestro quiz para saber de quiénes estás más cerca.</p> <div id="game-container" class="row"> <div ng-show="state==\'loading\'" class="col-md-12 text-center animate padding-top"> Cargando información... </div> <div ng-show="state==\'start\'" class="col-md-12 text-center animate padding-top"> <a class="btn btn-default" ng-click="start()">¡Empecemos!</a> </div> <div ng-show="state==\'game\'" class="animate"> <div class="col-md-10 col-md-offset-1 text-center"> <p><img ng-src="images/gifs/{{current.icono}}.gif" p> </p><p class="pregunta-text">{{current.pregunta}}</p> </div> <div class="col-md-8 col-md-offset-2 text-center"> <a ng-repeat="o in opciones" class="btn btn-default btn-block" ng-class="{active:(current.answer.id==o.id)}" ng-click="select(o)">{{o.opcion}}</a> </div> </div> <div ng-show="state==\'end\'" class="col-md-12 text-center animate padding-top"> <a class="btn btn-default" ng-click="start()">¡Jugar otra vez!</a> </div> </div> </div> <div id="chart-col" class="col-md-7"> <div id="row-title" class="row"> <div class="col-sm-2 col-xs-6 text-center"> <img class="img-responsive" ng-src="images/caritas/carita{{myCoordinates.conclusion.id}}_fem_negro.png"> </div> <div class="col-sm-2 col-xs-6 col-sm-push-8 text-center"> <img class="img-responsive" ng-src="images/caritas/carita{{myCoordinates.conclusion.id}}_mas_negro.png"> </div> <div class="col-sm-8 col-xs-12 col-sm-pull-2"> <h3 class="text-center">{{myCoordinates.conclusion.texto}}</h3> <h4 class="text-center">{{myCoordinates.conclusion.detalle}}</h4> </div> </div> <div class="row"> <div class="col-md-8 col-md-offset-2"> <div id="chart-container"></div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="well"><p>Hacé click en los puntos para conocer quiénes de los entrevistados piensan como vos. Deslizate hacia la derecha o la izquierda para ver más.</p></div> </div> </div> </div> </div> <div id="modal" class="modal fade" tabindex="-1" role="dialog"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <div class="media"> <div class="media-left"> <img class="media-object" width="75" ng-src="{{selected.cara_color}}"> </div> <div class="media-body"> <h4 class="media-heading">{{selected.entrevistado}}</h4> <p>{{selected.organizacion}}</p> </div> </div> <h4 class="modal-title"></h4> </div> <div class="modal-body"> <blockquote> <p>"{{selected.cita}}"</p> <footer>Textual de entrevista</footer> </blockquote> <p>Las respuestas de {{selected.entrevistado}}:</p> <ul class="list-group"> <li class="list-group-item" ng-repeat="p in preguntasKeys">{{$index+1}}. {{preguntas[p].pregunta}} <strong ng-show="selected[p]!=\'\'">{{opcionesMap[selected[p]].opcion}}</strong> <strong ng-show="selected[p]==\'\'">No contesta</strong></li> </ul> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div> </div><!-- /.modal-content --> </div><!-- /.modal-dialog --> </div><!-- /.modal -->')}]);