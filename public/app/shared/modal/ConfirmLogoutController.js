// public/app/shared/modal/ConfirmLogoutController.js

/**
 * This controller handles the behavior logging out the user
 *
 * This is taken from bootstrap-ui example :
 * https://angular-ui.github.io/bootstrap/#/modal
 *
 * Please note that $uibModalInstance represents a modal window (instance) dependency.
 * It is not the same as the $uibModal service used in the ExtrasController.
 */

angular.module('vcpProject').controller('ConfirmLogoutController', function ($auth, $rootScope, $scope, $uibModalInstance, $location, items, Notification, PlayerService) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  /**
   * This method closes the modal and logout the user
   */
  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);

    $auth.logout().then(function() {
      // remove user in local storage
      localStorage.removeItem('user');

      // set authenticated flag to false
      $rootScope.authenticated = false;

      // set $rootScope.currentUser to null
      $rootScope.currentUser = null;

      // set the first play date to undefined
      if (PlayerService.isPlaying()){
          $rootScope.firstPlayDate = new Date();
      } else {
          $rootScope.firstPlayDate = undefined;
      }

      // redirect to ticket view if we're not already there
      $location.path('/ticket');

      // the user has been successfully sign out
      Notification.success({message: 'Vous avez bien été déconnecté.', delay: 2000});
    });
  };

  /**
   * This method closes the modal so it just removes the overlay and do nothing
   * else : user is not logged out.
   */
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
