// public/app/components/player/playerService.js

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
    .service("PlayerService", ["$q", "$rootScope", "$timeout", "$http", "$interval", "angularPlayer", function(a, rootScopeParam, timeoutWrapper, httpClient, interval, angularPlayerParam) {
          window.angularPlayer = angularPlayerParam;
          var deferred = a.defer();
          var progressPosition = 0;
          var i = function() {};
          var lastReset = 0;
          var song = {};
          var hasBeenInitialized = false;
          var currentSong = {};

          rootScopeParam.$on("angularPlayer:ready", function() {
              deferred.resolve();
          }),
          rootScopeParam.$on("currentTrack:position", function(a, progressPos) {
              progressPosition = progressPos;
          });


          // create the object that will contain all the data
          // initialise this object
          return i.prototype.infos = "default_infos",
          i.prototype.current = "default_current",

          /**
           * This method starts a task running every 5s which calls the radio to
           * to get the current song information to be able to update the displayed
           * data.
           */
          i.prototype.getSongInfosTask = function() {
            // don't start a new polling if we're already polling
            if ( angular.isDefined(this.getSongInfosInterval)) return;

            // define polling interval, for now 5s
            var POLLING_INTERVAL = 5000;

            // call the radio to get current song information
            this.getSongInfosInterval = interval(function() {
                httpClient.jsonp("http://radio.vendredicestpermis.com/jsonp.xsl");
            }, POLLING_INTERVAL);
          },

          /**
           * This method does a first call to the radio to get the current song data
           * to be able to display the information. Then it launches the task which
           * will do the same every 5s to update the displayed information.
           */
          i.prototype.init = function() {
            // first call to the radio to display the current song data
            httpClient.jsonp("http://radio.vendredicestpermis.com/jsonp.xsl");

            // launches the task to update the song info
            this.getSongInfosTask();
          },

          /**
           * This method is automatically called after we called the radio for
           * the current information. It gets the artist and the title, then resets
           * the current progression and finally returns the fully built song object.
           * Of course, it initializes the player if it hasn't been yet.
           *
           * @param data the current song information
           */
          i.prototype.parseMusic = function(data) {
            // get the song raw data
            var INFOS_KEY = "/radio_VCP";
            var rawData = data[INFOS_KEY];

            // remove [Vendredi c'est permis]] from the rawTitle if it exists
            var artistTitle = rawData.title;
            if (rawData.title.indexOf('[Vendredi c\'est permis]') > -1){
              artistTitle = rawData.title.substring(0, rawData.title.indexOf('[Vendredi c\'est permis]'));
            }
            artistTitle = artistTitle.trim();

            // get the id within {} it it exists
            // remove the {} from the raw title if it exists
            var id;
            if (artistTitle.indexOf('{') === 0 && artistTitle.indexOf('}') > -1){
              id = artistTitle.substring(1, artistTitle.indexOf('}'));
              artistTitle = artistTitle.substring(artistTitle.indexOf('}') + 1, artistTitle.length);
              artistTitle = artistTitle.trim();
            }

            // split the raw title to get the title and the artist
            var artistTitleArray = artistTitle.split(" - ");
            var artist = artistTitleArray[0];
            var title = artistTitleArray[1];

            // check title and artist length
            // ellipsis them of > 64
            if (artist.length > 64){
              artist = artist.substring(0, 64) + ' ... ';
            }
            if (title.length > 64){
              title = title.substring(0, 64) + ' ... ';
            }

            // reset the duration counter if it is a new song
            //TODO Player - replace title with id once the id is correctly sent by server
            if (this.isSameSong(title, currentSong.title, id, currentSong.id) === false){
              this.resetProgress();
            }

            // build  the song object
            currentSong = {
              'id' : id,
              'artist' : artist,
              'title' : title,
              'duration' : rawData.duration * 1000
            }

            // if the player has not been initialized, do it
            if (hasBeenInitialized === false){
              this.setCurrent(rawData);
              hasBeenInitialized = true;
            }

            return currentSong;
          },

          /**
           * This method returns the current song.
           */
          i.prototype.getCurrentSong = function() {
            return currentSong;
          },

          /**
           * This method gets the current progression within the current song. As
           * the flux never stops, we have to substract the last time we reset
           * the current progression.
           */
          i.prototype.getCurrentPosition = function() {
            console.log(progressPosition + "   " + lastReset);
            return progressPosition - lastReset;
          },

          /**
           * This method stores the current progression into a global variable
           * so that we we can substract it from the track current progression
           * when requested.
           */
          i.prototype.resetProgress = function() {
            lastReset = progressPosition;
          },

          /**
           * This method mutes the player. We never stops the radio, we just
           * mute/unmute it.
           */
          i.prototype.mute = function() {
              return angularPlayerParam.mute();
          },

          /**
           * This method unmutes the player. We never stops the radio, we just
           * mute/unmute it.
           */
          i.prototype.unmute = function() {
              return angularPlayerParam.unmute();
          },

          /**
           * This method checks the current ID/title against the last song
           * ID/title.
           */
          i.prototype.isSameSong = function(currentSongTitle, lastSongTitle, currentSongId, lastSongId) {
            if (currentSongId !== undefined && lastSongId !== undefined){
              if (currentSongId !== lastSongId){
                return false;
              }
            } else {
              if (currentSongTitle !== lastSongTitle){
                return false;
              }
            }

            return true;
          },

          /**
           * This method checks if the current song information is present and
           * then plays it.
           */
          i.prototype.play = function() {
              return this.current && this.playCurrent(), this;
          },

          /**
           * This method pauses the player. We never stops the radio, we just
           * mute/unmute it, so this method would disappear.
           */
          i.prototype.pause = function() {
              angularPlayerParam.pause();
          },

          /**
           * This method returns the playing status of the player. It checks the
           * component status but also the current progression.
           */
          i.prototype.isPlaying = function() {
              return angularPlayerParam.isPlayingStatus() && progressPosition > 0;
          },


          i.prototype.isReady = function() {
              return deferred.promise;
          },

          /**
           * This method sets the given data into the current variable. It corresponds
           * to the current song information.
           *
           * @param data the current song information
           */
          i.prototype.setCurrent = function(data) {
              this.current = data;
          },

          /**
           * This method plays the current song.
           */
          i.prototype.playCurrent = function() {
              return this.isReady()
                .then(function() {
                  // if the player is "ready" then add the current track into it
                  angularPlayerParam.addTrack({
                      id: this.current.id,
                      title: this.current.server_name + " " + this.current.genre,
                      artist: this.current.server_name + "stream",
                      url: this.current.url
                  });

                  // play
                  angularPlayerParam.play();
                }.bind(this)), this
          },

          new i;
      }])

})();
