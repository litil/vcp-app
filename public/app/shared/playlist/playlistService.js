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
       * (which is for now Paris) and the current time. It first gets all the values
       * for the current day and then loop on them to find the range corresponding
       * to the actual time.
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
        var index = 0;


        /*
        for (var property in schedules.PARIS[day]){
          playlistStart = property.substring(0, property.indexOf('-'));
          playlistEnd = property.substring(property.indexOf('-') + 1, property.length);

          if (time >= playlistStart && time <  playlistEnd){
            // we are in the correct constant value
            var currPlaylistConst = playlists.normal[schedules.PARIS[day][property]];
            currPlaylist = {
              key: schedules.PARIS[day][property],
              label: currPlaylistConst.label,
              description: currPlaylistConst.description,
              start: playlistStart, //TODO create a method converting it into HH:MM AM|PM
              end: playlistEnd,
              day: day,
              scheduleIndex : index,
              cls : currPlaylistConst.cls
            }
          }

          index++;
        }
        */

        angular.forEach(schedules.PARIS, function(value, key) {
          var currentPlaylistKey = key;

          angular.forEach(value, function(playlistValue, playlistKey) {
            var currentPlaylistDay = playlistKey;

            if (currentPlaylistDay == day) {
              angular.forEach(playlistValue, function(dayValue) {

                if (time >= dayValue.start && time < dayValue.end) {
                  var currPlaylistConst = playlists.normal[currentPlaylistKey];

                  currPlaylist = {
                    key: currentPlaylistKey,
                    label: currPlaylistConst.label,
                    description: currPlaylistConst.description,
                    start: dayValue.start, //TODO create a method converting it into HH:MM AM|PM
                    end: dayValue.end,
                    day: currentPlaylistDay,
                    nextKey: dayValue.nextKey,
                    nextDay: dayValue.nextDay,
                    //scheduleIndex : index,
                    cls : currPlaylistConst.cls
                  }

                  // return currPlaylist;
                }
              });
            }


          });
        });

        return currPlaylist;
      };


      /**
       * This method gets the next playlist according to the selected schedule
       * (which is for now Paris) and the index of the current playlist in the
       * schedule constant.
       *
       * @return a playlist object, with a key, a label, a start|end time and a
       * CSS class.
       */
      this.getNextPlaylist = function(currPlaylist) {

        debugger;

        var nextPlaylistConst = playlists.normal[currPlaylist.nextKey];
        var possibleNext = schedules.PARIS[currPlaylist.nextKey][currPlaylist.nextDay];
        var nextPlaylistSchedule = null;

        angular.forEach(possibleNext, function(value) {
          if (value.key === currPlaylist.nextKey) {
            nextPlaylistSchedule = value;
          }

        });

        var nextPlaylist = {
          key: currPlaylist.nextKey,
          label: nextPlaylistConst.label,
          description: nextPlaylistConst.description,
          start: nextPlaylistSchedule.start, //TODO create a method converting int into HH:MM AM|PM
          end: nextPlaylistSchedule.end,
          cls : nextPlaylistConst.cls
        }


        return nextPlaylist;

        /*
        var scheduleIndex = currPlaylist.scheduleIndex;

        // get the current date and time
        var cDate = new Date();
        var day = cDate.getDay();   // 0 is Sunday
        var time = cDate.getHours();

        if (currPlaylist != null){
          var sheduleKey = null;
          var scheduleIndex = 0;
          // get the first value from the same day starting with the current playlist end time
          // for example if the current playlist is AFR on monday, the next one is the one
          // starting with '6-' the same day. If none is found, take the first one of the
          // following day

          // we first test if there is a next value value in the current day.
          // In that case, we return that value.
          // If not, we return the first playlist of the following day.
          if (Object.keys(schedules.PARIS[day])[currPlaylist.scheduleIndex + 1] === undefined){
            day = (day === 6) ? 0 : day + 1;
            sheduleKey = Object.keys(schedules.PARIS[day])[0];
          } else {
            sheduleKey = Object.keys(schedules.PARIS[day])[currPlaylist.scheduleIndex + 1];
            scheduleIndex = currPlaylist.scheduleIndex + 1;
          }

          var nextPlaylistConst = playlists.normal[schedules.PARIS[day][sheduleKey]];
          var playlistStart = sheduleKey.substring(0, sheduleKey.indexOf('-'));
          var playlistEnd = sheduleKey.substring(sheduleKey.indexOf('-') + 1, sheduleKey.length);

          var nextPlaylist = {
            key: schedules.PARIS[day][sheduleKey],
            label: nextPlaylistConst.label,
            description: nextPlaylistConst.description,
            start: playlistStart, //TODO create a method converting int into HH:MM AM|PM
            end: playlistEnd,
            scheduleIndex : scheduleIndex,
            cls : nextPlaylistConst.cls
          }

          return nextPlaylist;
        }
        return null;
        */
      };

    }])

})();
