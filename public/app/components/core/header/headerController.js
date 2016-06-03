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

    $scope.isActive = function (viewLocation) {
      if (viewLocation === $location.path()){
        return 'active';
      } else {
        return '';
      }
    };

    $scope.open = function (size) {
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
