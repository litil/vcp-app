// public/app/components/ticket/ticketController.js

(function() {

  'use strict';

  angular
    .module('vcpProject')
    .controller('TicketController', TicketController);

  // barcode directive (player bottom)
  angular.module("vcpProject").directive("barcode", function() {
    return {
      templateUrl: "app/components/ticket/barcodeDirective.html"
    }
  });

  // play directive (over the ticket cover)
  angular.module("vcpProject").directive("ticketplay", function() {
    return {
      templateUrl: "app/components/ticket/ticketPlayDirective.html"
    }
  });

  // pause directive (over the ticket cover)
  angular.module("vcpProject").directive("ticketpause", function() {
    return {
      templateUrl: "app/components/ticket/ticketPauseDirective.html"
    }
  });

  // time provider to display song progress
  angular.module("vcpProject").filter("time", function() {
      return function(a) {
          var b = "",
              c = 0,
              d = 0;
          return a && angular.isNumber(a) && (a /= 1e3, d = Math.floor(a / 60), c = Math.round(a - 60 * d)), d = 10 > d ? "0" + d : d, d > 0 && (b = d + "' "), c = 10 > c ? "0" + c : c, b += c + '"'
      }
  });

  // time provider to display playlists bounds
  angular.module("vcpProject").filter("playlistBounds", function() {
      return function(hours) {
        //it is pm if hours from 12 onwards
        var suffix = (hours >= 12) ? 'PM' : 'AM';

        //only -12 from hours if it is greater than 12 (if not back at midnight)
        hours = (hours > 12) ? hours -12 : hours;

        //if 00 then it is 12 am
        hours = (hours == '00') ? 12 : hours;

        return hours + ':00 ' + suffix;
      }
  });

  /**
   * Constructor
   */
  function TicketController($auth, $state, $http, $rootScope, $interval, PlayerService, PlaylistService) {
      var vm = this;

    var isPlaying = false;  // when we arrive on the application, the player is not playing
    var isMuted = false;

    // set default value into vm.song
    vm.song = {
      'id' : 0,
      'artist' : 'The Artist',
      'title' : 'The Title',
      'duration' : 4*60*1000
    }


    /**
     * This method is called when we receive the response from the server.
     * The response starts with "parseMusic(...)" so it calls this method
     * which only put the song information into a "song" object.
     */
    window.parseMusic = function(data) {
        vm.song = PlayerService.parseMusic(data);
    };

    // first we get the current and next playlist
    vm.playlists = {};
    vm.playlists.current = PlaylistService.getCurrentPlaylist();
    vm.playlists.next = PlaylistService.getNextPlaylist(vm.playlists.current);

    // initializing the Player
    // meaning it gets the current song data
    // and set a cron task which does it every 5s
    PlayerService.init();


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

    /**
     * This method gets the current date from the beginning of the current song.
     * It gets it from the PlayerService.
     *
     * @return the time since the beginning of the current song, in milliseconds.
     */
    this.getCurrentPosition = function() {
      return PlayerService.getCurrentPosition();
    };


    // TO BE REFACTORED

    this.tryPlaying = function() {
        return isPlaying;
    };
    this.isPlaying = function() {
        return PlayerService.isPlaying();
    };
    this.isMuted = function() {
      return isMuted;
    }

    /**
     * If the player is not playing, start it.
     *
     * Then if it's playing and muted, unmute it. If it is,
     * playing and unmuted, mute it.
     */
    this.togglePlay = function() {
      if (this.isPlaying() === false){
        // play the radio
        isPlaying = true;
        PlayerService.play();
      }

      if (this.isPlaying() && isMuted){
        // unmute the radio
        isMuted = false;
        PlayerService.mute();
      } else if (this.isPlaying() && !isMuted){
        // mute the radio
        isMuted = true;
        PlayerService.mute();
      }
    };

  }
})();
