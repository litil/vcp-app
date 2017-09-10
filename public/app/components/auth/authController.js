// public/app/components/auth/authController.js

(function() {

    'use strict';

    angular
        .module('vcpProject')
        .controller('AuthController', AuthController);


    function AuthController($auth, $state, $http, $rootScope, $location, Notification, PlayerService, PlaylistService) {
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
                if (!response) {
                    // an error occurred, display a message
                    Notification.error({message: 'Erreur d\'authentification', delay: 5000});
                }
                var user = JSON.stringify(response.data.user);
                localStorage.setItem('user', user);
                $rootScope.authenticated = true;
                $rootScope.currentUser = response.data.user;
                console.log("User " + response.data.user.email + " is authenticated!");
                $rootScope.mustAuthenticateModalDisplayed = false;
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
          $auth.authenticate(provider).then(function(result) {
              if (provider == 'facebook'){
                  vm.authenticateWithFacebook(result);
              } else if (provider == 'twitter'){
                  vm.authenticateWithTwitter(result);
              }

          // Handle errors
          }, function(error) {
              vm.loginError = true;
              vm.loginErrorText = error.data.error;
              console.log(error);
              console.log('error while logging in with oauth');
          });
        };


        vm.authenticateWithFacebook = function(result){
              var data = {
                  access_token: result.access_token
              };

              $http.post("/api/auth/facebook", data).then(function(result) {
                  // set the token in satellizer_token in local storage
                  var token = result.data;
                  localStorage.setItem('satellizer_token', token);

                  // get the authenticated user
                  return $http.get('api/authenticate/user');

              }, function(error) {
                  vm.loginError = true;
                  vm.loginErrorText = error.data.error;
                  console.log('error while logging in with facebook PHP');
              }).then(function(response) {
                  var user = JSON.stringify(response.data.user);
                  localStorage.setItem('user', user);
                  $rootScope.authenticated = true;
                  $rootScope.currentUser = response.data.user;
                  console.log("User " + response.data.user.email + " is authenticated!");
                  $rootScope.mustAuthenticateModalDisplayed = false;
                  $location.path('/ticket');
              });
          };

        vm.authenticateWithTwitter = function(result){
            // set the token in satellizer_token in local storage
            var token = result.data;
            localStorage.setItem('satellizer_token', token);

            // get the authenticated user
            return $http.get('api/authenticate/user').then(function(response) {
                var user = JSON.stringify(response.data.user);
                localStorage.setItem('user', user);
                $rootScope.authenticated = true;
                $rootScope.currentUser = response.data.user;
                console.log("User " + response.data.user.email + " is authenticated!");
                $rootScope.mustAuthenticateModalDisplayed = false;
                $location.path('/ticket');
            });
        };

    }
})();
