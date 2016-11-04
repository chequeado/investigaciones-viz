"use strict";var SocialShare=SocialShare||{};$(document).ready(function(){!function(t){function r(t,r){if(!c[t])throw new Error("Share service not defined");var a=e(t,r);return o(a),this}function e(t,r){var e=c[t].shareurl,o=c[t].paramproto;r=r||{},"facebook"===t?r.u?r.u=n+r.u:r.u=n:"twitter"===t||(r.url?r.url=n+r.url:r.url=n),"linkedin"===t&&(r.mini&&"true"===r.mini||(r.mini="true"));var s=a(r,o),l=i(e,s);return l}function a(t,r){var e=[];t=t||{};for(var a in t)if(r.hasOwnProperty(a)){var i=r[a]+encodeURIComponent(t[a]);e.push(i)}return e}function i(t,r){r=r||[];var e=r.length?t+r.join("&"):t;return e}function o(t){var r=600,e=600,a=($(window).height()-e)/2,i=($(window).width()-r)/2,o="status=1,width="+r+",height="+e+",top="+a+",left="+i,n=t,c="_blank";return window.open(n,c,o),!1}var n=window.location.href,c={twitter:{shareurl:"http://twitter.com/intent/tweet?",paramproto:{text:"text=",url:"url=",hashtags:"hashtags=",via:"via=",related:"related="}},facebook:{shareurl:"http://www.facebook.com/sharer.php?",paramproto:{u:"u="}},linkedin:{shareurl:"http://www.linkedin.com/shareArticle?",paramproto:{url:"url=",mini:"mini=",title:"title=",summary:"summary=",source:"source="}},googleplus:{shareurl:"https://plus.google.com/share?",paramproto:{url:"url=",hl:"hl="}}};!function(){function t(t,r){return r=$.map(r,function(r,e){return t+"-"+r}),function(t){if(t){var e=$.map(r,function(t,r){return"."+t});return e.join(", ")}return r}}function e(t){function e(t){return $(this).hasClass(t)}var a=Array.prototype.slice.call($(this)[0].attributes),o={};$.each(a,function(t,r){var e=r.name,a=r.value;if(0===e.indexOf(i+"-")||0===e.indexOf("data-"+i+"-")){var n=e.split(i+"-")[1];o[n]=a}});var c=n.filter(e.bind(this));if(1===c.length){var s=c[0].split("-")[1];r(s,o)}}var a=Object.keys(c),i="share",o=t(i,a)(!0),n=t(i,a)(!1);$(o).on("click",e)}();var s={share:r};return t=$.extend(t,s)}(SocialShare)});var CHQ;d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},function(t,r,e,a){CHQ={},CHQ.pymChild=pym.Child({polling:500}),CHQ.$body=e("body"),CHQ.circles,CHQ.init=function(){var t=CHQ.$body.width();CHQ.$body.css("min-height",9*t/16),a.init({key:"1EqitwKNC18omv0NsAaFEmdU_hyYY_2LOLBkhWJ9NeSM",callback:CHQ.dataLoaded,simpleSheet:!1,parseNumbers:!0}),CHQ.inIframe()?e(".iframe-show").show():e(".no-iframe-show").show()},CHQ.postProcess=function(t,r){return t.id=r,t},CHQ.dataLoaded=function(t,r){CHQ.rawData=t["DATASET-VIZ"].elements.map(CHQ.postProcess),CHQ.provinciasGroup=d3.nest().key(function(t){return t.provincia}).map(CHQ.rawData),CHQ.provincias=d3.keys(CHQ.provinciasGroup),CHQ.$body.removeClass("loading"),CHQ.render(),setTimeout(CHQ.startEvents,2e3)},CHQ.filters={genero:"",car:""},CHQ.startEvents=function(){e(window).resize(function(){clearTimeout(CHQ.timeoutId),CHQ.timeoutId=setTimeout(CHQ.render,500)}),e(".btn-filter-genero").on("click",function(){e(".btn-filter-genero").removeClass("btn-selected"),e(this).addClass("btn-selected"),CHQ.filters.genero=""!=e(this).data("value")?".genero-"+e(this).data("value"):"",CHQ.udpdateFilters()}),e(".btn-filter-car").on("click",function(){e(".btn-filter-car").removeClass("btn-selected"),e(this).addClass("btn-selected"),CHQ.filters.car=""!=e(this).data("value")?".car-"+e(this).data("value"):"",CHQ.udpdateFilters()})},CHQ.udpdateFilters=function(){CHQ.chart.circles.style("opacity",.3),CHQ.chart.circlesGroup.selectAll("circle"+CHQ.filters.genero+CHQ.filters.car).transition().style("opacity",1)},CHQ.render=function(){function t(){CHQ.selector.style("opacity",0),CHQ.chart.circles.classed("selected",!1),CHQ.tooltip.style("opacity",0).style("top","-300px").style("left","-300px")}function r(t){CHQ.chart.circles.each(a(10*t.alpha*t.alpha)).each(i(.5)).attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})}function a(t){return function(r){var e=CHQ.chart.clusters[r.cluster],a=1;if(e){e===r&&(CHQ.chart.clusterPoints?(e=CHQ.chart.clusterPoints[r.cluster],e={x:e.x,y:e.y,radius:-e.radius},a=.5*Math.sqrt(r.radius)):(e={x:d/2,y:p/3,radius:-r.radius},a=.1*Math.sqrt(r.radius)));var i=r.x-e.x,o=r.y-e.y,n=Math.sqrt(i*i+o*o),c=r.radius+e.radius;n!=c&&(n=(n-c)/n*t*a,r.x-=i*=n,r.y-=o*=n,e.x+=i,e.y+=o)}}}function i(t){var r=d3.geom.quadtree(v);return function(e){var a=e.radius+C+Math.max(h,f),i=e.x-a,o=e.x+a,n=e.y-a,c=e.y+a;r.visit(function(r,a,s,l,u){if(r.point&&r.point!==e){var d=e.x-r.point.x,p=e.y-r.point.y,C=Math.sqrt(d*d+p*p),v=e.radius+r.point.radius+(e.cluster===r.point.cluster?h:f);C<v&&(C=(C-v)/C*t,e.x-=d*=C,e.y-=p*=C,r.point.x+=d,r.point.y+=p)}return a>o||l<i||s>c||u<n})}}function o(){return CHQ.chart.clusters={},CHQ.chart.clusterPoints={},d3.selectAll("g.provincia-group").each(function(t){var r=d3.select(this),e=r.select("rect.aliado-col"),a=r.select("rect.opositor-col");CHQ.chart.clusterPoints[t+"-compatible"]={x:d3.transform(r.attr("transform")).translate[0]+e.attr("width")/2+l,y:d3.transform(r.attr("transform")).translate[1]+e.attr("height")/2,radius:s},CHQ.chart.clusterPoints[t+"-opositor"]={x:d3.transform(r.attr("transform")).translate[0]+a.attr("width")/2+2*l,y:d3.transform(r.attr("transform")).translate[1]+a.attr("height")/2,radius:s}}),CHQ.rawData.map(function(t){var r=t.provincia+"-"+t.relacion_gobernador,e=10,a={cluster:r,radius:s,data:t};return(!CHQ.chart.clusters[r]||e>CHQ.chart.clusters[r].radius)&&(CHQ.chart.clusters[r]=a),a})}var n=e("#chart-container").width();CHQ.smallDevice=n<700;var c=CHQ.smallDevice?100:60,s=CHQ.smallDevice?15:7,l=n/3,u=(CHQ.provincias.length+1)*c,d=n,p=u,h=1,f=5,C=n/25;CHQ.chart||(CHQ.chart={},CHQ.chart.svg=d3.select("#chart-container").append("svg").attr("id","main-chart-svg"),CHQ.chart.provinciasGroup=CHQ.chart.svg.append("g").attr("id","provincias-chart-group"),CHQ.chart.circlesGroup=CHQ.chart.svg.append("g").attr("id","circles-chart-group"),CHQ.tooltip=d3.select("body").append("div").attr("id","circle-tooltip"),CHQ.selector=CHQ.chart.svg.append("circle").attr("id","selector").style("stroke-width",3).style("opacity",0).attr("fill","none")),CHQ.chart.svg.attr("width",d).attr("height",p),CHQ.chart.provincias=CHQ.chart.provinciasGroup.selectAll("g.provincia-group").data(CHQ.provincias),CHQ.chart.provincias.enter().append("g").classed("provincia-group",!0).each(function(t,r){var e=d3.select(this);r%2==0&&e.append("rect").datum(t).classed("full-bg",!0),e.append("text").datum(t).classed("text-provincia",!0).attr("text-anchor","end").text(function(t){return t}),e.append("rect").datum(t).classed("aliado-col",!0),e.append("rect").datum(t).classed("opositor-col",!0)}),CHQ.chart.provincias.selectAll("rect.full-bg").attr("width",n).attr("height",c),CHQ.chart.provincias.selectAll("rect.aliado-col").attr("x",l).attr("width",l).attr("height",c),CHQ.chart.provincias.selectAll("rect.opositor-col").attr("x",2*l).attr("width",l).attr("height",c),CHQ.chart.provincias.selectAll("text.text-provincia").attr("y",c/2+5).attr("x",l-20),CHQ.chart.provincias.attr("transform",function(t,r){return"translate(0,"+r*c+")"});var v=o();d3.layout.force().nodes(v).size([d,p]).gravity(0).charge(1).on("tick",r).start();CHQ.chart.circles=CHQ.chart.circlesGroup.selectAll("circle.juez").data(v),CHQ.chart.circles.enter().append("circle").attr("class",function(t){var r=[];return r.push("genero-"+t.data.genero),"SI"==t.data.familiares&&r.push("car-familiares"),"SI"==t.data.cargos_publicos&&r.push("car-cargos"),r.join(" ")}).classed("juez",!0).on("click",function(r){if(CHQ.smallDevice){t();var e=d3.select(this).classed("selected",!0);CHQ.selector.attr("r",parseInt(e.attr("r"))+10).style("stroke",function(){return"opositor"==r.data.relacion_gobernador?"#7873C0":"#21B087"}).transition().style("opacity",1).attr("cx",e.attr("cx")).attr("cy",e.attr("cy"));var a="<strong>"+r.data.nombre+"</strong> fue designado por <strong>"+r.data.gobernador+"</strong>.<br/>";a+=r.data.detalle,CHQ.tooltip.html(a).classed("mobile",!0).style("top",d3.event.pageY+2*s+"px").style("left","0px").style("opacity",1)}}).on("mouseenter",function(t){if(!CHQ.smallDevice){var r=d3.select(this).classed("selected",!0);CHQ.selector.attr("r",parseInt(r.attr("r"))+10).style("stroke",function(){return"opositor"==t.data.relacion_gobernador?"#7873C0":"#21B087"}).transition().style("opacity",1).attr("cx",r.attr("cx")).attr("cy",r.attr("cy"));var e="<strong>"+t.data.nombre+"</strong> fue designado por <strong>"+t.data.gobernador+"</strong>.<br/>";e+=t.data.detalle,CHQ.tooltip.html(e).classed("mobile",!1).style("opacity",1)}}).on("mousemove",function(t){CHQ.smallDevice||CHQ.tooltip.style("top",d3.event.pageY-20+"px").style("left",function(){var r=d3.event.pageX+20;return"opositor"==t.data.relacion_gobernador&&(r-=340),r+"px"})}).on("mouseout",function(r){if(!CHQ.smallDevice){d3.select(this).classed("selected",!1);t()}}),CHQ.chart.circles.attr("id",function(t){return"e"+t.data.nombre}).attr("r",function(t){return t.radius}).style("fill",function(t){return"opositor"==t.data.relacion_gobernador?"#7873C0":"#21B087"}),CHQ.chart.circles.exit().remove(),CHQ.selector.moveToFront()},CHQ.inIframe=function(){try{return window.self!==window.top}catch(t){return!0}}}(window,document,jQuery,Tabletop);