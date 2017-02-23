'use strict';

/**
 * @ngdoc overview
 * @name agroquimicosApp
 * @description
 * # agroquimicosApp
 *
 * Main module of the application.
 */
angular
  .module('agroquimicosApp', [
    'ngRoute',
    'ngAnimate'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.hashPrefix('');
  })
  .service('TabletopService', function ($q) {

    this.data = false;

    this.getData = function(){
      var that = this;
      return $q(function(resolve, reject) {
        if(!that.data){
          Tabletop.init( { key: '1JEqsDFXcDOk5SEjUj8PEex_lmIHvQWVixhNo2p-r85w',
                  callback: function(data, tabletop) { 
                    that.data = data;
                    resolve(angular.copy(that.data));
                  },
                  parseNumbers: true
                });
        } else {
          resolve(angular.copy(that.data));
        }
      });
    }
  })
  .run(function(){
    var pymChild = pym.Child({ polling: 500 });
  });
