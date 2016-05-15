describe('calculator', function () {

  beforeEach(module('vcpProject'));

  var playlistService;
  beforeEach(inject(function($injector) {
    playlistService = $injector.get('PlaylistService');
  }));

  describe('getCurrentPlaylist', function () {
		it('Current playlist should not be null', function () {
			var $scope = {};
      var currentPlaylist;
      var baseTime;
			//var controller = $controller('ExtrasController', { $scope: $scope });

      // sunday, 3pm => morning weekend
      baseTime = new Date(2016, 5, 15, 15, 0, 0);
      jasmine.clock().mockDate(baseTime);
      currentPlaylist = playlistService.getCurrentPlaylist();

      debugger;

			expect(currentPlaylist).not.toBe(null);
      expect(currentPlaylist.key).toBe('CRG');
		});
	});

});
