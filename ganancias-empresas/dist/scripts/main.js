"use strict";var CHQ;d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},function(e,t,a,r,n){CHQ={},CHQ.pymChild=pym.Child({polling:500}),CHQ.$details=a("#details"),CHQ.$tips=a("#tips"),CHQ.$body=a("body"),CHQ.$colChart=a("#col-chart-container"),CHQ.circles,CHQ.year="promedio",CHQ.group="center",CHQ.init=function(){var e=CHQ.$body.width();CHQ.$body.css("min-height",9*e/16),r.init({key:"1lZH4R70Ln3vqZFnDvySuA681kKJJWc49GEoFJwpKLDc",callback:CHQ.dataLoaded,simpleSheet:!1,parseNumbers:!0})},CHQ.postProcess=function(e,t){return e.max=0,e.id=t,a.each(e,function(t,a){0==t.indexOf("porcentaje_")&&(e[t]=parseFloat(e[t].replace(",",".")),e[t]>e.max&&(e.max=e[t]))}),e},CHQ.dataLoaded=function(e,t){CHQ.rawData=e.detalle.elements.map(CHQ.postProcess),CHQ.groups=d3.nest().key(function(e){return e.sector.trim()}).map(CHQ.rawData),CHQ.categories=d3.keys(CHQ.groups),CHQ.dataById=d3.nest().key(function(e){return e.id}).rollup(function(e){return e[0]}).map(CHQ.rawData),CHQ.maxValue=d3.max(CHQ.rawData,function(e){return e.max}),CHQ.$body.removeClass("loading"),CHQ.render(),CHQ.renderSelect(),setTimeout(CHQ.startEvents,2e3)},CHQ.filterData=function(){var e=CHQ.rawData.map(function(e){return isNaN(e["porcentaje_"+CHQ.year])&&(e.noPresentaron=!0,e["porcentaje_"+CHQ.year]=0),e});CHQ.data=e.map(function(e){return{id:e.id,empresa:e.empresa,sector:e.sector,noPresentaron:e.noPresentaron,anio:CHQ.year,porcentaje:e["porcentaje_"+CHQ.year]}})},CHQ.startEvents=function(){a(window).resize(function(){clearTimeout(CHQ.timeoutId),CHQ.timeoutId=setTimeout(CHQ.render,500)}),a(".btn-year").on("click",function(){a(".btn-year").removeClass("btn-selected"),a(this).addClass("btn-selected"),CHQ.year=a(this).data("value"),CHQ.render()}),a(".btn-order").on("click",function(){a(".btn-order").removeClass("btn-selected"),a(this).addClass("btn-selected"),CHQ.group=a(this).data("value"),CHQ.render()}),a("#close-details").on("click",CHQ.closeDetails)},CHQ.render=function(){function e(e){CHQ.circles.each(t(10*e.alpha*e.alpha)).each(r(.5)).attr("cx",function(e){return e.x}).attr("cy",function(e){return e.y})}function t(e){return function(t){var a=Q[t.cluster],r=1;if(a){a===t&&(g?(a=g[t.cluster],a={x:a.x,y:a.y,radius:-a.radius},r=.5*Math.sqrt(t.radius)):(a={x:s/2,y:i/2,radius:-t.radius},r=.1*Math.sqrt(t.radius)));var n=t.x-a.x,o=t.y-a.y,c=Math.sqrt(n*n+o*o),l=t.radius+a.radius;c!=l&&(c=(c-l)/c*e*r,t.x-=n*=c,t.y-=o*=c,a.x+=n,a.y+=o)}}}function r(e){var t=d3.geom.quadtree(m);return function(a){var r=a.radius+u+Math.max(l,d),n=a.x-r,o=a.x+r,c=a.y-r,s=a.y+r;t.visit(function(t,r,i,u,C){if(t.point&&t.point!==a){var p=a.x-t.point.x,H=a.y-t.point.y,Q=Math.sqrt(p*p+H*H),m=a.radius+t.point.radius+(a.cluster===t.point.cluster?l:d);Q<m&&(Q=(Q-m)/Q*e,a.x-=p*=Q,a.y-=H*=Q,t.point.x+=p,t.point.y+=H)}return r>o||u<n||i>s||C<c})}}CHQ.filterData();var o=a("#chart-container").width();CHQ.smallDevice=o<990;var c=CHQ.smallDevice||CHQ.selectedId?o:9*o/16,s=o,i=c,l=2,d=2,u=o/25,C=o/100,p=o/75,H=o/150;CHQ.color=d3.scale.category20().domain(CHQ.categories);var Q,m,y,h={max:Math.ceil(CHQ.maxValue),min:0,minSize:0,maxSize:0,classContainer:CHQ.smallDevice||CHQ.selectedId||"center"==!CHQ.group?"col-sm-12 col-xs-12":"col-md-6",classRef:CHQ.smallDevice||CHQ.selectedId||"center"==!CHQ.group?"col-sm-4 col-xs-12":"col-md-4"};switch(CHQ.group){case"center":y=d3.scale.linear().domain([0,CHQ.maxValue]).range([C,u]),h.minSize=C<5?20:2*C,h.maxSize=2*u,Q=new Array(CHQ.categories.length),m=CHQ.data.map(function(e){var t=e.sector,a=y(e.porcentaje),e={cluster:t,radius:a,data:e};return(!Q[t]||a>Q[t].radius)&&(Q[t]=e),e}),CHQ.textGroup&&CHQ.textGroup.selectAll("text").style("opacity",0);break;case"sector":y=d3.scale.linear().domain([0,CHQ.maxValue]).range([H,p]),h.minSize=H<5?20:2*H,h.maxSize=2*p,Q=new Array(CHQ.categories.length);var g=new Array(CHQ.categories.length),v=[],f=Math.floor(s/11),x=Math.floor(i/4),b=d3.range(0,s,f),k=d3.range(0,i,x),S=0,w=1;m=CHQ.data.map(function(e){var t=e.sector,a=y(e.porcentaje),e={cluster:t,radius:a,data:e};return g[t]||(b[S+2]?S+=1:(S=1,w+=1),g[t]={x:b[S],y:k[w],radius:3,title:t,anchor:"middle"},v.push(g[t])),(!Q[t]||a>Q[t].radius)&&(Q[t]=e),e}),CHQ.smallDevice?CHQ.textGroup.selectAll("text").style("opacity",0):(d3plus.textBox().select("g#text-chart-group").data(v).width(f).text(function(e){return e.title}).textAnchor(function(e){return e.anchor}).x(function(e){return e.x-f/2}).y(function(e){if("Banco"==e.title)return e.y+6*p;var t=CHQ.groups[e.title].length,a=t<5?1.5*p:t/6*p*1.5;return e.y+a}).fontSize(12)(),CHQ.textGroup.selectAll("text").style("opacity",1)),CHQ.renderSelect()}var D=a("#tpl-legend").html();n.parse(D),h.midSize=(h.minSize+h.maxSize)/2,h.midPadding=(h.maxSize-h.midSize)/2,h.minPadding=(h.maxSize-h.minSize)/2,h.txtPadding=(h.maxSize-20)/2;var j=n.render(D,h);a("#legend-container").html(j);var z=d3.layout.force().nodes(m).size([s,i]).gravity(0).charge(.8).on("tick",e).start();CHQ.svg||(CHQ.svg=d3.select("#chart-container").append("svg").attr("id","main-chart-svg"),CHQ.circlesGroup=CHQ.svg.append("g").attr("id","circles-chart-group"),CHQ.textGroup=CHQ.svg.append("g").attr("id","text-chart-group"),CHQ.tooltip=d3.select("body").append("div").attr("id","circle-tooltip"),CHQ.selector=CHQ.svg.append("circle").attr("id","selector").style("stroke-width",3).style("opacity",0).attr("fill","none")),CHQ.svg.attr("width",s).attr("height",i),CHQ.circles=CHQ.circlesGroup.selectAll("circle.company").data(m),CHQ.circles.enter().append("circle").classed("company",!0).on("click",function(e){CHQ.openDetails(CHQ.dataById[e.data.id]),d3.selectAll("circle").classed("selected",!1),d3.select(this).classed("selected",!0)}).on("mouseenter",function(e){var t=d3.select(this);CHQ.selector.attr("stroke",d3.rgb(CHQ.color(e.data.sector)).darker().toString()).attr("r",Math.round(t.attr("r"))).attr("cx",t.attr("cx")).attr("cy",t.attr("cy")).style("opacity",1).transition().delay(200).style("opacity",0).attr("r",Math.round(t.attr("r"))+30);var a="<strong>"+e.data.empresa+"</strong> pagó el <strong>"+(e.data.porcentaje+"").replace(".",",")+"%</strong>";a+="promedio"==e.data.anio?" en promedio en <strong>2012 a 2015</strong>":" en el año <strong>"+e.data.anio+"</strong>",CHQ.tooltip.html(a).style("opacity",1),t.attr("stroke",d3.rgb(CHQ.color(e.data.sector)).darker().toString())}).on("mousemove",function(){CHQ.tooltip.style("top",d3.event.pageY-20+"px").style("left",d3.event.pageX+20+"px")}).on("mouseout",function(e){CHQ.tooltip.style("opacity",0)}),CHQ.circles.attr("id",function(e){return"e"+e.data.id}).attr("stroke",function(e){return e.data.noPresentaron?"black":CHQ.color(e.data.sector)}).classed("zero",function(e){return 0==e.data.porcentaje}).attr("r",function(e){return e.data.noPresentaron?y(0):e.radius}).style("fill",function(e){return e.data.noPresentaron?"black":0==e.data.porcentaje?"white":CHQ.color(e.cluster)}).call(z.drag),CHQ.circles.exit().remove(),CHQ.selector.moveToFront(),CHQ.selectedId&&(CHQ.openDetails(CHQ.dataById[CHQ.selectedId]),d3.selectAll("circle").classed("selected",!1),d3.select("#e"+CHQ.selectedId).classed("selected",!0))},CHQ.renderSelect=function(e){if(CHQ.selectedId){var t=CHQ.dataById[CHQ.selectedId];e=e?e:t.sector}var r=a("#tpl-select-industry").html();n.parse(r);var o={categories:CHQ.categories.map(function(t){var a=!!e&&t==e;return{val:t,txt:t,sel:a}}),empresasOption:!!e,empresas:!!e&&CHQ.groups[e].map(function(e){var t=e.id==CHQ.selectedId;return{val:e.id,txt:e.empresa,sel:t}})};o.categories.unshift({val:"",txt:"< Selecciones un sector >",sel:!e});var c=n.render(r,o);a("#select-block").html(c),a("#category").on("change",function(){var e=a(this).val();""!=e&&(CHQ.renderSelect(e),a("#empresa").change())}),a("#empresa").on("change",function(){var e=a(this).val();CHQ.openDetails(CHQ.dataById[e]),d3.selectAll("circle").classed("selected",!1),d3.select("circle#e"+e).classed("selected",!0)})},CHQ.openDetails=function(e){a("body").addClass("detailsOpened"),CHQ.selectedId=e.id,CHQ.$colChart.hasClass("col-md-12")&&(CHQ.$colChart.removeClass("col-md-12").addClass("col-md-6"),CHQ.render(),CHQ.$details.fadeIn(),CHQ.$tips.hide());var t=a("#tpl-details").html();n.parse(t),e.color=CHQ.color(e.sector),e.selectedYear=CHQ.year,e.isPromedio="promedio"==CHQ.year,e.selectedValue=(e["porcentaje_"+CHQ.year]+"").replace(".",",");var r=n.render(t,e);a("#details-block").html(r);var o={};a.each(e,function(e,t){e.indexOf("_")!==-1&&(e=e.split("_"),o[e[1]]=!0)}),o=d3.keys(o).sort();var c=[];a.each(o,function(t,r){var n={anio:r};a.each(e,function(e,t){e.indexOf("_")!==-1&&(e=e.split("_"),e[1]==r&&(n[e[0]]=t))}),c.push(n)});var s=c.filter(function(e){return"promedio"==e.anio})[0],i=[{value:s.porcentaje,text:s.porcentaje+"% promedio"}];c=c.filter(function(e){return"promedio"!=e.anio});var l={json:c,keys:{x:"anio",value:["porcentaje"]},type:"bar",colors:{porcentaje:e.color}};CHQ.pchart=c3.generate({bindto:"#per-chart",data:l,bar:{width:{ratio:.5}},size:{height:100},axis:{y:{label:"Porcentaje",min:0,show:!1,padding:{bottom:0,top:10}},x:{type:"category"}},grid:{y:{lines:i}},legend:{show:!1},tooltip:{format:{value:function(e,t,a,r){return(e+"%").replace(".",",")}}}});var d={json:c,keys:{x:"anio",value:["ganancias","ventas"]},type:"line",names:{ventas:"Ventas",ganancias:"Pago de ganancias"},colors:{ganancias:e.color,ventas:d3.rgb(e.color).darker()}};CHQ.chart?CHQ.chart.load(d):CHQ.chart=c3.generate({bindto:"#line-chart",data:d,axis:{y:{min:0,tick:{format:function(e){return d3.format("$,")(e).replace(/,/g,".")}},padding:{bottom:0}},x:{type:"category",tick:{outer:!1}}}}),CHQ.renderSelect()},CHQ.closeDetails=function(){a("body").removeClass("detailsOpened"),CHQ.selectedId=!1,CHQ.$colChart.removeClass("col-md-6").addClass("col-md-12"),CHQ.render(),CHQ.$details.hide(),CHQ.$tips.show(),d3.selectAll("circle").classed("selected",!1)}}(window,document,jQuery,Tabletop,Mustache);