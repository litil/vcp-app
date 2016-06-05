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
  function AboutController($auth, $state, $http, $rootScope, PlaylistService) {
      var vm = this;

      // first we get the current playlist
      vm.playlists = {};
      vm.playlists.current = PlaylistService.getCurrentPlaylist();


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
          debugger;
          if(playlistDay == value) {
            debugger;
            if (start === playlistStart && end === playlistEnd ) {
              // TODO prolem when day + 1 (maybe do 24 + 2h for example ?)
              activeSlotCls = playlistCls;
            }
          }
        });

        return activeSlotCls;
      };
  }
})();
