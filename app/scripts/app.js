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
  .constant('apiLink', 'legacy-api/')
  .constant('publicApiLink', 'public-api/v1/')
  // .constant('apiLink', 'http://localhost:8080/oncokb/legacy-api/')
  // .constant('publicApiLink', 'http://localhost:8080/oncokb/public-api/v1/')
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
      .when('/gene/:geneName', {
        templateUrl: 'views/gene.html',
        controller: 'GeneCtrl',
        controllerAs: 'gene'
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
      .when('/terms', {
        templateUrl: 'views/license.html',
        controller: 'LicenseCtrl',
        controllerAs: 'license'
      })
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl',
        controllerAs: 'news'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('oncokbStaticApp').run(
  function($timeout, $rootScope, $location, _, api) {

    $rootScope.meta = {
      levelsDesc: {
        '1': 'FDA-recognized biomarker predictive of response to an FDA-approved drug in this indication',
        '2A': 'Standard of care biomarker predictive of response to an FDA-approved drug in this indication',
        '2B': 'Standard of care biomarker predictive of response to an FDA-approved drug in another indication but not standard of care for this indication',
        '3A': 'Compelling clinical evidence supports the biomarker as being predictive of response to a drug in this indication but neither biomarker and drug are standard of care',
        '3B': 'Compelling clinical evidence supports the biomarker as being predictive of response to a drug in another indication but neither biomarker and drug are standard of care',
        '4': 'Compelling biological evidence supports the biomarker as being predictive of response to a drug but neither biomarker and drug are standard of care',
        'R1': 'Standard of care biomarker predictive of resistance to an FDA-approved drug in this indication'
      },
      levelsDescHtml: {
        '1': '<span><b>FDA-recognized</b> biomarker predictive of response to an <b>FDA-approved</b> drug <b>in this indication</b></span>',
        '2A': '<span><b>Standard of care</b> biomarker predictive of response to an <b>FDA-approved</b> drug <b>in this indication</b></span>',
        '2B': '<span><b>Standard of care</b> biomarker predictive of response to an <b>FDA-approved</b> drug <b>in another indication</b> but not standard of care for this indication</span>',
        '3A': '<span><b>Compelling clinical evidence</b> supports the biomarker as being predictive of response to a drug <b>in this indication</b> but neither biomarker and drug are standard of care</span>',
        '3B': '<span><b>Compelling clinical evidence</b> supports the biomarker as being predictive of response to a drug <b>in another indication</b> but neither biomarker and drug are standard of care</span>',
        '4': '<span><b>Compelling biological evidence</b> supports the biomarker as being predictive of response to a drug but neither biomarker and drug are standard of care</span>',
        'R1': '<span><b>Standard of care</b> biomarker predictive of <b>resistance</b> to an <b>FDA-approved</b> drug <b>in this indication</b></span>'
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
              var match = item.level.match(/LEVEL_(R?\d)+/);
              if (_.isArray(match) && match.length > 1) {
                if (!levels.hasOwnProperty(match[1])) {
                  levels[match[1].toString()] = [];
                }
                levels[match[1].toString()] = _.union(levels[match[1]], item.genes);
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
angular.element(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
  var $target = $(e.target);
  var $tabs = $target.closest('.nav-tabs-responsive');
  var $current = $target.closest('li');
  var $parent = $current.closest('li.dropdown');
  $current = $parent.length > 0 ? $parent : $current;
  var $next = $current.next();
  var $prev = $current.prev();

  $tabs.find('>li').removeClass('next prev');
  $prev.addClass('prev');
  $next.addClass('next');
});

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "level-asc": function(a, b) {
    var levels = ['3B', '3A', '2B', '2A', 'R1', '1'];
    var _a = levels.indexOf(a);
    var _b = levels.indexOf(b);
    if (_a === -1) {
      return 1;
    }
    if (_b === -1) {
      return -1;
    }
    return _a - _b;
  },
  "level-desc": function(a, b) {
    var levels = ['3B', '3A', '2B', '2A','R1', '1'];
    var _a = levels.indexOf(a);
    var _b = levels.indexOf(b);
    if (_a === -1) {
      return 1;
    }
    if (_b === -1) {
      return -1;
    }
    return _b - _a;
  },
  "num-html-pre": function (a) {
    a = '<span>' + a + '</span>';
    var x = String($(a).text()).replace(/(?!^-)[^0-9.]/g, "");
    return x ? parseFloat(x) : Infinity;
  },
  "num-html-asc": function (a, b) {
    // if(a === Infinity) {
    //   return b;
    // }
    // if(b === Infinity) {
    //   return a;
    // }
    return a < b;
  },
  "num-html-desc": function (a, b) {
    // if(a === Infinity) {
    //   return b;
    // }
    // if(b === Infinity) {
    //   return a;
    // }
    return a > b;
  },
  "level-html-pre": function (a) {
    var s = $(a).text();
    var levels = ['3B', '3A', '2B', '2A', 'R1', '1'];
    return levels.indexOf(s);
  },
  "level-html-asc": function(a, b) {
    if (a === -1) {
      return 1;
    }else if (b === -1) {
      return -1;
    }else return a - b;
  },
  "level-html-desc": function(a, b) {
    if (a === -1) {
      return 1;
    }else if (b === -1) {
      return -1;
    }else return b - a;
  },
  "oncogenic-html-asc": function(a, b) {
    var levels = ['Unknown', 'Likely Neutral', 'Likely', 'Yes'];
    var _a = levels.indexOf(a);
    var _b = levels.indexOf(b);
    if (_a === -1) {
      return 1;
    }
    if (_b === -1) {
      return -1;
    }
    return _a - _b;
  },
  "oncogenic-html-desc": function(a, b) {
    var levels = ['Unknown', 'Likely Neutral', 'Likely', 'Yes'];
    var _a = levels.indexOf(a);
    var _b = levels.indexOf(b);
    if (_a === -1) {
      return 1;
    }
    if (_b === -1) {
      return -1;
    }
    return _b - _a;
  }
});
