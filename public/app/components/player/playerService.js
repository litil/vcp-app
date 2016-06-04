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
          var INFOS_KEY = "/radio_VCP";
          var BASE_URL = "http://radio.vendredicestpermis.com";
          var MAX_SIZE = 64;

          var i = function() {};
          var hasBeenInitialized = false;
          var progressPosition = 0;
          var isPlaying = false;  // when we arrive on the application, the player is not playing
          var isMuted = false;
          var lastReset = 0;
          var isFirstSong = null;

          var song = {};
          var playingSong = {};
          var playingPlaylistKey = null;

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
           * This method starts the player if he's not already playing. Then
           * it mute it or unmute if he is playing.
           */
          i.prototype.togglePlay = function() {
            if (this.isPlaying() === false){
              // play the radio
              isPlaying = true;
              this.play();
            }

            if (this.isPlaying() && isMuted){
              // unmute the radio
              isMuted = false;
              this.mute();
            } else if (this.isPlaying() && !isMuted){
              // mute the radio
              isMuted = true;
              this.mute();
            }
          },

          /**
           * Is the player started ?
           *
           * @return true if the player is started, false otherwise.
           */
          i.prototype.getIsPlaying = function() {
            return isPlaying;
          },

          /**
           * Is the player muted ?
           *
           * @return true if the player is muted, false otherwise.
           */
          i.prototype.isMuted = function() {
            return isMuted;
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
            // var INFOS_KEY = "/radio_VCP";
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
            var img = null;

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
            if (this.isSameSong(title, playingSong.title, id, playingSong.id) === false){
              this.resetProgress();

              // init isFirstSong
              if (isFirstSong == null){
                isFirstSong = true;
              } else {
                isFirstSong = false;
              }
            }

            // get the song image
            //id = '80f0177f4de5003b82100505a70929e1';
            if(id !== undefined && id !== '00000000000000000000000000000000'){
              img = 'http://player.vendredicestpermis.com/img/covers/' + id;
            }

            // build  the song object
            playingSong = {
              'id' : id,
              'artist' : artist,
              'title' : title,
              'duration' : rawData.duration * 1000,
              'first' : isFirstSong,
              'img': img
            }

            // if the player has not been initialized, do it
            this.setPlayingRawData(rawData);
            if (hasBeenInitialized === false){
              this.setPlayingRawData(rawData);
              hasBeenInitialized = true;
            }

            return playingSong;
          },

          /**
           * This method returns the current song.
           */
          i.prototype.getCurrentSong = function(maxSize) {
            maxSize = maxSize || MAX_SIZE;

            // ellipsis artist and song of > 64
            if (playingSong.artist && playingSong.artist.length > maxSize){
              playingSong.artist = playingSong.artist.substring(0, maxSize) + '...';
            }
            if (playingSong.title && playingSong.title.length > maxSize){
              playingSong.title = playingSong.title.substring(0, maxSize) + '...';
            }

            return playingSong;
          },

          /**
           * This method gets the current progression within the current song. As
           * the flux never stops, we have to substract the last time we reset
           * the current progression.
           */
          i.prototype.getCurrentPosition = function() {
            return progressPosition - lastReset;
          },

          /**
           * This method gets the playlist that is being played. It returns
           * null if we're playing the live flux.
           */
          i.prototype.getPlayingPlaylistKey = function() {
            return playingPlaylistKey;
          },

          /**
           * This method checks we're not switching to the playing playlist.
           * Then it stops the player and starts it again with the playlist
           * corresponding to the given key.
           *
           * @param playlistKey
           */
          i.prototype.switchPlaylist = function(playlistKey, infoKey) {
            // check we're not switching to the current playlist
            if (playingPlaylistKey !== null  && playingPlaylistKey === playlistKey){
              return;
            }

            // set the future playlistKey
            playingPlaylistKey = playlistKey;

            // stop the actual playlist and remove the time
            if (playingPlaylistKey !== null){
              this.stopAndClean();
            }

            // start the playlist corresponding to the key
            INFOS_KEY = infoKey;
            this.play();
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
          i.prototype.isSameSong = function(playingSongTitle, lastSongTitle, playingSongId, lastSongId) {
            if (playingSongId !== undefined && lastSongId !== undefined){
              if (playingSongId !== lastSongId){
                return false;
              }
            } else {
              if (playingSongTitle !== lastSongTitle){
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
              return this.playingRawData && this.playCurrent(), this;
          },

          /**
           * This method pauses the player. We never stops the radio, we just
           * mute/unmute it, so this method would disappear.
           */
          i.prototype.pause = function() {
              angularPlayerParam.pause();
          },

          /**
           * This method stops the player and remove the existing track.
           */
          i.prototype.stopAndClean = function() {
              angularPlayerParam.stop();
              if(this.song !== undefined){
                angularPlayerParam.removeSong(this.song.id, 0);
              }
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
           * This method sets the given data into the playingRawData variable.
           * It corresponds to the current song information.
           *
           * @param data the playing song raw data
           */
          i.prototype.setPlayingRawData = function(data) {
              this.playingRawData = data;
          },

          /**
           * This method plays the current song.
           */
          i.prototype.playCurrent = function() {
              return this.isReady()
                .then(function() {
                  // build the url from the base url and the infos key
                  this.url = BASE_URL + INFOS_KEY;

                  // if the player is "ready" then add the current track into it
                  this.song = {
                      id: this.playingRawData.id,
                      title: this.playingRawData.server_name + " " + this.playingRawData.genre,
                      artist: this.playingRawData.server_name + "stream",
                      url: this.url
                  };
                  angularPlayerParam.addTrack(this.song);

                  // start the player
                  angularPlayerParam.play();
                }.bind(this)), this
          },

          new i;
      }])

})();
