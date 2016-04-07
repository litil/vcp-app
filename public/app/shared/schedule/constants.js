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
    }
  });

})();
