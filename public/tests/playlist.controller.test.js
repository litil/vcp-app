describe('calculator', function () {

  beforeEach(module('vcpProject'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('getCurrentPlaylist', function () {
		it('Current playlist should not be null', function () {
			var $scope = {};
			var controller = $controller('ExtrasController', { $scope: $scope });
			expect(controller.getCurrentPlaylist()).not.toBe(null);
		});
	});

});
