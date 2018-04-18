"use strict";

/**
 * @ngdoc function
 * @name justiciaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the justiciaApp
 */
angular.module("justiciaApp").controller("MainCtrl", function($scope) {
  $scope.data = [
    {
      id: 1,
      title: "Video condena 1",
      text: "Condena 1 Lorem Ipsum",
      video: "condena.mp4"
    },
    {
      id: 2,
      title: "Video condena 2",
      text: "Condena 2 Lorem Ipsum",
      video: "condena.mp4"
    }
  ];

  $scope.selectedVideo = $scope.data[0];

  $scope.media = false;
  $scope.playing = false;

  $scope.playVideo = function() {
    var random = Math.floor(Math.random() * $scope.data.length);
    $scope.selectedVideo = $scope.data[random];
    $scope.media = document.querySelector("#video-" + $scope.selectedVideo.id);
    $scope.media.addEventListener("ended", $scope.stopVideo);
    $scope.media.play();
    $scope.playing = true;
  };

  $scope.stopVideo = function() {
    if ($scope.media) {
      $scope.media.pause();
      $scope.media.currentTime = 0;
      $scope.playing = false;
      $scope.$apply();
    }
  };
});
