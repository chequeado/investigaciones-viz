"use strict";var CHQ;!function(t,a,e,r){CHQ={},CHQ.pymChild=pym.Child({polling:500}),CHQ.init=function(){console.log("init"),r.init({key:"1lZH4R70Ln3vqZFnDvySuA681kKJJWc49GEoFJwpKLDc",callback:CHQ.dataLoaded,simpleSheet:!1,parseNumbers:!0})},CHQ.postProcess=function(t,a){return t.max=0,t.id=a,e.each(t,function(a,e){0==a.indexOf("porcentaje_")&&(t[a]=parseFloat(t[a].replace(",",".")),t[a]>t.max&&(t.max=t[a]))}),t},CHQ.dataLoaded=function(t,a){CHQ.rawData=t.detalle.elements.map(CHQ.postProcess),CHQ.groups=d3.nest().key(function(t){return t.sector}).map(CHQ.rawData),CHQ.categories=d3.keys(CHQ.groups),CHQ.dataById=d3.nest().key(function(t){return t.id}).rollup(function(t){return t[0]}).map(CHQ.rawData),CHQ.maxValue=d3.max(CHQ.rawData,function(t){return t.max}),CHQ.filterData("2015"),CHQ.render(),CHQ.startEvents()},CHQ.filterData=function(t){var a=CHQ.rawData.filter(function(a){return!isNaN(a["porcentaje_"+t])});CHQ.data=a.map(function(a){return{id:a.id,empresa:a.empresa,sector:a.sector,anio:t,porcentaje:a["porcentaje_"+t]}})},CHQ.startEvents=function(){e("#year").change(function(){e("#detalle").html(""),CHQ.filterData(e(this).val()),CHQ.render()})},CHQ.render=function(){function t(t){H.each(a(10*t.alpha*t.alpha)).each(r(.5)).attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y})}function a(t){return function(a){var e=p[a.cluster],r=1;if(e){e===a&&(e={x:o/2,y:i/2,radius:-a.radius},r=.1*Math.sqrt(a.radius));var n=a.x-e.x,c=a.y-e.y,s=Math.sqrt(n*n+c*c),l=a.radius+e.radius;s!=l&&(s=(s-l)/s*t*r,a.x-=n*=s,a.y-=c*=s,e.x+=n,e.y+=c)}}}function r(t){var a=d3.geom.quadtree(C);return function(e){var r=e.radius+l+Math.max(c,s),n=e.x-r,o=e.x+r,i=e.y-r,u=e.y+r;a.visit(function(a,r,l,d,p){if(a.point&&a.point!==e){var C=e.x-a.point.x,f=e.y-a.point.y,H=Math.sqrt(C*C+f*f),Q=e.radius+a.point.radius+(e.cluster===a.point.cluster?c:s);H<Q&&(H=(H-Q)/H*t,e.x-=C*=H,e.y-=f*=H,a.point.x+=C,a.point.y+=f)}return r>o||d<n||l>u||p<i})}}console.log(CHQ.groups),console.log(CHQ.categories);var n=e("#chart-container").width(),o=n,i=9*n/16,c=1.5,s=10,l=n/20,u=d3.scale.category20().domain(CHQ.categories);console.log("color",u.domain());var d=d3.scale.linear().domain([0,CHQ.maxValue]).range([0,l]),p=new Array(CHQ.categories.length),C=CHQ.data.map(function(t){var a=t.sector,e=d(t.porcentaje),t={cluster:a,radius:e,data:t};return(!p[a]||e>p[a].radius)&&(p[a]=t),t}),f=d3.layout.force().nodes(C).size([o,i]).gravity(0).charge(0).on("tick",t).start();CHQ.svg||(CHQ.svg=d3.select("#chart-container").append("svg"),CHQ.tooltip=d3.select("body").append("div").attr("id","circle-tooltip")),CHQ.svg.attr("width",o).attr("height",i);var H=CHQ.svg.selectAll("circle").data(C);H.enter().append("circle").on("click",function(t){e("#detalle").html("BASE: "+JSON.stringify(t.data)+" HISTORICO: "+JSON.stringify(CHQ.dataById[t.data.id]))}).on("mouseenter",function(t){CHQ.tooltip.html("<strong>"+t.data.empresa+"</strong> pagó el <strong>"+t.data.porcentaje+"%</strong> en el año <strong>"+t.data.anio+"</strong>").style("opacity",1),d3.select(this).attr("stroke",d3.rgb(u(t.data.sector)).darker().toString())}).on("mousemove",function(){CHQ.tooltip.style("top",d3.event.pageY-20+"px").style("left",d3.event.pageX+20+"px")}).on("mouseout",function(t){CHQ.tooltip.style("opacity",0),d3.select(this).attr("fill",function(){})}),H.attr("r",function(t){return t.radius}).style("fill",function(t){return u(t.cluster)}).call(f.drag),H.exit().remove()}}(window,document,jQuery,Tabletop);