var default_obra_id = 10;
var default_obra;

var player;
var api_flag = false,
    data_flag = false;

var streetview_key = 'AIzaSyCeSxDOvim56tGJFPPx4pVZOry12AnDc-I';

function embedYTApi(){
  var tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: default_obra.video,
    playerVars:{
      disablekb:1,
      modestbranding:1,
      rel:0,
      showinfo:0
    },
    events: {
      'onReady': onPlayerReady
    }
  });
};

function onPlayerReady(event) {
  //event.target.playVideo();
};

function loadVideoByID(id){
  player.loadVideoById(id);
};

var InundacionesLp = Vue.extend({
  data: function(){
  	return	{
      selected: '',
  		loading: false,
      via:false
  	}
  },
  computed:{
  },
  watch: {
    selected: function (selected) {
      var self = this;
      if(this.via=='map'){
        this.via = false;

      } else { //select
        
        _.forEach(this.markers,function(m){
          if(m.options.id==selected.id){
            m.openPopup();
            self.map.panTo(m._latlng);
          }else{
            m.closePopup();
          }
        });

      }
      this.updateChart();
      this.updateCarousel();
      this.updateBlocks();
      this.updateVideo();

    }
  },
  methods:{
    updateBlocks:function(){
      setTimeout(function(){
        //$('.grupo1').matchHeight();
        //$('.grupo2').matchHeight();
        $('.grupo3').matchHeight();
      },500);
    },
    updateVideo:function(){
      if(player){
        loadVideoByID(this.selected.video);
      }
    },
    updateCarousel:function(){

      var self = this;  

      setTimeout(function(){
        $('.carousel-inner .item').removeClass('active').first().addClass('active');
        $('.carousel-indicators li').removeClass('active').first().addClass('active');

      },1000);
    },
    updateChart:function(){

      var self = this;  

      setTimeout(function(){
          if(!self.avance_chart){
      
               self.avance_chart = c3.generate({
                  bindto:'#avance-chart',
                  size: {
                    height: 250
                  },
                  data: {
                      json: self.selected.chart_data,
                      keys: {
                          x: 'fecha',
                          value: ['cumplimiento', 'meta']
                      },
                      type: 'line',
                      colors: {
                        cumplimiento: '#B852DE',
                        meta: '#5702A7'
                      },
                      names: {
                        cumplimiento: 'Cumplimiento',
                        meta: 'Meta'
                      }
                  },
                  line: {
                      connectNull: true
                  },
                  /*grid: {
                    x: {
                      lines: self.selected.chart_data_grid
                    }
                  },*/
                  padding: {
                    left: 50,
                    right: 30,
                    top: 20,
                    bottom: 10,
                  },
                  axis: {
                      x: {
                          type: 'timeseries',
                          tick: {
                              format: function (x) {
                                  return self.months[x.getMonth()] + '-' + x.getFullYear();
                              },
                              count: 3
                          }
                      },
                      y: {
                        min:0,
                        max:100,
                        tick: {
                          format: function (y) {
                              return y+ '%';
                          },
                          values: [0, 50, 100]
                        }
                      }
                  }

              });

          } else {
            self.avance_chart.load({
                  json: self.selected.chart_data,
                  keys: {
                      x: 'fecha',
                      value: ['cumplimiento', 'meta']
                  }
              });
            /*if(self.selected.chart_data_grid.length>0){
              console.log(self.selected.chart_data_grid[0].value,self.selected.fecha_fin_moment.format('YYYY-MM-DD'));
              self.avance_chart.ygrids(self.selected.chart_data_grid);
            } else {
              console.log('elimino!');
              self.avance_chart.ygrids.remove();
            }*/

          }
      
      },500);

    },
  	dataLoaded:function(data){
      data = data.OBRAS.elements;
      data_flag = true;
  		this.loading = false;
  		this.obras = data.map(function(o){
        o.images = [];
        if(o.imagen_1){
          o.images.push(o.imagen_1);
        }
        if(o.imagen_2){
          o.images.push(o.imagen_2);
        }
        if(o.imagen_3){
          o.images.push(o.imagen_3);
        }

        if(o.images.length==0){
          var url = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+o.lat+','+o.lng+'&key='+streetview_key+'&heading=';
          o.images.push(url+'0');
          o.images.push(url+'90');
          o.images.push(url+'180');
          o.images.push(url+'270');
        }

        o.chart_data = [];
        o.chart_data_grid = [];
        if(o.fecha_inicio && o.plazo_de_obra_en_dias){
          o.fecha_inicio_moment = moment(o.fecha_inicio.trim(), 'DD/MM/YYYY');
          o.fecha_fin_moment = moment(o.fecha_inicio.trim(), 'DD/MM/YYYY').add(o.plazo_de_obra_en_dias,'days');
          
          o.chart_data.push({fecha:o.fecha_inicio_moment.format('YYYY-MM-DD'),meta:0,cumplimiento:0})
          o.chart_data.push({fecha:o.fecha_fin_moment.format('YYYY-MM-DD'),meta:100,cumplimiento:null})
        
          o.chart_data_grid.push({value: o.fecha_fin_moment.format('YYYY-MM-DD'), text: 'Fecha límite', position: 'middle'});
        }

        if(o.p_2014_12 && ( !o.fecha_inicio_moment || o.fecha_inicio_moment.format('YYYY-MM-DD')<'2014-12-01' ) ){
          o.chart_data.push({fecha:'2014-12-01',meta:null,cumplimiento:o.p_2014_12})
        }

        if(o.p_2015_07 && ( !o.fecha_inicio_moment || o.fecha_inicio_moment.format('YYYY-MM-DD')<'2015-07-01' ) ){
          o.chart_data.push({fecha:'2015-07-01',meta:null,cumplimiento:o.p_2015_07})
        }

        if(o.p_2015_12 && ( !o.fecha_inicio_moment || o.fecha_inicio_moment.format('YYYY-MM-DD')<'2015-12-01' ) ){
          o.chart_data.push({fecha:'2015-12-01',meta:null,cumplimiento:o.p_2015_12})
        }

        if(o.p_2016_07 && ( !o.fecha_inicio_moment || o.fecha_inicio_moment.format('YYYY-MM-DD')<'2016-07-01' ) ){
          o.chart_data.push({fecha:'2016-07-01',meta:null,cumplimiento:o.p_2016_07})
        }

        if(o.p_2016_09 && ( !o.fecha_inicio_moment || o.fecha_inicio_moment.format('YYYY-MM-DD')<'2016-09-01' ) ){
          o.chart_data.push({fecha:'2016-09-01',meta:null,cumplimiento:o.p_2016_09})
        }

        if(o.p_2016_11){
          var meta = (o.fecha_fin_moment && o.fecha_fin_moment.format('YYYY-MM-DD')<'2016-11-01')?100:null;
          o.chart_data.push({fecha:'2016-11-01',meta:meta,cumplimiento:o.p_2016_11})
        }

        return o;
      })/*.sort(function(a,b){
  			return (a.nombre.trim().toLowerCase()>=b.nombre.trim().toLowerCase())?1:-1;
  		})*/;
      default_obra = _.first(this.obras.filter(function(d){
        return d.id == default_obra_id;
      }));
      this.selected = default_obra;
  		this.createMap();
      embedYTApi();
  	},
  	createMap: function(){
  		var self = this;
  		this.map = L.map('mapa').setView([-34.9314,  -57.9489], 15);
      this.map.scrollWheelZoom.disable();
  		L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  			subdomains: 'abcd',
  			maxZoom: 19
  		}).addTo(this.map);

  		var customCircleMarker = L.CircleMarker.extend({
        options: { 
          id: 'pala'
        }
  		});

  		this.obras.forEach(function(e){
  			if(e.lat && e.lng){
          e.color = '#B852DE';
  				self.markers.push(new customCircleMarker([e.lat, e.lng],e)
  					.bindPopup(e.nombre)
  					.on('click', function(e,a) {
              var el = $(e.srcElement || e.target);
              self.via = 'map';
              self.selected = el[0].options;
  					})
  					.addTo(self.map));
  			}
  		});
  	}
  },
  created: function(){
    this.selected = '';
  	this.loading = true;
  	this.markers = [];

    this.months = [
      'ENE','FEB','MAR',
      'ABR','MAY','JUN',
      'JUL','AGO','SEP',
      'OCT','NOV','DIC'
     ];

    Tabletop.init( { key: '1PuXOuYNb0z6btfCx6ANYxHxTWjgQyPKUCVR7et2zs1o',
       callback: this.dataLoaded,
       simpleSheet: false,
       parseNumbers: true
   	});
  },
  ready: function(){

  }
});

Vue.config.warnExpressionErrors = true;
Vue.config.debug = true;

new Vue({
  el: '#app',
  components: {
    'inundaciones-lp': InundacionesLp
  },
  created: function(){

  	this.pymChild = pym.Child({ polling: 500 });
  },
  ready: function(){

  }
});