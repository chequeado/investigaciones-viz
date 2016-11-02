"use strict";var SocialShare=SocialShare||{};$(document).ready(function(){!function(t){function r(t,r){if(!c[t])throw new Error("Share service not defined");var e=a(t,r);return n(e),this}function a(t,r){var a=c[t].shareurl,n=c[t].paramproto;r=r||{},"facebook"===t?r.u?r.u=o+r.u:r.u=o:"twitter"===t||(r.url?r.url=o+r.url:r.url=o),"linkedin"===t&&(r.mini&&"true"===r.mini||(r.mini="true"));var s=e(r,n),l=i(a,s);return l}function e(t,r){var a=[];t=t||{};for(var e in t)if(r.hasOwnProperty(e)){var i=r[e]+encodeURIComponent(t[e]);a.push(i)}return a}function i(t,r){r=r||[];var a=r.length?t+r.join("&"):t;return a}function n(t){var r=600,a=600,e=($(window).height()-a)/2,i=($(window).width()-r)/2,n="status=1,width="+r+",height="+a+",top="+e+",left="+i,o=t,c="_blank";return window.open(o,c,n),!1}var o=window.location.href,c={twitter:{shareurl:"http://twitter.com/intent/tweet?",paramproto:{text:"text=",url:"url=",hashtags:"hashtags=",via:"via=",related:"related="}},facebook:{shareurl:"http://www.facebook.com/sharer.php?",paramproto:{u:"u="}},linkedin:{shareurl:"http://www.linkedin.com/shareArticle?",paramproto:{url:"url=",mini:"mini=",title:"title=",summary:"summary=",source:"source="}},googleplus:{shareurl:"https://plus.google.com/share?",paramproto:{url:"url=",hl:"hl="}}};!function(){function t(t,r){return r=$.map(r,function(r,a){return t+"-"+r}),function(t){if(t){var a=$.map(r,function(t,r){return"."+t});return a.join(", ")}return r}}function a(t){function a(t){return $(this).hasClass(t)}var e=Array.prototype.slice.call($(this)[0].attributes),n={};$.each(e,function(t,r){var a=r.name,e=r.value;if(0===a.indexOf(i+"-")||0===a.indexOf("data-"+i+"-")){var o=a.split(i+"-")[1];n[o]=e}});var c=o.filter(a.bind(this));if(1===c.length){var s=c[0].split("-")[1];r(s,n)}}var e=Object.keys(c),i="share",n=t(i,e)(!0),o=t(i,e)(!1);$(n).on("click",a)}();var s={share:r};return t=$.extend(t,s)}(SocialShare)});var CHQ;d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},function(t,r,a,e){CHQ={},CHQ.pymChild=pym.Child({polling:500}),CHQ.$body=a("body"),CHQ.circles,CHQ.init=function(){var t=CHQ.$body.width();CHQ.$body.css("min-height",9*t/16),e.init({key:"1EqitwKNC18omv0NsAaFEmdU_hyYY_2LOLBkhWJ9NeSM",callback:CHQ.dataLoaded,simpleSheet:!1,parseNumbers:!0}),CHQ.inIframe()?a(".iframe-show").show():a(".no-iframe-show").show()},CHQ.postProcess=function(t,r){return t.id=r,t},CHQ.dataLoaded=function(t,r){CHQ.rawData=t["DATASET-VIZ"].elements.map(CHQ.postProcess),CHQ.provinciasGroup=d3.nest().key(function(t){return t.provincia}).map(CHQ.rawData),CHQ.provincias=d3.keys(CHQ.provinciasGroup),CHQ.$body.removeClass("loading"),CHQ.render(),setTimeout(CHQ.startEvents,2e3)},CHQ.filters={genero:"",car:""},CHQ.startEvents=function(){a(window).resize(function(){clearTimeout(CHQ.timeoutId),CHQ.timeoutId=setTimeout(CHQ.render,500)}),a(".btn-filter-genero").on("click",function(){a(".btn-filter-genero").removeClass("btn-selected"),a(this).addClass("btn-selected"),CHQ.filters.genero=""!=a(this).data("value")?".genero-"+a(this).data("value"):"",CHQ.udpdateFilters()}),a(".btn-filter-car").on("click",function(){a(".btn-filter-car").removeClass("btn-selected"),a(this).addClass("btn-selected"),CHQ.filters.car=""!=a(this).data("value")?".car-"+a(this).data("value"):"",CHQ.udpdateFilters()})},CHQ.udpdateFilters=function(){CHQ.chart.circles.style("opacity",.3),CHQ.chart.circlesGroup.selectAll("circle"+CHQ.filters.genero+CHQ.filters.car).transition().style("opacity",1)},CHQ.render=function(){function t(t){CHQ.chart.circles.each(r(10*t.alpha*t.alpha)).each(e(.5)).attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})}function r(t){return function(r){var a=CHQ.chart.clusters[r.cluster],e=1;if(a){a===r&&(CHQ.chart.clusterPoints?(a=CHQ.chart.clusterPoints[r.cluster],a={x:a.x,y:a.y,radius:-a.radius},e=.5*Math.sqrt(r.radius)):(a={x:l/2,y:u/3,radius:-r.radius},e=.1*Math.sqrt(r.radius)));var i=r.x-a.x,n=r.y-a.y,o=Math.sqrt(i*i+n*n),c=r.radius+a.radius;o!=c&&(o=(o-c)/o*t*e,r.x-=i*=o,r.y-=n*=o,a.x+=i,a.y+=n)}}}function e(t){var r=d3.geom.quadtree(f);return function(a){var e=a.radius+p+Math.max(d,h),i=a.x-e,n=a.x+e,o=a.y-e,c=a.y+e;r.visit(function(r,e,s,l,u){if(r.point&&r.point!==a){var p=a.x-r.point.x,f=a.y-r.point.y,C=Math.sqrt(p*p+f*f),v=a.radius+r.point.radius+(a.cluster===r.point.cluster?d:h);C<v&&(C=(C-v)/C*t,a.x-=p*=C,a.y-=f*=C,r.point.x+=p,r.point.y+=f)}return e>n||l<i||s>c||u<o})}}function i(){return CHQ.chart.clusters={},CHQ.chart.clusterPoints={},d3.selectAll("g.provincia-group").each(function(t){var r=d3.select(this),a=r.select("rect.aliado-col"),e=r.select("rect.opositor-col");CHQ.chart.clusterPoints[t+"-compatible"]={x:d3.transform(r.attr("transform")).translate[0]+a.attr("width")/2+c,y:d3.transform(r.attr("transform")).translate[1]+a.attr("height")/2,radius:7},CHQ.chart.clusterPoints[t+"-opositor"]={x:d3.transform(r.attr("transform")).translate[0]+e.attr("width")/2+2*c,y:d3.transform(r.attr("transform")).translate[1]+e.attr("height")/2,radius:7}}),CHQ.rawData.map(function(t){var r=t.provincia+"-"+t.relacion_gobernador,a=10,e={cluster:r,radius:7,data:t};return(!CHQ.chart.clusters[r]||a>CHQ.chart.clusters[r].radius)&&(CHQ.chart.clusters[r]=e),e})}var n=a("#chart-container").width();CHQ.smallDevice=n<990;var o=75,c=n/3,s=(CHQ.provincias.length+1)*o,l=n,u=s,d=1,h=5,p=n/25;CHQ.chart||(CHQ.chart={},CHQ.chart.svg=d3.select("#chart-container").append("svg").attr("id","main-chart-svg"),CHQ.chart.provinciasGroup=CHQ.chart.svg.append("g").attr("id","provincias-chart-group"),CHQ.chart.circlesGroup=CHQ.chart.svg.append("g").attr("id","circles-chart-group"),CHQ.tooltip=d3.select("body").append("div").attr("id","circle-tooltip"),CHQ.selector=CHQ.chart.svg.append("circle").attr("id","selector").style("stroke-width",3).style("opacity",0).attr("fill","none")),CHQ.chart.svg.attr("width",l).attr("height",u),CHQ.chart.provincias=CHQ.chart.provinciasGroup.selectAll("g.provincia-group").data(CHQ.provincias),CHQ.chart.provincias.enter().append("g").classed("provincia-group",!0).each(function(t){var r=d3.select(this);r.append("text").datum(t).attr("y",o/2+5).classed("text-provincia",!0).attr("text-anchor","end").text(function(t){return t}),r.append("rect").datum(t).classed("aliado-col",!0).attr("fill","#FFF"),r.append("rect").datum(t).classed("opositor-col",!0).attr("fill","#FFF")}),CHQ.chart.provincias.selectAll("rect.aliado-col").attr("x",c).attr("width",c).attr("height",o),CHQ.chart.provincias.selectAll("rect.opositor-col").attr("x",2*c).attr("width",c).attr("height",o),CHQ.chart.provincias.selectAll("text.text-provincia").attr("x",c),CHQ.chart.provincias.attr("transform",function(t,r){return"translate(0,"+r*o+")"});var f=i(),C=d3.layout.force().nodes(f).size([l,u]).gravity(0).charge(1).on("tick",t).start();CHQ.chart.circles=CHQ.chart.circlesGroup.selectAll("circle.juez").data(f),CHQ.chart.circles.enter().append("circle").attr("class",function(t){var r=[];return r.push("genero-"+t.data.genero),"SI"==t.data.familiares&&r.push("car-familiares"),"SI"==t.data.cargos_publicos&&r.push("car-cargos"),r.join(" ")}).classed("juez",!0).on("click",function(t){}).on("mouseenter",function(t){console.log(t);var r=d3.select(this);CHQ.selector.attr("r",Math.round(r.attr("r"))).attr("cx",r.attr("cx")).attr("cy",r.attr("cy")).style("opacity",1).transition().delay(200).style("opacity",0).attr("r",Math.round(r.attr("r"))+30);var a="<strong>"+t.data.nombre+"</strong> fue designado por <strong>"+t.data.gobernador+"</strong>";CHQ.tooltip.html(a).style("opacity",1),r.attr("fill","red")}).on("mousemove",function(){CHQ.tooltip.style("top",d3.event.pageY-20+"px").style("left",d3.event.pageX+20+"px")}).on("mouseout",function(t){CHQ.tooltip.style("opacity",0)}),CHQ.chart.circles.attr("id",function(t){return"e"+t.data.nombre}).attr("r",function(t){return t.radius}).style("fill",function(t){return"opositor"==t.data.relacion_gobernador?"orange":"steelblue"}).call(C.drag),CHQ.chart.circles.exit().remove(),CHQ.selector.moveToFront()},CHQ.inIframe=function(){try{return window.self!==window.top}catch(t){return!0}}}(window,document,jQuery,Tabletop);