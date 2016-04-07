// public/app/components/core/common/commonElementsController.js

(function() {

  'use strict';

  angular
    .module('vcpProject')
    .controller('HeaderController', HeaderController);

  // logo directive (top left corner)
  angular.module("vcpProject").directive("logo", function() {
    return {
      templateUrl: "app/components/core/header/awesomeLogoDirective.html"
    }
  });

  /**
   * Constructor
   */
  function HeaderController($auth, $state, $http, $rootScope, $scope, $location) {
    var vm = this;

    $scope.isActive = function (viewLocation) {
      if (viewLocation === $location.path()){
        return 'active';
      } else {
        return '';
      }
    };
  }

})();
