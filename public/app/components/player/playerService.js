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

          rootScopeParam.$on("angularPlayer:ready", function() {
              deferred.resolve();
          }),
          rootScopeParam.$on("currentTrack:position", function(a, progressPos) {
              progressPosition = progressPos;
          });





          // create the object that will contain all the data
          // initialise this object
          return i.URL_BASE = "http://radio.vendredicestpermis.com",
          i.URL_INFOS = i.URL_BASE + "/jsonp.xsl",
          i.prototype.infos = "default_infos",
          i.prototype.current = "default_current",

          i.prototype.getSongInfosTask = function() {
            // don't start a new polling if we're already polling
            if ( angular.isDefined(this.getSongInfosInterval)) return;

            var POLLING_INTERVAL = 5000;

            this.getSongInfosInterval = interval(function() {
                httpClient.jsonp("http://radio.vendredicestpermis.com/jsonp.xsl");
            }, POLLING_INTERVAL);
          },

          i.prototype.init = function() {
              var a = this;
              httpClient.jsonp("http://radio.vendredicestpermis.com/jsonp.xsl");

              this.getSongInfosTask();

              return this;
          },

          i.prototype.parseMusic = function(data) {
            var INFOS_KEY = "/radio_VCP"
            var rawData = data[INFOS_KEY];

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
            if (song.title !== title){
              this.resetProgress();
            }

            // build  the song object
            song = {
              'id' : rawData.id,
              'artist' : artist,
              'title' : title,
              'duration' : rawData.duration * 1000
            }

            // TODO if the player has not been initialized, do it and mute it
            if (hasBeenInitialized === false){
              this.setCurrent(rawData);
              hasBeenInitialized = true;
            }

            return song;
          },

          i.prototype.getCurrentPosition = function() {
            return progressPosition - lastReset;
          },
          i.prototype.resetProgress = function() {
            lastReset = progressPosition;
          },
          i.prototype.mute = function() {
              return angularPlayerParam.mute();
          },
          i.prototype.unmute = function() {
              return angularPlayerParam.unmute();
          },
          i.prototype.play = function() {
              return this.current && this.playCurrent(), this;
          },
          i.prototype.pause = function() {
              angularPlayerParam.pause();
          },
          i.prototype.isPlaying = function() {
              return angularPlayerParam.isPlayingStatus() && progressPosition > 0;
          },
          i.prototype.isReady = function() {
              return deferred.promise;
          },
          i.prototype.setCurrent = function(data) {
              this.current = data;
          },
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
