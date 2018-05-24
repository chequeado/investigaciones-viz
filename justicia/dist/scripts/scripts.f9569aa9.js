var SocialShare=SocialShare||{};$(document).ready(function(){"use strict";!function(a){function b(a,b){if(!h[a])throw new Error("Share service not defined");var d=c(a,b);return f(d),this}function c(a,b){var c=h[a].shareurl,f=h[a].paramproto;b=b||{},"facebook"===a?b.u?b.u=g+b.u:b.u=g:"twitter"===a||(b.url?b.url=g+b.url:b.url=g),"linkedin"===a&&(b.mini&&"true"===b.mini||(b.mini="true"));var i=d(b,f),j=e(c,i);return j}function d(a,b){var c=[];a=a||{};for(var d in a)if(b.hasOwnProperty(d)){var e=b[d]+encodeURIComponent(a[d]);c.push(e)}return c}function e(a,b){b=b||[];var c=b.length?a+b.join("&"):a;return c}function f(a){var b=600,c=600,d=($(window).height()-c)/2,e=($(window).width()-b)/2,f="status=1,width="+b+",height="+c+",top="+d+",left="+e,g=a,h="_blank";return window.open(g,h,f),!1}var g=window.location.href,h={twitter:{shareurl:"http://twitter.com/intent/tweet?",paramproto:{text:"text=",url:"url=",hashtags:"hashtags=",via:"via=",related:"related="}},facebook:{shareurl:"http://www.facebook.com/sharer.php?",paramproto:{u:"u="}},linkedin:{shareurl:"http://www.linkedin.com/shareArticle?",paramproto:{url:"url=",mini:"mini=",title:"title=",summary:"summary=",source:"source="}},googleplus:{shareurl:"https://plus.google.com/share?",paramproto:{url:"url=",hl:"hl="}}};!function(){function a(a,b){return b=$.map(b,function(b,c){return a+"-"+b}),function(a){if(a){var c=$.map(b,function(a,b){return"."+a});return c.join(", ")}return b}}function c(a){function c(a){return $(this).hasClass(a)}var d=Array.prototype.slice.call($(this)[0].attributes),f={};$.each(d,function(a,b){var c=b.name,d=b.value;if(0===c.indexOf(e+"-")||0===c.indexOf("data-"+e+"-")){var g=c.split(e+"-")[1];f[g]=d}});var h=g.filter(c.bind(this));if(1===h.length){var i=h[0].split("-")[1];b(i,f)}}var d=Object.keys(h),e="share",f=a(e,d)(!0),g=a(e,d)(!1);$(f).on("click",c)}();var i={share:b};return a=$.extend(a,i)}(SocialShare)}),angular.module("justiciaApp",["ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$window",function(a,b){pym.Child({polling:500});a.inIframe=function(){try{return b.self!==b.top}catch(a){return!0}}}]),angular.module("justiciaApp").controller("MainCtrl",["$scope",function(a){a.data=[{id:1,title:"¡Sos un ciudadano con suerte!",text:"Tu denuncia por corrupción es la única de las 219 relevadas que concluyó con una condena firme. En 2016, la Corte Suprema de Justicia de Tucumán confirmó el fallo condenatorio contra el comisario Enrique Antonio García y el policía Manuel Ezequiel Yapura por encubrimiento agravado, y el agente Roberto Oscar Lencina por adulterar un acta en la causa por el asesinato de Paulina Lebbos, una joven tucumana de 23 años.",video:"01.mp4",color:"#D50001"},{id:2,title:"¡Lo sentimos!",text:"Tu denuncia es una de las 195 causas por corrupción atrapadas en el laberinto judicial con escasos avances. Conocé más en la nota.",video:"02.mp4",color:"#A71D06"},{id:3,title:"Bonus Alperovich",text:"Tu denuncia es una de las 29 que involucran a José Alperovich, exgobernador (2003 - 2015) y senador nacional del Partido Justicialista.  Una lástima: aunque es, por lejos, el funcionario tucumano más denunciado desde 2005, ninguno de los procesos abiertos en su contra prosperó. Por lo que se sabe, Alperovich ni siquiera llegó a prestar una declaración indagatoria ante la Justicia.",video:"03.mp4",color:"#3ABDC1"},{id:4,title:"¡Ups!",text:"Tu denuncia cayó en saco roto: es una de las 12 causas archivadas. Ojalá que la próxima vez tengas más suerte, pero no te entusiasmes demasiado. Lamentablemente sólo 1 de las 219 denuncias por corrupción presentadas en los últimos 13 años en Tucumán terminó en una condena firme.",video:"04.mp4",color:"#CDDB29"},{id:5,title:"Hay esperanza",text:"Sos un ciudadano bastante afortunado. Tu denuncia avanzó y hoy tiene dos condenas. Sin embargo, el fallo está en revisión. Hasta ahora sólo una de las 219 denuncias por corrupción presentadas entre 2005 y 2017 culminó en una condena firme. ¿Tendrás la suerte de conseguir justicia?",video:"05.mp4",color:"#00769E"}],a.available=angular.copy(a.data),a.selectedVideo=a.available[0],a.media=!1,a.playing=!1,a.ended=!1,a.first=!0,a.playVideo=function(){a.first=!1,a.stopVideo(),0==a.available.length&&(a.available=angular.copy(a.data));var b=Math.floor(Math.random()*a.available.length);a.selectedVideo=a.available[b],a.available.splice(b,1),a.media=document.querySelector("#video-"+a.selectedVideo.id),a.media.addEventListener("ended",a.endedVideo),a.media.play(),a.ended=!1,a.playing=!0},a.endedVideo=function(){a.media&&(a.media.pause(),a.ended=!0,a.playing=!1,a.$apply())},a.stopVideo=function(){a.media&&(a.media.pause(),a.media.currentTime=0,a.playing=!1)}}]),angular.module("justiciaApp").run(["$templateCache",function(a){"use strict";a.put("views/main.html",'<div id="video-container"> <div class="row show-mobile"> <div class="col-xs-12"> <p class="lead">Entre 2005 y 2017, se presentaron al menos <strong>219 denuncias</strong> por corrupción en Tucumán. Pero <strong>sólo una</strong> terminó en una condena firme.</p> <p class="lead"><strong>En este juego, te contamos qué pasó con todas ellas.</strong></p> <div class="text-center"> <a id="btn-play" class="btn btn-lg btn-default" ng-hide="playing" ng-click="playVideo()">Quiero jugar</a> <div ng-if="playing && !ended"> <p id="loading" class="lead text-center"><i class="glyphicon glyphicon-arrow-down blink_me"></i> ¡Prestale atención al flipper! <i class="glyphicon glyphicon-arrow-down blink_me"></i></p> </div> </div> </div> </div> <div class="row"> <div id="col-video" class="cols"> <video id="video-{{d.id}}" class="video-item" poster="images/poster.png" width="100%" ng-repeat="d in data" ng-class="{selected:d.id==selectedVideo.id}"> <source id="source" ng-src="{{\'videos/\'+d.video}}" type="video/mp4"> </video> </div> <div id="col-text" class="cols"> <div class="hide-mobile" ng-if="first"> <p class="lead">Entre 2005 y 2017, se presentaron al menos <strong>219 denuncias</strong> por corrupción en Tucumán. Pero <strong>sólo una</strong> terminó en una condena firme.</p> <p class="lead"><strong>En este juego, te contamos qué pasó con todas ellas.</strong></p> </div> <div ng-if="playing && !ended"> <p id="loading" class="lead hide-mobile"><i class="glyphicon glyphicon-arrow-left blink_me"></i> ¡Prestale atención al flipper!</p> <p id="loading" class="lead show-mobile text-center"><i class="glyphicon glyphicon-arrow-up blink_me"></i> ¡Prestale atención al flipper! <i class="glyphicon glyphicon-arrow-up blink_me"></i></p> </div> <div ng-show="ended" class="result-item" ng-repeat="d in data" ng-class="{selected:d.id==selectedVideo.id}"> <p id="label-{{d.id}}" class="lead label label-default" ng-style="{\'background-color\':d.color}"><strong>{{d.title}}</strong></p> <p class="lead">{{d.text}}</p> </div> <div class="text-center"> <a id="btn-play" class="btn btn-lg btn-default" ng-hide="playing" ng-click="playVideo()">Quiero jugar</a> </div> </div> </div> </div>')}]);
