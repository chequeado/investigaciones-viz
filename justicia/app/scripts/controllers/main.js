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
      title: "¡Sos un ciudadano con suerte!",
      text:
        "Tu denuncia por corrupción es la única de las 219 relevadas que concluyó con una condena firme. En 2016, la Corte Suprema de Justicia de Tucumán confirmó el fallo condenatorio contra el comisario Enrique Antonio García y el policía Manuel Ezequiel Yapura por encubrimiento agravado, y el agente Roberto Oscar Lencina por adulterar un acta en la causa por el asesinato de Paulina Lebbos, una joven tucumana de 23 años.",
      video: "01.mp4",
      color: "#D50001"
    },
    {
      id: 2,
      title: "¡Lo sentimos!",
      text:
        "Tu denuncia es una de las 195 causas por corrupción atrapadas en el laberinto judicial con escasos avances. Conocé más en la nota.",
      video: "02.mp4",
      color: "#A71D06"
    },
    {
      id: 3,
      title: "Bonus Alperovich",
      text:
        "Tu denuncia es una de las 29 que involucran a José Alperovich, exgobernador (2003 - 2015) y senador nacional del Partido Justicialista.  Una lástima: aunque es, por lejos, el funcionario tucumano más denunciado desde 2005, ninguno de los procesos abiertos en su contra prosperó. Por lo que se sabe, Alperovich ni siquiera llegó a prestar una declaración indagatoria ante la Justicia.",
      video: "03.mp4",
      color: "#3ABDC1"
    },
    {
      id: 4,
      title: "¡Ups!",
      text:
        "Tu denuncia cayó en saco roto: es una de las 12 causas archivadas. Ojalá que la próxima vez tengas más suerte, pero no te entusiasmes demasiado. Lamentablemente sólo 1 de las 219 denuncias por corrupción presentadas en los últimos 13 años en Tucumán terminó en una condena firme.",
      video: "04.mp4",
      color: "#CDDB29"
    },
    {
      id: 5,
      title: "Hay esperanza",
      text:
        "Sos un ciudadano bastante afortunado. Tu denuncia avanzó y hoy tiene dos condenas. Sin embargo, el fallo está en revisión. Hasta ahora sólo una de las 219 denuncias por corrupción presentadas entre 2005 y 2017 culminó en una condena firme. ¿Tendrás la suerte de conseguir justicia?",
      video: "05.mp4",
      color: "#00769E"
    }
  ];

  $scope.available = angular.copy($scope.data);

  $scope.selectedVideo = $scope.available[0];

  $scope.media = false;
  $scope.playing = false;
  $scope.ended = false;
  $scope.first = true;

  $scope.playVideo = function() {
    $scope.first = false;
    $scope.stopVideo();
    if ($scope.available.length == 0) {
      $scope.available = angular.copy($scope.data);
    }
    var random = Math.floor(Math.random() * $scope.available.length);
    $scope.selectedVideo = $scope.available[random];
    $scope.available.splice(random, 1);
    $scope.media = document.querySelector("#video-" + $scope.selectedVideo.id);
    $scope.media.addEventListener("ended", $scope.endedVideo);
    $scope.media.play();
    $scope.ended = false;
    $scope.playing = true;
  };

  $scope.endedVideo = function() {
    if ($scope.media) {
      $scope.media.pause();
      $scope.ended = true;
      $scope.playing = false;
      $scope.$apply();
    }
  };

  $scope.stopVideo = function() {
    if ($scope.media) {
      $scope.media.pause();
      $scope.media.currentTime = 0;
      $scope.playing = false;
    }
  };
});
