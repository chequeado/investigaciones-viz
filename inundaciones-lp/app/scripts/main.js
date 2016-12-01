var InundacionesLp = Vue.extend({
  data: function(){
  	return	{
  		obras: [],
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

      //AVANCE
      var data1 = {
                columns: [
                    ['data1', 70],
                    ['data2', 30],
                ],
                type: 'bar',
                groups: [
                    ['data1','data2']
                ]
            };

      if(!self.avance_chart){

        setTimeout(function(){
           self.avance_chart = c3.generate({
              bindto:'#avance-chart',
              size: {
                height: 100
              },
              data: {
                  json: [{
                      date: '2014-01-01',
                      upload: 200,
                      download: 200,
                      total: 400
                  }, {
                      date: '2014-01-02',
                      upload: 100,
                      download: 300,
                      total: 400
                  }, {
                      date: '2014-01-03',
                      upload: 300,
                      download: 200,
                      total: 500
                  }, {
                      date: '2014-01-04',
                      upload: 400,
                      download: 100,
                      total: 500
                  }],
                  keys: {
                      x: 'date',
                      value: ['upload', 'download']
                  }
              },
              axis: {
                  x: {
                      type: 'timeseries',
                      tick: {
                          format: function (x) {
                              return x.getFullYear();
                          }
                      }
                  }
              }

          });
        },1000);

      } else {
        console.log('update!',data1);
        //self.avance_chart.load(data1);
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