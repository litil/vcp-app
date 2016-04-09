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

    // this is the main URL for the radio and the
    vm.URL_BASE = "http://radio.vendredicestpermis.com";
    vm.URL_INFOS = vm.URL_BASE + "/jsonp.xsl";
    vm.INFOS_KEY = "/radio_VCP"
    vm.URL_RADIO = vm.URL_BASE + vm.INFOS_KEY;
    vm.POLLING_INTERVAL = 5000;  // we start with 10 seconds

    vm.playerError = false;
    vm.playerErrorText;
    vm.getSongInfosInterval;
    var isPlaying = false;  // when we arrive on the application, the player is not playing
    var isMuted = false;
    vm.hasBeenInitialized = false;

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
        var rawData = data[vm.INFOS_KEY];

        // get the artist and title from the 'title' field
        var artistTitle = rawData.title;
        if (rawData.title.indexOf('[Vendredi c\'est permis]') > -1){
          artistTitle = rawData.title.substring(0, rawData.title.indexOf('[Vendredi c\'est permis]'));
        }
        artistTitle = artistTitle.trim();
        var artistTitleArray = artistTitle.split(" - ");
        var artist = artistTitleArray[0];
        var title = artistTitleArray[1];

        // check title and artist length
        if (artist.length > 64){
          artist = artist.substring(0, 64) + ' ... ';
        }
        if (title.length > 64){
          title = title.substring(0, 64) + ' ... ';
        }

        // reset the duration counter if it is a new song
        //TODO Player - replace title with id once the id is correctly sent by server
        if (vm.song.title !== title){
          PlayerService.resetProgress();
        }

        // build  the song object
        vm.song = {
          'id' : rawData.id,
          'artist' : artist,
          'title' : title,
          'duration' : rawData.duration * 1000
        }

        // TODO if the player has not been initialized, do it and mute it
        if (vm.hasBeenInitialized === false){
          PlayerService.setCurrent(rawData);
          vm.hasBeenInitialized = true;
        }
    };

    /**
     * This method is an asynchronous task which runs every 10 seconds for now.
     * It asks the server for the current song information. See the parseMusic
     * method to understand what it does right after having received those info.
     */
    this.getSongInfosTask = function() {
      // don't start a new polling if we're already polling
      if ( angular.isDefined(vm.getSongInfosInterval)) return;

      vm.getSongInfosInterval = $interval(function() {
          $http.jsonp(vm.URL_INFOS);
      }, vm.POLLING_INTERVAL);
    };

    // first we get the current and next playlist
    vm.playlists = {};
    vm.playlists.current = PlaylistService.getCurrentPlaylist();
    vm.playlists.next = PlaylistService.getNextPlaylist(vm.playlists.current);

    // we ask a first time for the song info
    $http.jsonp(vm.URL_INFOS);

    // then launch the task polling
    this.getSongInfosTask();


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
