var InundacionesLp = Vue.extend({
  data: function(){
  	return	{
  		obras: [],
  		selected: undefined,
  		loading: false
  	}
  },
  computed:{

  },
  methods:{
  	dataLoaded:function(data){
  		this.loading = false;
  		this.obras = data.sort(function(a,b){
  			return (a.nombre.trim().toLowerCase()>=b.nombre.trim().toLowerCase())?1:-1;
  		});
  		this.createMap();
  		console.log(data);
  	},
  	createMap: function(){
  		var self = this;
  		this.map = L.map('mapa').setView([-34.9314,  -57.9489], 11);
		L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(this.map);

		var customCircleMarker = L.CircleMarker.extend({
		   options: { 
		      obraID: ''
		   }
		});

		this.obras.forEach(function(e){
			if(e.lat && e.lng){
				self.markers.push(new customCircleMarker([e.lat, e.lng],{
						obraID:e.id
					})
					.bindPopup(e.nombre)
					.on('click', function(e) {
					    console.log(e);
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