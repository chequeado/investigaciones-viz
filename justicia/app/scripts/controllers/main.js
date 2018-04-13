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
      title: "video1",
      text: "Lorem ipsum 1",
      video: "1I6NZVy5O-ZOIg2jpwe88yiY7nx82Butb"
    },
    {
      title: "video 2",
      text: "Lorem ipsum 2",
      video: "13yn44wh8Dv_30fUtqzukq57pzoM9lppK"
    }
  ];

  $scope.selectedVideo = $scope.data[0];

  $scope.baseDriveUrl = "https://drive.google.com/uc?export=download&id=";

  $scope.media = false;
  $scope.playing = false;

  $scope.playVideo = function() {
    $scope.selectedVideo =
      $scope.data[Math.floor(Math.random() * $scope.data.length)];

    $scope.media = document.querySelector(
      "#video-" + $scope.selectedVideo.video
    );
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
