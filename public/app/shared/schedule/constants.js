// public/app/shared/schedule/constants.js

/**
 * This constant file contains the defined "schedule", for now we only have one
 * for Paris but we plan to add one for New York and Hong Kong.
 *
 *
 *
 */

(function() {

  'use strict';

  angular.module("vcpProject").constant("schedules", {
      PARIS : {
        'CRG' : {
          0 : [
            {
              key: 'CRG',
              start : 0,
              end : 2,
              nextKey : 'AFR',
              nextDay : 0
            }, {
              key: 'CRG',
              start : 13,
              end : 24,
              nextKey : 'CRG',
              nextDay : 1
            }
          ],
          1: [
            {
              key: 'CRG',
              start : 0,
              end : 2,
              nextKey : 'MRN',
              nextDay : 1
            }, {
              key: 'CRG',
              start : 11,
              end : 24,
              nextKey : 'CRG',
              nextDay : 2
            }
          ],
          2: [
            {
              key: 'CRG',
              start : 0,
              end : 2,
              nextKey : 'MRN',
              nextDay : 2
            }, {
              key: 'CRG',
              start : 11,
              end : 24,
              nextKey : 'AFR',
              nextDay : 3
            }
          ],
          3: [
            {
              key: 'CRG',
              start : 0,
              end : 2,
              nextKey : 'MRN',
              nextDay : 3
            }, {
              key: 'CRG',
              start : 11,
              end : 24,
              nextKey : 'AFR',
              nextDay : 4
            }
          ],
          4: [
            {
              key: 'CRG',
              start : 0,
              end : 2,
              nextKey : 'MRN',
              nextDay : 4
            }, {
              key: 'CRG',
              start : 11,
              end : 23,
              nextKey : 'BFR',
              nextDay : 4
            }
          ],
          5: [
            {
              key: 'CRG',
              start : 11,
              end : 23,
              nextKey : 'BFR',
              nextDay : 5
            }
          ],
          6: [
            {
              key: 'CRG',
              start : 13,
              end : 24,
              nextKey : 'CRG',
              nextDay : 0
            }
          ]
        },
        'MRN': {
          1: [
            {
              key: 'MRN',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 1
            }
          ],
          2: [
            {
              key: 'MRN',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 2
            }
          ],
          3: [
            {
              key: 'MRN',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 3
            }
          ],
          4: [
            {
              key: 'MRN',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 4
            }
          ],
          5: [
            {
              key: 'MRN',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 5
            }
          ]
        },
        'MWE': {
          0: [
            {
              key: 'MWE',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 6
            }
          ],
          1: [
            {
              key: 'MWE',
              start: 6,
              end: 11,
              nextKey : 'CRG',
              nextDay : 6
            }
          ]
        },
        'BFR': {
          4: [
            {
              key: 'BFR',
              start: 23,
              end: 24,
              nextKey : 'BFR',
              nextDay : 5
            }
          ],
          5: [
            {
              key: 'BFR',
              start: 0,
              end: 2,
              nextKey : 'AFR',
              nextDay : 6
            },
            {
              key: 'BFR',
              start: 23,
              end: 24,
              nextKey : 'CRG',
              nextDay : 6
            }
          ],
          6: [
            {
              key: 'BFR',
              start: 0,
              end: 2,
              nextKey : 'AFR',
              nextDay : 0
            }
          ]
        },
        'AFR': {
          0: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MWE',
              nextDay : 0
            }
          ],
          1: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MRN',
              nextDay : 1
            }
          ],
          2: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MRN',
              nextDay : 2
            }
          ],
          3: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MRN',
              nextDay : 3
            }
          ],
          4: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MRN',
              nextDay : 4
            }
          ],
          5: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MRN',
              nextDay : 5
            }
          ],
          6: [
            {
              key: 'AFR',
              start: 2,
              end: 6,
              nextKey : 'MWE',
              nextDay : 6
            }
          ],
        }
        /*
        0 : { // sunday
          '0-2' : 'CRG',
          '2-6' : 'AFR',
          '6-13' : 'MWE',
          '13-24' : 'CRG'
        },
        1 : { // monday
          '0-2' : 'CRG',
          '2-6' : 'AFR',
          '6-11' : 'MRN',
          '11-24' : 'CRG'
        },
        2 : { // tuesday
          '0-2' : 'CRG',
          '2-6' : 'AFR',
          '6-11' : 'MRN',
          '11-24' : 'CRG'
        },
        3 : { // wenesday
          '0-2' : 'CRG',
          '2-6' : 'AFR',
          '6-11' : 'MRN',
          '11-24' : 'CRG'
        },
        4 : { // thursday
          '0-2' : 'CRG',
          '2-6' : 'AFR',
          '6-11' : 'MRN',
          '11-23' : 'CRG',
          '23-24' : 'BFR'
        },
        5 : { // friday
          '0-2' : 'BFR',
          '2-6' : 'AFR',
          '6-11' : 'MRN',
          '11-23' : 'CRG',
          '23-24' : 'BFR'
        },
        6 : { // saturday
          '0-2' : 'BFR',
          '2-6' : 'AFR',
          '6-13' : 'MWE',
          '13-24' : 'CRG'
        }
        */
    }
  });

})();
