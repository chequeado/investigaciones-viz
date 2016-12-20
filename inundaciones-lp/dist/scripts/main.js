"use strict";function onYouTubeIframeAPIReady(){player=new YT.Player("player",{videoId:"EItgWZf2qIY",playerVars:{disablekb:1,modestbranding:1,rel:0,showinfo:0},events:{onReady:onPlayerReady}})}function onPlayerReady(e){e.target.playVideo()}function loadVideoByID(e){player.loadVideoById(e)}var tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);var player,InundacionesLp=Vue.extend({data:function(){return{selected:"",loading:!1,via:!1}},computed:{},watch:{selected:function(e){var a=this;"map"==this.via?this.via=!1:_.forEach(this.markers,function(t){t.options.id==e.id?(t.openPopup(),a.map.panTo(t._latlng)):t.closePopup()}),this.updateChart(),this.updateCarousel(),this.updateVideo(),this.updateBlocks()}},methods:{updateBlocks:function(){setTimeout(function(){$(".grupo3").matchHeight()},500)},updateVideo:function(){loadVideoByID(this.selected.video)},updateCarousel:function(){setTimeout(function(){$(".carousel-inner .item").removeClass("active").first().addClass("active"),$(".carousel-indicators li").removeClass("active").first().addClass("active")},1e3)},updateChart:function(){var e=this;setTimeout(function(){e.avance_chart?e.avance_chart.load({json:e.selected.chart_data,keys:{x:"fecha",value:["cumplimiento","meta"]}}):e.avance_chart=c3.generate({bindto:"#avance-chart",size:{height:250},data:{json:e.selected.chart_data,keys:{x:"fecha",value:["cumplimiento","meta"]},type:"line",colors:{cumplimiento:"#B852DE",meta:"#5702A7"},names:{cumplimiento:"Cumplimiento",meta:"Meta"}},line:{connectNull:!0},padding:{left:50,right:30,top:20,bottom:10},axis:{x:{type:"timeseries",tick:{format:function(a){return e.months[a.getMonth()]+"-"+a.getFullYear()},count:3}},y:{min:0,max:100,tick:{format:function(e){return e+"%"},values:[0,50,100]}}}})},500)},dataLoaded:function(e){e=e.OBRAS.elements,console.log(e),this.loading=!1,this.obras=e.map(function(e){if(e.images=[],e.imagen_1&&e.images.push(e.imagen_1),e.imagen_2&&e.images.push(e.imagen_2),e.imagen_3&&e.images.push(e.imagen_3),e.chart_data=[],e.chart_data_grid=[],e.fecha_inicio&&e.plazo_de_obra_en_dias&&(e.fecha_inicio_moment=moment(e.fecha_inicio.trim(),"DD/MM/YYYY"),e.fecha_fin_moment=moment(e.fecha_inicio.trim(),"DD/MM/YYYY").add(e.plazo_de_obra_en_dias,"days"),e.chart_data.push({fecha:e.fecha_inicio_moment.format("YYYY-MM-DD"),meta:0,cumplimiento:0}),e.chart_data.push({fecha:e.fecha_fin_moment.format("YYYY-MM-DD"),meta:100,cumplimiento:null}),e.chart_data_grid.push({value:e.fecha_fin_moment.format("YYYY-MM-DD"),text:"Fecha límite",position:"middle"})),e.p_2014_12&&(!e.fecha_inicio_moment||e.fecha_inicio_moment.format("YYYY-MM-DD")<"2014-12-01")&&e.chart_data.push({fecha:"2014-12-01",meta:null,cumplimiento:e.p_2014_12}),e.p_2015_07&&(!e.fecha_inicio_moment||e.fecha_inicio_moment.format("YYYY-MM-DD")<"2015-07-01")&&e.chart_data.push({fecha:"2015-07-01",meta:null,cumplimiento:e.p_2015_07}),e.p_2015_12&&(!e.fecha_inicio_moment||e.fecha_inicio_moment.format("YYYY-MM-DD")<"2015-12-01")&&e.chart_data.push({fecha:"2015-12-01",meta:null,cumplimiento:e.p_2015_12}),e.p_2016_07&&e.chart_data.push({fecha:"2016-07-01",meta:null,cumplimiento:e.p_2016_07}),e.p_2016_09){var a=e.fecha_fin_moment&&e.fecha_fin_moment.format("YYYY-MM-DD")<"2016-09-01"?100:null;e.chart_data.push({fecha:"2016-09-01",meta:a,cumplimiento:e.p_2016_09})}return e}).sort(function(e,a){return e.nombre.trim().toLowerCase()>=a.nombre.trim().toLowerCase()?1:-1}),this.createMap(),console.log(e)},createMap:function(){var e=this;this.map=L.map("mapa").setView([-34.9314,-57.9489],11),this.map.scrollWheelZoom.disable(),L.tileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',subdomains:"abcd",maxZoom:19}).addTo(this.map);var a=L.CircleMarker.extend({options:{id:"pala"}});this.obras.forEach(function(t){t.lat&&t.lng&&(t.color="#B852DE",e.markers.push(new a([t.lat,t.lng],t).bindPopup(t.nombre).on("click",function(a,t){var i=$(a.srcElement||a.target);e.via="map",e.selected=i[0].options}).addTo(e.map)))})}},created:function(){console.log("created component!"),this.selected="",this.loading=!0,this.markers=[],this.months=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"],Tabletop.init({key:"1PuXOuYNb0z6btfCx6ANYxHxTWjgQyPKUCVR7et2zs1o",callback:this.dataLoaded,simpleSheet:!1,parseNumbers:!0})},ready:function(){console.log("ready component!")}});Vue.config.warnExpressionErrors=!0,Vue.config.debug=!0,new Vue({el:"#app",components:{"inundaciones-lp":InundacionesLp},created:function(){console.log("created app!"),this.pymChild=pym.Child({polling:500})},ready:function(){console.log("ready app!")}});