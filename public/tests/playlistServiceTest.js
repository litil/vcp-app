describe('calculator', function () {

  beforeEach(module('vcpProject'));

  var playlistService;
  beforeEach(inject(function($injector) {
    playlistService = $injector.get('PlaylistService');
  }));

  describe('getCurrentPlaylist', function () {
		it('Current playlist should not be null', function () {
			var $scope = {};
			//var controller = $controller('ExtrasController', { $scope: $scope });
      var currentPlaylist = playlistService.getCurrentPlaylist();

			expect(currentPlaylist).not.toBe(null);
		});
	});

});
