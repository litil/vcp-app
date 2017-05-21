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

  // clock filter to be used in the ticket view
  angular.module("vcpProject").filter("clockFilter", function() {
      return function(datetime) {
        if (datetime.getDate === undefined) {
          return datetime;
        }

        var month = datetime.getMonth();      // 0 - 11
        var day = datetime.getDate();         // 1 - 31
        var hours = datetime.getHours();      // 0 - 23
        var minutes = datetime.getMinutes();  // 0 - 59
        var dayOfWeek = datetime.getDay();    // 0 - 6

        // build string for month
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        var monthStr = monthNames[month].substring(0, 3);

        // build string for day
        var daySuffix = "th";
        if (day == 1) daySuffix = "st";
        if (day == 2) daySuffix = "nd";
        if (day == 3) daySuffix = "rd";
        var dayStr = day + daySuffix;

        // build string for day of week
        var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var dayOfWeekStr = days[dayOfWeek].substring(0, 3);

        // build string for minutes
        var minutesStr = (minutes < 10) ? '0' + minutes : minutes;

        // build string for hours
        // TODO we could create a function and use it for the playlistBounds filter
        var hoursSuffix = (hours >= 12) ? 'PM' : 'AM';
        hours = (hours > 12) ? hours -12 : hours;
        hours = (hours == '00') ? 12 : hours;
        var hoursStr = hours + ':' + minutesStr + hoursSuffix;


        var fullDateStr = dayOfWeekStr + ' ' + dayStr + ' ' + monthStr + '. ' + hoursStr;
        return fullDateStr.toUpperCase();
      }
  });


  /**
   * Constructor
   */
  function TicketController($state, $http, $rootScope, $interval, $timeout, PlayerService, PlaylistService, Socialshare) {
      var vm = this;

    // set default value into vm.song
    vm.song = {
      'id' : 0,
      'artist' : 'The Artist',
      'title' : 'The Title',
      'duration' : 3*60*1000
    }

    // initialise the time variable
    vm.clock = "loading clock...";
    vm.tickInterval = 1000;
    var tick = function () {
        vm.clock = new Date();
        $timeout(tick, vm.tickInterval); // reset the timer
    }
    // Start the timer
    $timeout(tick, vm.tickInterval);

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
        return PlayerService.getIsPlaying();
    };
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
     * This method shares the current title - author, with a link to the VCP
     * home, on facebook.
     */
    this.shareFacebook = function() {
        var currentSong = PlayerService.getCurrentSong();
        var message = 'On aime \"' + currentSong.title + '\" - \"' + currentSong.artist + '\" sur VCP!';

        Socialshare.share({
            'provider': 'facebook',
            'attrs': {
                'socialshareUrl': 'http://178.62.117.184:8181/#/ticket',
                'socialshareType': 'share',
                'socialshareVia': '1531824530180454',
                'socialshareTitle': message
            }
        });
    };

    /**
     * This method shares the current title - author, with a link to the VCP
     * home, on twitter.
     */
    this.shareTwitter = function() {
        var currentSong = PlayerService.getCurrentSong();
        var message = 'On aime \"' + currentSong.title + '\" - \"' + currentSong.artist + '\" sur VCP!';

        Socialshare.share({
            'provider': 'twitter',
            'attrs': {
                'socialshareUrl': 'http://178.62.117.184:8181/#/ticket',
                'socialshareText': message
            }
        });
    };
  }
})();
