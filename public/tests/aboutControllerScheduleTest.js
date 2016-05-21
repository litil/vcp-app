describe('getCurrentSlotCls', function () {

  beforeEach(module('vcpProject'));

  var $controller;
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  var playlistService;
  beforeEach(inject(function($injector) {
    playlistService = $injector.get('PlaylistService');
  }));

  /**
   * This test checks the method returning the playlist CSS class if the
   * playlist is the current one (depending on the schedule) or '' if it's not
   * the current one.
   */
  describe('getCurrentSlotCls', function () {
		it('Paris\'s shedule - get current slot ', function () {
      var cssClass;
      var baseTime;


      // Monday -> Friday
      // 6am -> 11am
      baseTime = new Date(2016, 4, 16, 8, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);

      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      cssClass = aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11);
      expect(cssClass).toBe('morning');
		});
	});

});
