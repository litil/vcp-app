// public/app/components/auth/authController.js

(function() {

    'use strict';

    angular
        .module('vcpProject')
        .controller('AuthController', AuthController);


    function AuthController($auth, $state, $http, $rootScope, $location, PlayerService, PlaylistService) {
        var vm = this;

        vm.loginError = false;
        vm.loginErrorText;

        /**
         * This method gets the playing playlist or the one supposed to be played
         * and then returns its CSS class.
         *
         * @param the CSS class of the playing playing playlist
         *
         */
        vm.getPlayingPlaylistCls = function() {
          var playingPlaylist = null;
          if (PlayerService.getPlayingPlaylistKey() === null) {
            playingPlaylist = PlaylistService.getCurrentPlaylist();
          } else {
            playingPlaylist = PlaylistService.getPlaylist(PlayerService.getPlayingPlaylistKey());
          }

          return playingPlaylist.cls;
        }


        vm.login = function() {
            // get crendetials from the scope
            var credentials = {
                email: vm.email,
                password: vm.password
            }

            $auth.login(credentials).then(function() {
                // Return an $http request for the now authenticated
                // user so that we can flatten the promise chain
                return $http.get('api/authenticate/user');

            // Handle errors
            }, function(error) {
                vm.loginError = true;
                vm.loginErrorText = error.data.error;

            // Because we returned the $http.get request in the $auth.login
            // promise, we can chain the next promise to the end here
            }).then(function(response) {
              debugger;
                // Stringify the returned data to prepare it
                // to go into local storage
                var user = JSON.stringify(response.data.user);

                // Set the stringified user data into local storage
                localStorage.setItem('user', user);

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app
                $rootScope.currentUser = response.data.user;

                // Everything worked out so we can now redirect to
                // the users state to view the data
                console.log("User " + response.data.user.email + " is authenticated!");
                $location.path('/ticket');
            });
        };

        /**
         * This method signs up a user.
         */
        vm.register = function() {
            // get crendetials from the scope
            var credentials = {
                email: vm.email,
                password: vm.password
            }

            $auth.signup(credentials).then(function() {
              // Return an $http request for the now authenticated
              // user so that we can flatten the promise chain
              // return $http.get('api/authenticate/user');
              vm.login();

            // Handle errors
            }, function(error) {
                vm.loginError = true;
                vm.loginErrorText = error.data.error;
            });
        };

        /**
         * This method authenticates the user with the given
         * provider (ex : Facebook, Twitter ...).
         */
        vm.authenticate = function(provider) {
          $auth.authenticate(provider);
        };
    }

})();
