'use strict';

/**
 * @ngdoc overview
 * @name oncokbStaticApp
 * @description
 * # oncokbStaticApp
 *
 * Main module of the application.
 */
angular
  .module('oncokbStaticApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.materialize',
    'ui.router',
    'datatables',
    'datatables.bootstrap',
    'ui.bootstrap'
  ])
  .constant('_', window._)
  .constant('apiLink', 'api/')
  .constant('publicApiLink', 'api/public/v1/')
  // .constant('apiLink', 'http://localhost:8080/oncokb-api/api/')
  // .constant('publicApiLink', 'http://localhost:8080/oncokb-api/api/public/v1/')
  // .constant('apiLink', 'http://dashi.cbio.mskcc.org:38080/beta/api/')
  // .constant('publicApiLink', 'http://dashi.cbio.mskcc.org:38080/beta/api/public/v1/')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeCtrl'
      })
      .when('/levels', {
        templateUrl: 'views/levels.html',
        controller: 'MainCtrl'
      })
      .when('/team', {
        templateUrl: 'views/team.html',
        controller: 'MainCtrl'
      })
      .when('/api', {
        templateUrl: 'views/api.html',
        controller: 'MainCtrl'
      })
      .when('/gene/:geneName', {
        templateUrl: 'views/gene.html',
        controller: 'GeneCtrl',
        controllerAs: 'gene'
      })
      .when('/quest', {
        templateUrl: 'views/quest.html',
        controller: 'QuestCtrl',
        controllerAs: 'quest'
      })
      .when('/genes', {
        templateUrl: 'views/genes.html',
        controller: 'GenesCtrl',
        controllerAs: 'genes'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/actionableGenes', {
        templateUrl: 'views/actionalGenes.html',
        controller: 'actionableGenesCtrl',
        controllerAs: 'actionableGenes'
      })
      .when('/license', {
        templateUrl: 'views/license.html',
        controller: 'LicenseCtrl',
        controllerAs: 'license'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('oncokbStaticApp').run(
  function($timeout, $rootScope, $location, _, api) {

    $rootScope.meta = {
      levelsDesc: {
        '1': 'FDA-approved biomarker and drug in this indication',
        '2A': 'Standard-of-care biomarker and drug in this indication but not FDA-approved',
        '2B': 'FDA-approved biomarker and drug in another indication but not FDA or Standard-of-care for this indication',
        '3A': 'Clinical evidence links biomarker to drug response in this indication but neither biomarker or drug are FDA-approved or Standard-of-care',
        '3B': 'Clinical evidence links biomarker to drug response in another indication but neither biomarker or drug are FDA-approved or Standard-of-care',
        '4': 'Preclinical evidence associates this biomarker to drug response but neither biomarker or drug are FDA-approved or Standard-of-care',
      },
      numbers: {
        main: {
          gene: 0,
          alteration: 0,
          tumorType: 0,
          drug: 0,
        },
        levels: {}
      }
    }

    $rootScope.view = {
      currentPage: '/'
    };
    $rootScope.meta.view = {
      subNavItems: [{
        content: '427 Genes',
        link: '#/genes'
      }, {content: '3800 Variants'}, {content: '333 Tumor Types'}]
    };
    $rootScope.data = {
      levelColors: {
        '1': '#008D14',
        '2A': '#019192',
        '2B': '#2A5E8E',
        '3A': '#794C87',
        '3B': '#9B7EB6',
        '4': 'grey',
        //'R1': '#F40000',
        //'R2': '#C4006F',
        //'R3': '#6F08A3',
        'Other': 'grey'
      }
    };

    api.getNumbers('main')
      .success(function(result) {
        if (result.meta.code === 200) {
          $rootScope.meta.numbers.main = {
            gene: result.data.gene,
            alteration: result.data.alteration,
            tumorType: result.data.tumorType,
            drug: result.data.drug,
          };
        }
      });

    api.getNumbers('levels')
      .success(function(result) {
        if (result.meta.code === 200 && _.isArray(result.data)) {
          var levels = {}, levels = {};
          _.each(result.data, function(item) {
            if (item.level) {
              var match = item.level.match(/(\d)+/);
              if (_.isArray(match) && match.length > 0) {
                if (!levels.hasOwnProperty(match[0])) {
                  levels[match[0].toString()] = [];
                }
                levels[match[0].toString()] = _.union(levels[match[0]], item.genes);
              }
            }
          });

          $rootScope.meta.numbers.levels = levels;
        }
      });

    $rootScope.$on('$routeChangeStart', function() {
      $rootScope.view.subNavItems = [];
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      var path = $location.path().split('/') || [];
      $rootScope.view.currentPage = path.length > 2 ? path[1] : '';
      if (!$rootScope.view.subNavItems || $rootScope.view.subNavItems.length === 0) {
        $.extend(true, $rootScope.view.subNavItems, $rootScope.meta.view.subNavItems);
      }
    });
  })
;


NProgress.start();
angular.element(document).ready(function() {
  angular.bootstrap(document, ['oncokbStaticApp']);
});
