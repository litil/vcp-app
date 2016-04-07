// public/app/components/extras/extrasController.js

/**
 * This controller handles the behavior of the "Extras" view.
 *
 */

(function() {

  'use strict';

  angular
    .module('vcpProject')
    .controller('ExtrasController', ExtrasController);


  // time provider to display song progress
  //TODO we must move that into a service ?? => at least make it generic
  angular.module("vcpProject").filter("time", function() {
      return function(a) {
          var b = "",
              c = 0,
              d = 0;
          return a && angular.isNumber(a) && (a /= 1e3, d = Math.floor(a / 60), c = Math.round(a - 60 * d)), d = 10 > d ? "0" + d : d, d > 0 && (b = d + "' "), c = 10 > c ? "0" + c : c, b += c + '"'
      }
  });

  /**
   * Constructor
   */
  function ExtrasController($auth, $state, $http, $rootScope, $scope, $interval, PlayerService, PlaylistService) {
      var vm = this;
      vm.playlists = {};

      this.getCurrentPlaylist = function() {
        vm.playlists.current = PlaylistService.getCurrentPlaylist();
      }

      this.getNormalPlaylists = function() {
        $scope.normalPlaylists = PlaylistService.getNormalPlaylists();
      };

      this.getSpecialPlaylists = function() {
        $scope.specialPlaylists = PlaylistService.getSpecialPlaylists();
      };

      this.getNormalPlaylists();
      this.getSpecialPlaylists();
      this.getCurrentPlaylist();

  }
})();
