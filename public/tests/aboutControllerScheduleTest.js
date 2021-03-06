describe('Paris\'s shedule', function () {

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
  describe('Get current slot', function () {
		it('Monday -> Friday - Morning', function () {
      var cssClass;
      var baseTime;

      // Monday -> Friday
      // 6am -> 11am
      baseTime = new Date(2016, 4, 16, 8, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11);
      expect(cssClass).toBe('morning');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
		});

    it('Monday -> Wenesday - Cruising', function () {
      var cssClass;
      var baseTime;

      // Monday -> Wenesday
      // 11am -> 2am
      baseTime = new Date(2016, 4, 16, 12, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([1, 2, 3], 11, 2);
      expect(cssClass).toBe('cruising');

      // Monday -> Wenesday
      // 11am -> 2am
      baseTime = new Date(2016, 4, 17, 1, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);

      // get the about controller with the correct current playlist in the scope
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([1, 2, 3], 11, 2);
      expect(cssClass).toBe('cruising');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
		});

    it('Thursday -> Friday - Cruising', function () {
      var cssClass;
      var baseTime;

      // Thursday -> Friday
      // 11am -> 11pm
      baseTime = new Date(2016, 4, 19, 12, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([4, 5], 11, 23);
      expect(cssClass).toBe('cruising');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
		});

    it('Thursday -> Friday - Before', function () {
      var cssClass;
      var baseTime;

      // Thursday -> Friday
      // 11pm -> 2am
      baseTime = new Date(2016, 4, 19, 23, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([4, 5, 6], 23, 2);
      expect(cssClass).toBe('before');

      // Thursday -> Friday
      // 11pm -> 2am
      baseTime = new Date(2016, 4, 21, 1, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(6);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([4, 5, 6], 23, 2);
      expect(cssClass).toBe('before');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
		});

    it('Thursday -> Friday - Before - Test Saturday 1am', function () {
      var cssClass;
      var baseTime;

      // Thursday -> Friday
      // 11pm -> 2am
      baseTime = new Date(2016, 4, 21, 1, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(6);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([4, 5, 6], 23, 2);
      expect(cssClass).toBe('before');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
		});

    it('Saturday -> Sunday - Morning Weekend', function () {
      var cssClass;
      var baseTime;

      // Saturday -> Sunday
      // 6am -> 1pm
      baseTime = new Date(2016, 5, 4, 8, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(6);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([0, 6], 6, 13);
      expect(cssClass).toBe('morning-weekend');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 13, 2)).toBe('');
		});

    it('Saturday -> Sunday - Cruising', function () {
      var cssClass;
      var baseTime;

      // Saturday -> Sunday
      // 1pm -> 2am
      baseTime = new Date(2016, 5, 4, 15, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(6);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([0, 1, 6], 13, 2);
      expect(cssClass).toBe('cruising');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
    });

    it('Saturday -> Sunday - Monday Morning - Cruising', function () {
      var cssClass;
      var baseTime;

      // Saturday -> Sunday
      // 1pm -> 2am
      baseTime = new Date(2016, 5, 6, 1, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([0, 1, 6], 13, 2);
      expect(cssClass).toBe('cruising');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6)).toBe('');
    });

    it('Monday -> Sunday - Cruising', function () {
      var cssClass;
      var baseTime;

      // Monday -> Sunday
      // 2am -> 6am
      baseTime = new Date(2016, 5, 4, 3, 30, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(6);

      // get the about controller with the correct current playlist in the scope
      var $scope = {};
      $scope.playlists = {};
      $scope.playlists.current = playlistService.getCurrentPlaylist();
      var aboutController = $controller('AboutController', { $scope: $scope });

      // get the CSS class for the given slot
      cssClass = aboutController.getCurrentSlotCls([0, 1, 2, 3, 4, 5, 6], 2, 6);
      expect(cssClass).toBe('after');

      // check that the other slots are not active
      expect(aboutController.getCurrentSlotCls([1, 2, 3, 4, 5], 6, 11)).toBe('');
      expect(aboutController.getCurrentSlotCls([1, 2, 3], 11, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5], 11, 23)).toBe('');
      expect(aboutController.getCurrentSlotCls([4, 5, 6], 23, 2)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 6], 6, 13)).toBe('');
      expect(aboutController.getCurrentSlotCls([0, 1, 6], 13, 2)).toBe('');
    });
	});

});
