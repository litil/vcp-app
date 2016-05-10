// public/app/shared/modal/BackToLiveModalController.js

/**
 * This controller handles the behavior of the switching playlist confirmation
 * modal.
 *
 * This is taken from bootstrap-ui example :
 * https://angular-ui.github.io/bootstrap/#/modal
 *
 * Please note that $uibModalInstance represents a modal window (instance) dependency.
 * It is not the same as the $uibModal service used in the ExtrasController.
 */

angular.module('vcpProject').controller('BackToLiveModalController', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  /**
   * This method closes the modal and switch the playlist.
   */
  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  /**
   * This method closes the modal so it just removes the overlay and do nothing
   * else : same playlist is playing.
   */
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
