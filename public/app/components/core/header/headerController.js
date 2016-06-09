// public/app/components/core/common/commonElementsController.js

(function() {

  'use strict';

  angular
    .module('vcpProject')
    .controller('HeaderController', HeaderController);

  // logo directive (top left corner)
  angular.module("vcpProject").directive("logo", function() {
    return {
      templateUrl: "app/components/core/header/awesomeLogoDirective.html"
    }
  });

  /**
   * Constructor
   */
  function HeaderController($auth, $state, $http, $rootScope, $scope, $location, $window, $uibModal, PlayerService, PlaylistService) {
    var vm = this;
    $rootScope.location = $location;

    $scope.isActive = function (viewLocation) {
      var locationPath = $location.path();
      if (viewLocation === locationPath){
        return 'active';
      } else if (viewLocation === '/auth' &&
          (locationPath === '/signin' || locationPath === '/signup' || locationPath === '/welcome')) {
        return 'active';
      }

      return '';
    };

    /**
     * This function displays a popup to notify the user he'll go back to the
     * live feed.
     */
    $scope.open = function (size) {
      // if we're already on the ticket view, do nothing
      if (this.location.path() === '/ticket') {
        return;
      }

      // if we're already playing the live feed, just redirect to the ticket view
      var playingPlaylistKey = PlayerService.getPlayingPlaylistKey();
      var currentPlaylistKey = PlaylistService.getCurrentPlaylist().key;
      if (playingPlaylistKey === null || currentPlaylistKey === playingPlaylistKey){
        $window.location.href = '/#/ticket';
        return;
      }

      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'myModalContent.html',
        controller: 'BackToLiveModalController',
        size: size,
        resolve: {
          items: function () {
            return [];
          }
        }
      });

      // handle yes/no answer
      modalInstance.result.then(function (selectedItem) {
        // the user wants to go back to the live playlist
        // switch the playlist
        var livePlaylist = PlaylistService.getCurrentPlaylist();
        PlayerService.switchPlaylist(livePlaylist.key, livePlaylist.infoKey);

        // display the home
        $window.location.href = '/#/ticket';
      }, function () {
        // the user wants to stay in manual mode, do nothing
      });
    };
  }

})();
