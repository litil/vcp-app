describe('calculator', function () {

  beforeEach(module('vcpProject'));

  var playlistService;
  beforeEach(inject(function($injector) {
    playlistService = $injector.get('PlaylistService');
  }));

  /**
   * This test checks the current playlist on Mondays, for the Paris schedule.
   */
  describe('getCurrentPlaylist', function () {
		it('Paris\'s shedule - Monday ', function () {
      var currentPlaylist;
      var baseTime;

      // MONDAY
      // 2am => AFR
      baseTime = new Date(2016, 4, 16, 2, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('AFR');

      // MONDAY
      // 7am => MRN
      baseTime = new Date(2016, 4, 16, 7, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('MRN');

      // MONDAY
      // 12am => CRG
      baseTime = new Date(2016, 4, 16, 12, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // MONDAY
      // 5pm => CRG
      baseTime = new Date(2016, 4, 16, 17, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // MONDAY
      // 11pm => CRG
      baseTime = new Date(2016, 4, 16, 23, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(1);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');
		});
	});


  /**
   * This test checks the current playlist on Tuesdays, for the Paris schedule.
   */
  describe('getCurrentPlaylist', function () {
		it('Paris\'s shedule - Tuesday ', function () {
      var currentPlaylist;
      var baseTime;

      // TUESDAY
      // 1am => CRG
      baseTime = new Date(2016, 4, 17, 1, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // TUESDAY
      // 3am => AFR
      baseTime = new Date(2016, 4, 17, 3, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('AFR');

      // TUESDAY
      // 7am => CRG
      baseTime = new Date(2016, 4, 17, 7, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('MRN');

      // TUESDAY
      // 1pm => CRG
      baseTime = new Date(2016, 4, 17, 13, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // TUESDAY
      // 11pm => CRG
      baseTime = new Date(2016, 4, 17, 23, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(2);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');
		});
	});

  /**
   * This test checks the current playlist on Wednesdays, for the Paris schedule.
   */
  describe('getCurrentPlaylist', function () {
		it('Paris\'s shedule - Wednesday ', function () {
      var currentPlaylist;
      var baseTime;

      // WEDNESDAY
      // 1am => CRG
      baseTime = new Date(2016, 4, 18, 1, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(3);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // WEDNESDAY
      // 3am => AFR
      baseTime = new Date(2016, 4, 18, 3, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(3);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('AFR');

      // WEDNESDAY
      // 7am => CRG
      baseTime = new Date(2016, 4, 18, 7, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(3);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('MRN');

      // WEDNESDAY
      // 1pm => CRG
      baseTime = new Date(2016, 4, 18, 13, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(3);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // WEDNESDAY
      // 11pm => CRG
      baseTime = new Date(2016, 4, 18, 23, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(3);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');
		});
	});

  /**
   * This test checks the current playlist on Thursdays, for the Paris schedule.
   */
  describe('getCurrentPlaylist', function () {
		it('Paris\'s shedule - Thursday ', function () {
      var currentPlaylist;
      var baseTime;

      // THURSDAY
      // 1am => CRG
      baseTime = new Date(2016, 4, 19, 1, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // THURSDAY
      // 3am => AFR
      baseTime = new Date(2016, 4, 19, 3, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('AFR');

      // THURSDAY
      // 7am => CRG
      baseTime = new Date(2016, 4, 19, 7, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('MRN');

      // THURSDAY
      // 1pm => CRG
      baseTime = new Date(2016, 4, 19, 13, 0, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('CRG');

      // THURSDAY
      // 11pm => BFR
      baseTime = new Date(2016, 4, 19, 23, 10, 0);
      jasmine.clock().mockDate(baseTime);
      expect(baseTime.getDay()).toEqual(4);
      currentPlaylist = playlistService.getCurrentPlaylist();
      expect(currentPlaylist.key).toBe('BFR');
		});
	});
});
