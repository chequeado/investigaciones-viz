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
      title: "video1",
      text: "Lorem ipsum 1",
      video: "video-test-small-1.mp4"
    },
    {
      id: 2,
      title: "video 2",
      text: "Lorem ipsum 2",
      video: "video-test-small-2.mp4"
    }
  ];

  $scope.selectedVideo = $scope.data[0];

  $scope.media = false;
  $scope.playing = false;

  $scope.playVideo = function() {
    $scope.selectedVideo =
      $scope.data[Math.floor(Math.random() * $scope.data.length)];

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
