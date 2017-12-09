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
  function HeaderController($auth, $state, $http, $rootScope, $interval, $scope, $location, $window, $uibModal, Notification, PlayerService, PlaylistService) {
    var vm = this;
    $rootScope.location = $location;

    /**
     * This method return the playlist which is being listened. If no playlist
     * is being listened, returns the current playlist, according to the schedule.
     *
     * @return the "being listened" playlist
     */
    $scope.getListenedPlaylist = function() {
        var key = PlayerService.getPlayingPlaylistKey();

        if (!key) {
            return PlaylistService.getCurrentPlaylist();
        } else {
            return PlaylistService.getPlaylist(key);
        }
    }

    //TODO find a way to check the rootscope from the view
    $scope.isAuthenticated = $rootScope.authenticated;
    if($scope.isAuthenticated) {
      $scope.currentUser = $rootScope.currentUser;
    }

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

    $scope.confirmLogoutModal = function() {
        var confirmLogoutModal = $uibModal.open({
          animation: false,
          templateUrl: 'confirmLogout.html',
          controller: 'ConfirmLogoutController',
          size: 'lg',
          resolve: {
            items: function () {
              return [];
            }
          }
        });

        // handle yes/no answer
        confirmLogoutModal.result.then(function (selectedItem) {
            // do nothing ?
        }, function () { });
    }

    $scope.openMustAuthenticateModal = function() {
        var mustAuthenticateModal = $uibModal.open({
          animation: false,
          templateUrl: 'mustAuthenticateModal.html',
          controller: 'BackToLiveModalController',
          size: 'lg',
          resolve: {
            items: function () {
              return [];
            }
          }
        });

        // handle yes/no answer
        mustAuthenticateModal.result.then(function (selectedItem) {
          // the user will be redirected to the login page
          $window.location.href = '/#/signin';
        }, function () { });
    }


    if ($rootScope.authenticated == undefined){
        $interval(function(mustAuthenticateModal) {
            if ($rootScope.firstPlayDate != undefined){
                var dateNow = new Date();
                var deltaInSeconds = Math.abs((dateNow.getTime() - $rootScope.firstPlayDate.getTime()) / 1000);

                // if more than x minutes, stop the stream and display a popup
                if (deltaInSeconds > 15*60 && !$rootScope.mustAuthenticateModalDisplayed && !$rootScope.authenticated){
                    PlayerService.togglePlay();
                    $rootScope.mustAuthenticateModalDisplayed = true;
                    $scope.openMustAuthenticateModal();
                }
            }
        }, 5000);
    }

  }

})();
