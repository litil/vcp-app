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

      // first we get the current playlist and set it as the selected one
      vm.playlists = {};
      vm.playlists.current = PlaylistService.getCurrentPlaylist();
      vm.playlists.selected = PlaylistService.getCurrentPlaylist();

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
        // @see VCP-54 if we decide to really swtich playlist,
        // we just have to replace selected with playing in the template
        // PlayerService.switchPlaylist(playlistKey, PlaylistService.getPlaylist(playlistKey).infoKey);
        vm.playlists.selected = PlaylistService.getPlaylist(playlistKey);
      };

      /**
       * This method returns true if the given playlist key corresponds to the
       * playlist being played.
       *
       * @param playlistKey
       */
      this.isPlayingPlayilist = function(days, start, end, slotKey) {
          var playingPlaylistKey = PlayerService.getPlayingPlaylistKey()
          var isPlaying = PlayerService.isPlaying()
          var currentPlaylistKey = PlaylistService.getCurrentPlaylist().key

          var playingPlaylistKey = playingPlaylistKey ?
            playingPlaylistKey :
            isPlaying ? currentPlaylistKey : null

         if (playingPlaylistKey == null) return false


         if (playingPlaylistKey == slotKey) {
             if (playingPlaylistKey == currentPlaylistKey) {
                 var slotCls = this.getSlotCls(days, start, end, slotKey)
                 if (slotCls !== '-current') return true
             } else {
                 return true
             }
         }

         return false
      };

  }
})();
