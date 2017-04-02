// public/app/components/about/aboutController.js

/**
 * This controller handles the behavior of the "About" view.
 *
 */

(function() {

  'use strict';

  angular
    .module('vcpProject')
    .controller('AboutController', AboutController);


  /**
   * Constructor
   */
  function AboutController($state, $http, $rootScope, PlayerService, PlaylistService) {
      var vm = this;

      // first we get the current playlist
      vm.playlists = {};
      vm.playlists.current = PlaylistService.getCurrentPlaylist();

      // initializing the Player
      // meaning it gets the current song data
      // and set a cron task which does it every 5s
      PlayerService.init();

      /**
       * This method is called when we receive the response from the server.
       * The response starts with "parseMusic(...)" so it calls this method
       * which only put the song information into a "song" object.
       */
      window.parseMusic = function(data) {
          vm.song = PlayerService.parseMusic(data);
      };

      /**
       * This method checks the given days, start time and end time representing
       * a slot time with the current playlist to know it we're in this slot.
       * If we are, it returns the current playlist css class to be applied,
       * otherwise it returns ''.
       *
       * @param days an array of integer representing the slot's days
       * @param start the slot start time
       * @param end the the slot end time
       *
       * @return the css class to be applied or ''
       */
      this.getCurrentSlotCls = function(days, start, end) {
        // get the current day from the playlist
        var playlistDay = vm.playlists.current.day;
        var playlistStart = vm.playlists.current.displayStart;
        var playlistEnd = vm.playlists.current.displayEnd;
        var playlistCls = vm.playlists.current.cls;

        var activeSlotCls = '';

        angular.forEach(days, function(value) {
          if(playlistDay == value) {
            if (start === playlistStart && end === playlistEnd ) {
              activeSlotCls = playlistCls;
            }
          }
        });

        return activeSlotCls;
      };


      /**
       * This method checks if the current slot is the active one and/or if it
       * corresponds to the playing playlist
       *
       * @param days an array of integer representing the slot's days
       * @param start the slot start time
       * @param end the the slot end time
       *
       * @return the css class to be applied or ''
       */
      this.getSlotCls = function(days, start, end, slotKey) {
        if (vm.playlists.playing && vm.playlists.playing.key == slotKey){
            return vm.playlists.playing.cls;
        }

        // get the current day from the playlist
        var playlistDay = vm.playlists.current.day;
        var playlistStart = vm.playlists.current.displayStart;
        var playlistEnd = vm.playlists.current.displayEnd;
        var playlistCls = vm.playlists.current.cls;

        var activeSlotCls = '';

        angular.forEach(days, function(value) {
          if(playlistDay == value) {
            if (start === playlistStart && end === playlistEnd ) {
              activeSlotCls = playlistCls;
            }
          }
        });

        return activeSlotCls + '-current';
      };

      /**
       * This method stops the radio and starts it again with the playlist
       * corresponding to the given key.
       *
       * @param playlistKey
       */
      this.switchPlaylist = function(playlistKey) {
        PlayerService.switchPlaylist(playlistKey, PlaylistService.getPlaylist(playlistKey).infoKey);
        vm.playlists.playing = this.getPlayingPlaylist();
      };

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

  }
})();
