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
  }
})();
