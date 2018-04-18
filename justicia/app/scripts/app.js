"use strict";

/**
 * @ngdoc overview
 * @name justiciaTucumanApp
 * @description
 * # justiciaTucumanApp
 *
 * Main module of the application.
 */
angular
  .module("justiciaApp", ["ngRoute", "ngSanitize", "ngTouch"])
  .config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl",
        controllerAs: "main"
      })
      .otherwise({
        redirectTo: "/"
      });
  })
  .run(function($rootScope, $window) {
    var pymChild = pym.Child({ polling: 500 });

    $rootScope.inIframe = function() {
      try {
        return $window.self !== $window.top;
      } catch (e) {
        return true;
      }
    };
  });
