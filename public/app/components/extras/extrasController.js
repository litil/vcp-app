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
      vm.playlists.playing = {};{};
      vm.playlists.current = {};
      // set default value into vm.song
      vm.song = {
        'id' : 0,
        'artist' : 'The Artist',
        'title' : 'The Title',
        'duration' : 4*60*1000
      }

      /**
       * This method gets the current playlist, that means the playlist that
       * is played when the user follows the live flux.
       */
      this.getCurrentPlaylist = function() {
        vm.playlists.current = PlaylistService.getCurrentPlaylist();
      }

      /**
       * This method gets the playlist that is actually playing. It could be
       * the same as the current (live) playlist if the user follows the live
       * flux but it could be different he has chosen to listen to another one.
       *
       * @return the playing playlist
       */
      this.getPlayingPlaylist = function() {
        var playingPlaylist = PlaylistService.getPlaylist(PlayerService.getPlayingPlaylistKey());
        if (playingPlaylist == null) {
          playingPlaylist = PlaylistService.getCurrentPlaylist();
        }

        return playingPlaylist;
      };

      /**
       * This method gets the list of "normal" playlists. It also set the
       * correct css class to the playing playlist.
       */
      this.getNormalPlaylists = function() {
        var playingPlaylist = this.getPlayingPlaylist();
        $scope.normalPlaylists = PlaylistService.getNormalPlaylists();

        var playlistTemp = null;
        for(var nPlaylistKey in $scope.normalPlaylists){
          playlistTemp = $scope.normalPlaylists[nPlaylistKey];
          if (playingPlaylist.key === playlistTemp.key) {
            playlistTemp.cls = playingPlaylist.cls;
          }
        }
      };

      /**
       * This method gets the list of "special" playlists. It also set the
       * correct css class to the playing playlist.
       */
      this.getSpecialPlaylists = function() {
        var playingPlaylist = this.getPlayingPlaylist();
        $scope.specialPlaylists = PlaylistService.getSpecialPlaylists();

        var playlistTemp = null;
        for(var nPlaylistKey in $scope.specialPlaylists){
          playlistTemp = $scope.specialPlaylists[nPlaylistKey];
          if (playingPlaylist.key === playlistTemp.key) {
            playlistTemp.cls = playingPlaylist.cls;
          }
        }
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
      vm.playlists.playing = this.getPlayingPlaylist();

      // call the radio to get current song information
      $scope.song = PlayerService.getCurrentSong(32);
      $scope.playlists = {};
      $scope.playlists.playing = this.getPlayingPlaylist();
      this.getSongInfosInterval = $interval(function() {
          var playingPlaylist = PlaylistService.getPlaylist(PlayerService.getPlayingPlaylistKey());
          if (playingPlaylist == null) {
            playingPlaylist = PlaylistService.getCurrentPlaylist();
          }

          $scope.song = PlayerService.getCurrentSong(32);
          $scope.playlists.playing = playingPlaylist;
      }, 5000);

      /**
       * This method stops the radio and starts it again with the playlist
       * corresponding to the given key.
       *
       * @param playlistKey
       */
      this.switchPlaylist = function(playlistKey) {
        PlayerService.switchPlaylist(playlistKey, PlaylistService.getPlaylist(playlistKey).infoKey);
        vm.playlists.playing = this.getPlayingPlaylist();
        this.getNormalPlaylists();
        this.getSpecialPlaylists();
      };
  }
})();
