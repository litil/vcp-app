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
    .service("PlayerService", ["$q", "$rootScope", "$timeout", "$http", "angularPlayer", function(a, rootScopeParam, timeoutWrapper, httpClient, angularPlayerParam) {
          window.angularPlayer = angularPlayerParam;
          var deferred = a.defer();
          var progressPosition = 0;
          var i = function() {};

          /*
          var callApiAndSetInfo = function(setSongInfo) {
              window.parseMusic = function(data) {
                  timeoutWrapper(function() {
                      setSongInfo(data)
                  })
              };
              // get the info from the music server
              httpClient.jsonp(i.URL_INFOS);
          };
          */

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
          i.prototype.init = function() {
              var a = this;

              // calls the radio to get the current track
              // set the info into the player
              /*
              return callApiAndSetInfo(
                function(data) {
                  a.infos = data;
                  var urlSuffix = "/radio_VCP";
                  // I don't get what this line does apart from setting the info into a.current
                  a.current = data[urlSuffix];
              }
            ), this;
            */

            return this;
          },
          i.prototype.getCurrentPosition = function() {
            return progressPosition;
          },
          i.prototype.resetProgress = function() {
            progressPosition = 0;
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
