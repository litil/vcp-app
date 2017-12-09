// public/app/shared/playlist/constants.js

/**
 * This constant file contains all the defined 'normal' and 'special' playlists.
 * Each playlist is defined by a 3 letters code and has a label to be displayed
 * in the front and a CSS class to apply the correct colour.
 *
 */

(function() {

  'use strict';

  angular.module("vcpProject").constant("playlists", {
      normal : {
        MWE : {
          label : 'Morning W-E',
          cls : 'morning-weekend',
          infoKey: '/radio_VCP_MorningWeekEnd',
          description: 'Stretching, whispering, kissing, eating, you listen to MRN to kindly wake up beside your lover and even your one night stand.'
        },
        MRN : {
          label : 'Morning',
          cls : 'morning',
          infoKey: '/radio_VCP_Morning',
          description: 'This playlist stands for a dynamic wake up in order to face the though working world.'
        },
        CRG : {
          label : 'Cruising',
          cls : 'cruising',
          infoKey: '/radio_VCP',
          description: 'This is the main cruising playlist. Seatbelt sign is off, you can enjoy different type of music that will (hopefully) all work with your mood. Confortable, kind, you can work, you can park in your favourite sofa, welcome friends, chat, etc...'
        },
        BFR : {
          label : 'Before',
          cls : 'before',
          infoKey: '/radio_VCP_Before',
          description: 'Out of a diner, you feel like something is happening and wish to turn the volume up in order to be warm enough for your night.'
        },
        AFR : {
          label : 'After',
          cls : 'after',
          infoKey: '/radio_VCP_After',
          description: 'Eclectic, surprising, the After selection is meant to be listened coming back of your favourite night club, on your own or not... From classical music to electro, there is a lot!'
        }
      },
      special : {
        GRN : {
          label : 'Girl\'s Night',
          cls : 'girls-night',
          infoKey: '/radio_VCP_Girls'
        },
        OTR : {
          label : 'On The Road',
          cls : 'on-road',
          infoKey: '/radio_VCP_Road'
        },
        DPS : {
          label : 'Depressed',
          cls : 'depressed',
          infoKey: '/radio_VCP_Depress'
        },
        KDS : {
          label : 'Kids',
          cls : 'kids',
          infoKey: '/radio_VCP_Kids'
        },
        HPH : {
          label : 'Hip-Hop',
          cls : 'sports',
          infoKey: '/radio_VCP'
        },
        NTS : {
          label : '90\'s',
          cls : 'eighties',
          infoKey: '/radio_VCP_Eighties'
        }
      }
  });

})();
