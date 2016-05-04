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
      // set default value into vm.song
      vm.song = {
        'id' : 0,
        'artist' : 'The Artist',
        'title' : 'The Title',
        'duration' : 4*60*1000
      }

      this.getCurrentPlaylist = function() {
        vm.playlists.current = PlaylistService.getCurrentPlaylist();
      }

      this.getNormalPlaylists = function() {
        $scope.normalPlaylists = PlaylistService.getNormalPlaylists();
      };

      this.getSpecialPlaylists = function() {
        $scope.specialPlaylists = PlaylistService.getSpecialPlaylists();
      };

      // TO BE REFACTORED
      this.isPlaying = function() {
          return PlayerService.isPlaying();
      };
      this.isMuted = function() {
        return PlayerService.isMuted();
      };
      /**
       * If the player is not playing, start it.
       *
       * Then if it's playing and muted, unmute it. If it is,
       * playing and unmuted, mute it.
       */
      this.togglePlay = function() {
        PlayerService.togglePlay();
      };

      /**
       * This method gets the current date from the beginning of the current song.
       * It gets it from the PlayerService.
       *
       * @return the time since the beginning of the current song, in milliseconds.
       */
      this.getCurrentPosition = function() {
        return PlayerService.getCurrentPosition();
      };

      /**
       * This method calculates the percentage of the current song that has already
       * been played, from the current position and the known song duration.
       *
       * @return the current percentage, between 0 and 100
       */
      this.getCurrentPercentage = function() {
        // vm.song.duration is already in ms
        //TODO understand why it goes from 2% to 97%
        var percentage = PlayerService.getCurrentPosition() * 95 / (vm.song.duration);
        percentage += 2;
        if (Math.ceil(percentage) > 97) {
          percentage = 97;
        }

        return percentage;
      };

      this.getNormalPlaylists();
      this.getSpecialPlaylists();
      this.getCurrentPlaylist();

      // call the radio to get current song information
      var currentSong = PlayerService.getCurrentSong();

      // check title and artist length
      // ellipsis them of > 48
      // refactor that so that the view ellipsis it
      if (currentSong.title > 48){
        currentSong.title = currentSong.title.substring(0, 48) + ' ... ';
      }
      if (currentSong.artist > 48){
        currentSong.artist = currentSong.artist.substring(0, 48) + ' ... ';
      }
      $scope.song = currentSong;

      this.getSongInfosInterval = $interval(function() {
          $scope.song = PlayerService.getCurrentSong();
      }, 5000);


      /**
       * This method stops the radio and starts it again with the playlist
       * corresponding to the given key.
       *
       * @param playlistKey
       */
      this.switchPlaylist = function(playlistKey) {
        // check we're not switching to the current playlist
        if (PlayerService.getPlayingPlaylist() !== null  && PlayerService.getPlayingPlaylist() === playlistKey){
          return;
        }

        // stop the actual playlist and remove the time
        PlayerService.stopAndClean();

        // start the playlist corresponding to the key
        PlayerService.switchPlaylist(PlaylistService.getPlaylist(playlistKey).infoKey);
      };
  }
})();
