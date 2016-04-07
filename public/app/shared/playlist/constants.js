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
          label : 'Morning Weekend',
          cls : 'morning-weekend',
          description: 'On l’écoute en s’étirant, en chuchotant, en s’embrassant, en brunchant. Pour se réveiller détendu (e) au coté de celui ou celle que l’on aime ou que l’on va aimer.'
        },
        MRN : {
          label : 'Morning',
          cls : 'morning',
          description: 'Pour un réveil dynamique tout au long de la semaine.'
        },
        CRG : {
          label : 'Cruising',
          cls : 'cruising',
          description: 'C’est LA selection VCP en vitesse de croisière. Diffusée la majeure partie du temps, elle s’adapte à tout moment de la journée. Confortable, agréable, on y travaille, on s’y avachi dans un canapé, on y accueille ses invités à dîner, on partage, etc...'
        },
        BFR : {
          label : 'Before',
          cls : 'before',
          description: 'Sortie de dîner, envie d’une selection un peu plus dynamique afin de se préparer à sortir et festoyer.'
        },
        AFR : {
          label : 'After',
          cls : 'after',
          description: 'Diverse, surprenante, heteroclyte, la selection After s’écoute au retour de boite, en insomnie, seul ou accompagné(e). Du classique à l’electro, le spectre est vaste.'
        }
      },
      special : {
        GRN : {
          label : 'Girl\'s Night',
          cls : 'girls-night'
        },
        OTR : {
          label : 'On The Road',
          cls : 'on-road'
        },
        DPS : {
          label : 'Depressed',
          cls : 'depressed'
        },
        KDS : {
          label : 'Kids',
          cls : 'kids'
        },
        SPR : {
          label : 'Sports',
          cls : 'sports'
        },
        EGS : {
          label : 'Eighties',
          cls : 'eighties'
        },
        HPH : {
          label : 'Hip-Hop',
          cls : 'hip-hop'
        }
      }
  });

})();
