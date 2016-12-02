"use strict";var InundacionesLp=Vue.extend({data:function(){return{selected:"",loading:!1,via:!1}},computed:{},watch:{selected:function(a){var e=this;"map"==this.via?this.via=!1:_.forEach(this.markers,function(t){t.options.id==a.id?(t.openPopup(),e.map.panTo(t._latlng)):t.closePopup()}),this.updateChart(),this.updateCarousel()}},methods:{updateCarousel:function(){setTimeout(function(){$(".carousel-inner .item").removeClass("active").first().addClass("active"),$(".carousel-indicators li").removeClass("active").first().addClass("active")},1e3)},updateChart:function(){var a=this;setTimeout(function(){a.avance_chart?a.avance_chart.load({json:a.selected.chart_data,keys:{x:"fecha",value:["cumplimiento","meta"]}}):a.avance_chart=c3.generate({bindto:"#avance-chart",size:{height:300},data:{json:a.selected.chart_data,keys:{x:"fecha",value:["cumplimiento","meta"]},type:"line",colors:{cumplimiento:"#B852DE",meta:"#5702A7"},names:{cumplimiento:"Cumplimiento",meta:"Meta"}},line:{connectNull:!0},padding:{left:50,right:30,top:20,bottom:10},axis:{x:{type:"timeseries",tick:{format:function(e){return a.months[e.getMonth()]+"-"+e.getFullYear()},count:3},padding:{left:50,right:50}},y:{min:0,max:100,tick:{format:function(a){return a+"%"},values:[0,50,100]},padding:{top:10,bottom:0}}}})},500)},dataLoaded:function(a){this.loading=!1,this.obras=a.map(function(a){if(a.images=[],a.imagen_1&&a.images.push(a.imagen_1),a.imagen_2&&a.images.push(a.imagen_2),a.imagen_3&&a.images.push(a.imagen_3),a.chart_data=[],a.chart_data_grid=[],a.fecha_inicio&&a.plazo_de_obra_en_dias&&(a.fecha_inicio_moment=moment(a.fecha_inicio.trim(),"DD/MM/YYYY"),a.fecha_fin_moment=moment(a.fecha_inicio.trim(),"DD/MM/YYYY").add(a.plazo_de_obra_en_dias,"days"),a.chart_data.push({fecha:a.fecha_inicio_moment.format("YYYY-MM-DD"),meta:0,cumplimiento:0}),a.chart_data.push({fecha:a.fecha_fin_moment.format("YYYY-MM-DD"),meta:100,cumplimiento:null}),a.chart_data_grid.push({value:a.fecha_fin_moment.format("YYYY-MM-DD"),text:"Fecha límite",position:"middle"})),a.p_2014_12&&(!a.fecha_inicio_moment||a.fecha_inicio_moment.format("YYYY-MM-DD")<"2014-12-01")&&a.chart_data.push({fecha:"2014-12-01",meta:null,cumplimiento:a.p_2014_12}),a.p_2015_07&&(!a.fecha_inicio_moment||a.fecha_inicio_moment.format("YYYY-MM-DD")<"2015-07-01")&&a.chart_data.push({fecha:"2015-07-01",meta:null,cumplimiento:a.p_2015_07}),a.p_2015_12&&(!a.fecha_inicio_moment||a.fecha_inicio_moment.format("YYYY-MM-DD")<"2015-12-01")&&a.chart_data.push({fecha:"2015-12-01",meta:null,cumplimiento:a.p_2015_12}),a.p_2016_07&&a.chart_data.push({fecha:"2016-07-01",meta:null,cumplimiento:a.p_2016_07}),a.p_2016_09){var e=a.fecha_fin_moment&&a.fecha_fin_moment.format("YYYY-MM-DD")<"2016-09-01"?100:null;a.chart_data.push({fecha:"2016-09-01",meta:e,cumplimiento:a.p_2016_09})}return a}).sort(function(a,e){return a.nombre.trim().toLowerCase()>=e.nombre.trim().toLowerCase()?1:-1}),this.createMap(),console.log(a)},createMap:function(){var a=this;this.map=L.map("mapa").setView([-34.9314,-57.9489],11),this.map.scrollWheelZoom.disable(),L.tileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:"abcd",maxZoom:19}).addTo(this.map);var e=L.CircleMarker.extend({options:{id:"pala"}});this.obras.forEach(function(t){t.lat&&t.lng&&(t.color="#B852DE",a.markers.push(new e([t.lat,t.lng],t).bindPopup(t.nombre).on("click",function(e,t){var i=$(e.srcElement||e.target);a.via="map",a.selected=i[0].options}).addTo(a.map)))})}},created:function(){console.log("created component!"),this.selected="",this.loading=!0,this.markers=[],this.months=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"],Tabletop.init({key:"1PuXOuYNb0z6btfCx6ANYxHxTWjgQyPKUCVR7et2zs1o",callback:this.dataLoaded,simpleSheet:!0,parseNumbers:!0})},ready:function(){console.log("ready component!")}});Vue.config.warnExpressionErrors=!0,Vue.config.debug=!0,new Vue({el:"#app",components:{"inundaciones-lp":InundacionesLp},created:function(){console.log("created app!"),this.pymChild=pym.Child({polling:500})},ready:function(){console.log("ready app!")}});