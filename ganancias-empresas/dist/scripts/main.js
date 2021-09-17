"use strict";var SocialShare=SocialShare||{};$(document).ready(function(){!function(e){function t(e,t){if(!s[e])throw new Error("Share service not defined");var a=r(e,t);return o(a),this}function r(e,t){var r=s[e].shareurl,o=s[e].paramproto;t=t||{},"facebook"===e?t.u?t.u=i+t.u:t.u=i:"twitter"===e||(t.url?t.url=i+t.url:t.url=i),"linkedin"===e&&(t.mini&&"true"===t.mini||(t.mini="true"));var c=a(t,o),l=n(r,c);return l}function a(e,t){var r=[];e=e||{};for(var a in e)if(t.hasOwnProperty(a)){var n=t[a]+encodeURIComponent(e[a]);r.push(n)}return r}function n(e,t){t=t||[];var r=t.length?e+t.join("&"):e;return r}function o(e){var t=600,r=600,a=($(window).height()-r)/2,n=($(window).width()-t)/2,o="status=1,width="+t+",height="+r+",top="+a+",left="+n,i=e,s="_blank";return window.open(i,s,o),!1}var i=window.location.href,s={twitter:{shareurl:"http://twitter.com/intent/tweet?",paramproto:{text:"text=",url:"url=",hashtags:"hashtags=",via:"via=",related:"related="}},facebook:{shareurl:"http://www.facebook.com/sharer.php?",paramproto:{u:"u="}},linkedin:{shareurl:"http://www.linkedin.com/shareArticle?",paramproto:{url:"url=",mini:"mini=",title:"title=",summary:"summary=",source:"source="}},googleplus:{shareurl:"https://plus.google.com/share?",paramproto:{url:"url=",hl:"hl="}}};!function(){function e(e,t){return t=$.map(t,function(t,r){return e+"-"+t}),function(e){if(e){var r=$.map(t,function(e,t){return"."+e});return r.join(", ")}return t}}function r(e){function r(e){return $(this).hasClass(e)}var a=Array.prototype.slice.call($(this)[0].attributes),o={};$.each(a,function(e,t){var r=t.name,a=t.value;if(0===r.indexOf(n+"-")||0===r.indexOf("data-"+n+"-")){var i=r.split(n+"-")[1];o[i]=a}});var s=i.filter(r.bind(this));if(1===s.length){var c=s[0].split("-")[1];t(c,o)}}var a=Object.keys(s),n="share",o=e(n,a)(!0),i=e(n,a)(!1);$(o).on("click",r)}();var c={share:t};return e=$.extend(e,c)}(SocialShare)});var CHQ;d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},function(e,t,r,a){CHQ={},CHQ.pymChild=pym.Child({polling:500}),CHQ.$details=r("#details"),CHQ.$tips=r("#tips"),CHQ.$body=r("body"),CHQ.$colChart=r("#col-chart-container"),CHQ.$colOptions=r("#selectors"),CHQ.circles,CHQ.year="promedio",CHQ.group="center",CHQ.init=function(){var e=CHQ.$body.width();CHQ.$body.css("min-height",9*e/16),d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQSuIxxul7mZnK2hcayF8tR9slJ8O31jtGqACGiyEeaFy1NOOi2CT0JUOxML1GBYCT-QVguRHKdB-w4/pub?gid=1208382772&single=true&output=csv",CHQ.dataLoaded),CHQ.inIframe()?r(".iframe-show").show():r(".no-iframe-show").show()},CHQ.postProcess=function(e,t){return e.max=0,e.id=t,r.each(e,function(t,r){0==t.indexOf("porcentaje_")&&(e[t]=parseFloat(e[t].replace(",",".")),e[t]>e.max&&(e.max=e[t]))}),e},CHQ.dataLoaded=function(e){CHQ.rawData=e.map(CHQ.postProcess),CHQ.groups=d3.nest().key(function(e){return e.sector.trim()}).map(CHQ.rawData),CHQ.categories=d3.keys(CHQ.groups),CHQ.dataById=d3.nest().key(function(e){return e.id}).rollup(function(e){return e[0]}).map(CHQ.rawData),CHQ.maxValue=d3.max(CHQ.rawData,function(e){return e.max}),CHQ.$body.removeClass("loading"),CHQ.render(),CHQ.renderSelect(),setTimeout(CHQ.startEvents,2e3)},CHQ.filterData=function(){var e=r.extend(!0,[],CHQ.rawData).map(function(e){return isNaN(e["porcentaje_"+CHQ.year])?(e.noPresentaron=!0,e["porcentaje_"+CHQ.year]=0):e.noPresentaron=!1,e});CHQ.data=e.map(function(e){return{id:e.id,empresa:e.empresa,sector:e.sector,noPresentaron:e.noPresentaron,anio:CHQ.year,porcentaje:e["porcentaje_"+CHQ.year]}})},CHQ.startEvents=function(){r(window).resize(function(){clearTimeout(CHQ.timeoutId),CHQ.timeoutId=setTimeout(CHQ.render,500)}),r(".btn-year").on("click",function(){r(".btn-year").removeClass("btn-selected"),r(this).addClass("btn-selected"),CHQ.year=r(this).data("value"),CHQ.render()}),r(".btn-order").on("click",function(){r(".btn-order").removeClass("btn-selected"),r(this).addClass("btn-selected"),CHQ.group=r(this).data("value"),CHQ.render()}),r("#close-details").on("click",CHQ.closeDetails)},CHQ.render=function(){function e(e){CHQ.circles.each(t(10*e.alpha*e.alpha)).each(n(.5)).attr("cx",function(e){return e.x}).attr("cy",function(e){return e.y})}function t(e){return function(t){var r=Q[t.cluster],a=1;if(r){r===t&&(y?(r=y[t.cluster],r={x:r.x,y:r.y,radius:-r.radius},a=.5*Math.sqrt(t.radius)):(r={x:s/2,y:c/3,radius:-t.radius},a=.1*Math.sqrt(t.radius)));var n=t.x-r.x,o=t.y-r.y,i=Math.sqrt(n*n+o*o),l=t.radius+r.radius;i!=l&&(i=(i-l)/i*e*a,t.x-=n*=i,t.y-=o*=i,r.x+=n,r.y+=o)}}}function n(e){var t=d3.geom.quadtree(h);return function(r){var a=r.radius+u+Math.max(l,d),n=r.x-a,o=r.x+a,i=r.y-a,s=r.y+a;t.visit(function(t,a,c,u,p){if(t.point&&t.point!==r){var C=r.x-t.point.x,m=r.y-t.point.y,Q=Math.sqrt(C*C+m*m),h=r.radius+t.point.radius+(r.cluster===t.point.cluster?l:d);Q<h&&(Q=(Q-h)/Q*e,r.x-=C*=Q,r.y-=m*=Q,t.point.x+=C,t.point.y+=m)}return a>o||u<n||c>s||p<i})}}CHQ.filterData();var o=r("#chart-container").width();CHQ.smallDevice=o<990;var i=CHQ.smallDevice||CHQ.selectedId?3*o/4:9*o/16,s=o,c=i,l=2,d=2,u=o/25,p=o/100,C=o/75,m=o/150;CHQ.color=d3.scale.category20().domain(CHQ.categories);var Q,h,H,f={max:Math.ceil(CHQ.maxValue),min:0,minSize:0,maxSize:0,classContainer:CHQ.smallDevice||CHQ.selectedId||"center"==!CHQ.group?"col-sm-12 col-xs-12":"col-md-7"};switch(CHQ.group){case"center":H=d3.scale.linear().domain([0,CHQ.maxValue]).range([p,u]),f.minSize=p<5?20:2*p,f.maxSize=2*u,Q=new Array(CHQ.categories.length),h=CHQ.data.map(function(e){var t=e.sector,r=H(e.porcentaje),e={cluster:t,radius:r,data:e};return(!Q[t]||r>Q[t].radius)&&(Q[t]=e),e}),CHQ.textGroup&&CHQ.textGroup.selectAll("text").style("opacity",0);break;case"sector":H=d3.scale.linear().domain([0,CHQ.maxValue]).range([m,C]),f.minSize=m<5?20:2*m,f.maxSize=2*C,Q=new Array(CHQ.categories.length);var y=new Array(CHQ.categories.length),g=[],v=Math.floor(s/11),x=Math.floor(c/4),w=d3.range(0,s,v),b=d3.range(0,c,x),k=0,S=1;h=CHQ.data.map(function(e){var t=e.sector,r=H(e.porcentaje),e={cluster:t,radius:r,data:e};if(!y[t]){w[k+2]?k+=1:(k=1,S+=1);var a=CHQ.groups[e.cluster].length,n=0;n=a>5?1*C:n,n=a>10?1.5*C:n,n=a>15?2*C:n,g.push({x:w[k],y:b[S]-5*C,radius:3,title:t,anchor:"middle"}),y[t]={x:w[k],y:b[S]-2*C+n,radius:3,title:t,anchor:"middle"}}return(!Q[t]||r>Q[t].radius)&&(Q[t]=e),e}),CHQ.smallDevice?CHQ.textGroup.selectAll("text").style("opacity",0):(d3plus.textBox().select("g#text-chart-group").data(g).width(v).text(function(e){return e.title}).textAnchor(function(e){return e.anchor}).x(function(e){return e.x-v/2}).y(function(e){return e.y}).fontSize(12)(),CHQ.textGroup.selectAll("text").style("opacity",1)),CHQ.renderSelect()}var $=r("#tpl-legend").html();a.parse($),f.midSize=(f.minSize+f.maxSize)/2,f.midPadding=(f.maxSize-f.midSize)/2,f.minPadding=(f.maxSize-f.minSize)/2,f.txtPadding=(f.maxSize-20)/2;var j=a.render($,f);r("#legend-container").html(j);var I=d3.layout.force().nodes(h).size([s,c]).gravity(0).charge(1).on("tick",e).start();CHQ.svg||(CHQ.svg=d3.select("#chart-container").append("svg").attr("id","main-chart-svg"),CHQ.circlesGroup=CHQ.svg.append("g").attr("id","circles-chart-group"),CHQ.textGroup=CHQ.svg.append("g").attr("id","text-chart-group"),CHQ.tooltip=d3.select("body").append("div").attr("id","circle-tooltip"),CHQ.selector=CHQ.svg.append("circle").attr("id","selector").style("stroke-width",3).style("opacity",0).attr("fill","none")),CHQ.svg.attr("width",s).attr("height",c),CHQ.circles=CHQ.circlesGroup.selectAll("circle.company").data(h),CHQ.circles.enter().append("circle").classed("company",!0).on("click",function(e){CHQ.openDetails(CHQ.dataById[e.data.id]),d3.selectAll("circle").classed("selected",!1),d3.select(this).classed("selected",!0)}).on("mouseenter",function(e){var t=d3.select(this);CHQ.selector.attr("stroke",d3.rgb(CHQ.color(e.data.sector)).darker().toString()).attr("r",Math.round(t.attr("r"))).attr("cx",t.attr("cx")).attr("cy",t.attr("cy")).style("opacity",1).transition().delay(200).style("opacity",0).attr("r",Math.round(t.attr("r"))+30);var r="";r+=e.data.noPresentaron?"<strong>No declaró</strong> públicamente sus ganancias ":"<strong>"+e.data.empresa+"</strong> pagó el <strong>"+(e.data.porcentaje+"").replace(".",",")+"%</strong>",r+="promedio"==e.data.anio?" en promedio entre <strong>2012 y 2015</strong>":" en el año <strong>"+e.data.anio+"</strong>",CHQ.tooltip.html(r).style("opacity",1),t.attr("stroke",d3.rgb(CHQ.color(e.data.sector)).darker().toString())}).on("mousemove",function(){CHQ.tooltip.style("top",d3.event.pageY-20+"px").style("left",d3.event.pageX+20+"px")}).on("mouseout",function(e){CHQ.tooltip.style("opacity",0)}),CHQ.circles.attr("id",function(e){return"e"+e.data.id}).attr("stroke",function(e){return e.data.noPresentaron?"black":CHQ.color(e.data.sector)}).classed("zero",function(e){return 0==e.data.porcentaje}).attr("r",function(e){return e.data.noPresentaron?H(0):e.radius}).style("fill",function(e){return e.data.noPresentaron?"black":0==e.data.porcentaje?"white":CHQ.color(e.cluster)}).call(I.drag),CHQ.circles.exit().remove(),CHQ.selector.moveToFront(),CHQ.selectedId&&(CHQ.openDetails(CHQ.dataById[CHQ.selectedId]),d3.selectAll("circle").classed("selected",!1),d3.select("#e"+CHQ.selectedId).classed("selected",!0))},CHQ.renderSelect=function(e){if(CHQ.selectedId){var t=CHQ.dataById[CHQ.selectedId];e=e?e:t.sector}var n=r("#tpl-select-industry").html();a.parse(n);var o={categories:CHQ.categories.map(function(t){var r=!!e&&t==e;return{val:t,txt:t,sel:r}}),empresasOption:!!e,empresas:!!e&&CHQ.groups[e].map(function(e){var t=e.id==CHQ.selectedId;return{val:e.id,txt:e.empresa,sel:t}})};o.categories.unshift({val:"",txt:"< sector >",sel:!e});var i=a.render(n,o);r("#select-block").html(i),r("#category").on("change",function(){var e=r(this).val();""!=e&&(CHQ.renderSelect(e),r("#empresa").change())}),r("#empresa").on("change",function(){var e=r(this).val();CHQ.openDetails(CHQ.dataById[e]),d3.selectAll("circle").classed("selected",!1),d3.select("circle#e"+e).classed("selected",!0).style("stroke",function(e){return d3.rgb(CHQ.color(e.data.sector)).darker().toString()})})},CHQ.openDetails=function(e){r("body").addClass("detailsOpened"),CHQ.selectedId=e.id,CHQ.$colChart.hasClass("col-md-12")&&(CHQ.$colChart.removeClass("col-md-12").addClass("col-md-7"),CHQ.render(),CHQ.$details.fadeIn(),CHQ.$tips.hide(),CHQ.$colOptions.removeClass("col-sm-7").addClass("col-sm-12"));var t=r("#tpl-details").html();a.parse(t),e.color=CHQ.color(e.sector),e.selectedYear=CHQ.year,e.isPromedio="promedio"==CHQ.year,e.selectedValue=(e["porcentaje_"+CHQ.year]+"").replace(".",","),e.noPresentaron=!!isNaN(e["porcentaje_"+CHQ.year]);var n=a.render(t,e);r("#details-block").html(n);var o={};r.each(e,function(e,t){e.indexOf("_")!==-1&&(e=e.split("_"),o[e[1]]=!0)}),o=d3.keys(o).sort();var i=[];r.each(o,function(t,a){var n={anio:a};r.each(e,function(e,t){e.indexOf("_")!==-1&&(e=e.split("_"),e[1]==a&&(n[e[0]]=t))}),i.push(n)});var s=i.filter(function(e){return"promedio"==e.anio})[0],c=[{value:s.porcentaje,text:s.porcentaje+"% promedio"}];i=i.filter(function(e){return"promedio"!=e.anio});var l={json:i,keys:{x:"anio",value:["porcentaje"]},type:"bar",colors:{porcentaje:e.color}};CHQ.pchart=c3.generate({bindto:"#per-chart",data:l,bar:{width:{ratio:.5}},size:{height:100},axis:{y:{label:"Porcentaje",min:0,show:!1,padding:{bottom:0,top:10}},x:{type:"category"}},grid:{y:{lines:c}},legend:{show:!1},tooltip:{format:{value:function(e,t,r,a){return(e+"%").replace(".",",")}}}});var d={json:i,keys:{x:"anio",value:["ganancias","ventas"]},type:"line",names:{ventas:"Ventas",ganancias:"Pago de ganancias"},colors:{ganancias:e.color,ventas:d3.rgb(e.color).darker()}};CHQ.chart?CHQ.chart.load(d):CHQ.chart=c3.generate({bindto:"#line-chart",data:d,axis:{y:{min:0,tick:{format:function(e){return d3.format("$,")(e).replace(/,/g,".")}},padding:{bottom:0}},x:{type:"category",tick:{outer:!1}}}}),CHQ.renderSelect()},CHQ.closeDetails=function(){r("body").removeClass("detailsOpened"),CHQ.selectedId=!1,CHQ.$colChart.removeClass("col-md-7").addClass("col-md-12"),CHQ.$colOptions.removeClass("col-sm-12").addClass("col-sm-7"),CHQ.render(),CHQ.$details.hide(),CHQ.$tips.show(),d3.selectAll("circle").classed("selected",!1)},CHQ.inIframe=function(){try{return window.self!==window.top}catch(e){return!0}}}(window,document,jQuery,Mustache);