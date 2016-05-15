describe('calculator', function () {

  beforeEach(module('vcpProject'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('sum', function () {
		it('1 + 1 should equal 2', function () {
			var $scope = {};
			var controller = $controller('ExtrasController', { $scope: $scope });
			$scope.x = 1;
			$scope.y = 2;
			$scope.sum();
			expect(x+y).toBe(3);
		});
	});

});
