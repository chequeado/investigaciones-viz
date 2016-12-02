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

    }
  },
  methods:{
    updateChart:function(){

      var self = this;  

      if(!self.avance_chart){

        setTimeout(function(){
           self.avance_chart = c3.generate({
              bindto:'#avance-chart',
              size: {
                height: 300
              },
              data: {
                  json: self.selected.chart_data,
                  keys: {
                      x: 'fecha',
                      value: ['cumplimiento', 'meta']
                  },
                  type: 'spline'
              },
              line: {
                  connectNull: true
              },
              axis: {
                  x: {
                      type: 'timeseries',
                      tick: {
                          format: function (x) {
                              return x.getFullYear()+ '-' +x.getMonth();
                          }
                      }
                  },
                  y: {
                    min:0
                  }
              }

          });
        },1000);

      } else {
        console.log('update!',self.selected.chart_data);
        self.avance_chart.load({
          json: self.selected.chart_data,
        });
      }

    },
  	dataLoaded:function(data){
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

        o.chart_data = [];
        if(o.fecha_inicio && o.plazo_de_obra_en_dias){
          o.fecha_inicio = moment(o.fecha_inicio, 'DD/MM/YYYY');
          o.fecha_fin = moment(o.fecha_inicio, 'DD/MM/YYYY').add(o.plazo_de_obra_en_dias,'days').format('YYYY-MM-DD');

          console.log(o.plazo_de_obra_en_dias);
          console.log(o.fecha_inicio);
          console.log(o.fecha_fin);

          o.chart_data.push({fecha:o.fecha_inicio.format('YYYY-MM-DD'),meta:0,cumplimiento:0})
          o.chart_data.push({fecha:o.fecha_fin,meta:100,cumplimiento:null})
        }

        if(o.p_2014_12){
          o.chart_data.push({fecha:'2014-12-01',meta:null,cumplimiento:o.p_2014_12})
        }

        if(o.p_2015_07){
          o.chart_data.push({fecha:'2015-07-01',meta:null,cumplimiento:o.p_2015_07})
        }

        if(o.p_2015_12){
          o.chart_data.push({fecha:'2015-12-01',meta:null,cumplimiento:o.p_2015_12})
        }

        if(o.p_2016_07){
          o.chart_data.push({fecha:'2016-07-01',meta:null,cumplimiento:o.p_2016_07})
        }

        if(o.p_2016_09){
          o.chart_data.push({fecha:'2016-09-01',meta:(o.fecha_fin>'2016-09-01')?100:null,cumplimiento:o.p_2016_09})
        }

        return o;
      }).sort(function(a,b){
  			return (a.nombre.trim().toLowerCase()>=b.nombre.trim().toLowerCase())?1:-1;
  		});
  		this.createMap();
  		console.log(data);
  	},
  	createMap: function(){
  		var self = this;
  		this.map = L.map('mapa').setView([-34.9314,  -57.9489], 11);
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
  	console.log('created component!');
  	this.loading = true;
  	this.markers = [];
    Tabletop.init( { key: '1PuXOuYNb0z6btfCx6ANYxHxTWjgQyPKUCVR7et2zs1o',
       callback: this.dataLoaded,
       simpleSheet: true,
       parseNumbers: true
   	});
  },
  ready: function(){
  	console.log('ready component!');
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
  	console.log('created app!');
  	this.pymChild = pym.Child({ polling: 500 });
  },
  ready: function(){
  	console.log('ready app!');
  }
});