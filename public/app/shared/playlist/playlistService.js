// public/app/shared/playlist/playlistService.js

(function() {

  'use strict';

    /**
     * This service is used to handle all player/radio events.
     *
     * @param a the root scope of the application. Every application has a single root scope.
     * @param rootScopeParam the root scope of the application. Every application has a single root scope.
     * @param timeoutWrapper angular's wrapper for window.setTimeout
     * @param httpClient a core Angular service that facilitates communication with
     * the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP
     * @param angularPlayerParam the angular player instance.
     *
     */
    angular
    .module("vcpProject")
    .service("PlaylistService", ["playlists", "schedules", function(playlists, schedules) {

      this.playlists = playlists;
      this.schedules = schedules;


      /**
       * This method gets the list of "normal" playlists from the constant file.
       * For the current playlist, we set its class. For the other ones, we set
       * the inactive class so that their background is dark grey.
       *
       * @return a list of playlists with the correct classes.
       */
      this.getNormalPlaylists = function() {
        var playlistsArray = [];
        var playlistConst;
        var playlist;

        // first get the current playlist to add the correct class
        var currentPlaylist = this.getCurrentPlaylist();

        for(var playlistKey in playlists.normal){
          playlistConst = playlists.normal[playlistKey];

          playlistsArray.push({
            key: playlistKey,
            label: playlistConst.label,
            cls: (playlistKey === currentPlaylist.key) ? playlistConst.cls : "inactive",
            description: playlistConst.description
          });
        }

        return playlistsArray;
      };


      /**
       * This method gets the list of "special" playlists from the constant file.
       *
       * @return a list of playlists with the correct classes.
       */
      this.getSpecialPlaylists = function() {
        var playlistsArray = [];
        var playlistConst;
        var playlist;
        var playlistCls = "inactive";

        for(var playlistKey in playlists.special){
          playlistConst = playlists.special[playlistKey];

          playlistsArray.push({
            key: playlistKey,
            label: playlistConst.label,
            cls: playlistCls,
            description: playlistConst.description
          });
        }

        return playlistsArray;
      };

      /**
       * This method gets the current playlist according to the selected schedule
       * (which is for now Paris) and the current time. It loops on the playlists,
       * then on the days and finally checks the time slot.
       *
       * @return a playlist object, with a key, a label, a start|end time and a
       * CSS class.
       */
      this.getCurrentPlaylist = function() {
        // get the current date and time
        var cDate = new Date();
        var day = cDate.getDay();   // 0 is Sunday
        var time = cDate.getHours();

        // get the current playlist from the current date and time
        var currPlaylist = null;
        var playlistStart;
        var playlistEnd;

        // loop on the different playlists
        angular.forEach(schedules.PARIS, function(value, key) {
          var currentPlaylistKey = key;

          // for each playlists, loop on the day
          angular.forEach(value, function(playlistValue, playlistKey) {
            var currentPlaylistDay = playlistKey;

            if (currentPlaylistDay == day) {
              // we're in the current day
              angular.forEach(playlistValue, function(dayValue) {
                if (time >= dayValue.start && time < dayValue.end) {
                  // we're in the correct time slot
                  var currPlaylistConst = playlists.normal[currentPlaylistKey];

                  currPlaylist = {
                    key: currentPlaylistKey,
                    label: currPlaylistConst.label,
                    description: currPlaylistConst.description,
                    start: dayValue.start, //TODO create a method converting it into HH:MM AM|PM
                    end: dayValue.end,
                    displayStart: dayValue.displayStart,
                    displayEnd: dayValue.displayEnd,
                    day: currentPlaylistDay,
                    nextKey: dayValue.nextKey,
                    nextDay: dayValue.nextDay,
                    cls : currPlaylistConst.cls
                  }

                  return currPlaylist;
                }
              });
            }
          });
        });

        return currPlaylist;
      };


      /**
       * This method gets the next playlist according to the selected schedule
       * (which is for now Paris) and the current playlist.
       *
       * @return a playlist object, with a key, a label, a start|end time and a
       * CSS class.
       */
      this.getNextPlaylist = function(currPlaylist) {
        // get the next playlist from the current one
        var nextPlaylistConst = playlists.normal[currPlaylist.nextKey];

        // get the list of possible next playlists (it's an array)
        var possibleNext = schedules.PARIS[currPlaylist.nextKey][currPlaylist.nextDay];

        // select the real next playlist by checking its key
        var nextPlaylistSchedule = null;
        angular.forEach(possibleNext, function(value) {
          if (value.key === currPlaylist.nextKey) {
            nextPlaylistSchedule = value;
          }
        });

        // build the next playlist
        var nextPlaylist = {
          key: currPlaylist.nextKey,
          label: nextPlaylistConst.label,
          description: nextPlaylistConst.description,
          start: nextPlaylistSchedule.start,
          end: nextPlaylistSchedule.end,
          displayStart: nextPlaylistSchedule.displayStart,
          displayEnd: nextPlaylistSchedule.displayEnd,
          cls : nextPlaylistConst.cls
        }

        return nextPlaylist;
      };


      /**
       * This method gets the playlist corresponding to the given playlist key.
       *
       * @param playlistKey
       *
       * @return a playlist object
       */
      this.getPlaylist = function(playlistKey) {
        debugger;
        if (playlists.normal[playlistKey] === undefined) {
          return playlists.special[playlistKey];
        }

        return playlists.normal[playlistKey];
      }

    }])

})();
