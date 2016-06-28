'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
  .controller('HomeCtrl', function($scope, $location, $rootScope, $window, api, _) {
    $scope.content = {
      hoveredGene: "gets",
      hoveredCount: '',
      main: $rootScope.meta.numbers.main,
      levels: $rootScope.meta.numbers.levels,
      matchedGenes: [],
      selectedGene: ''
    };
    // $scope.wordCloudContent = {};
    // d3.csv('resources/files/all_genes_with_all_variants.csv', function(content) {
    //   $scope.wordCloudContent = content;
    //
    //   $rootScope.view.subNavItems = [{
    //     content: '427 Genes',
    //     link: '#/genes'
    //   }, {content: '3800 Variants'}, {content: '333 Tumor Types'}];
    //
    //   generateWordCloud(content);
    // });
    //
    // angular.element($window).bind('resize', function() {
    //   generateWordCloud($scope.wordCloudContent);
    // });

    $scope.searchKeyUp = function(query) {
      return api.searchGene(query, false)
        .then(function(result) {
          if (result.status === 200) {
            var content = [];
            if (isNaN(query)) {
              query = query.toString().toLowerCase();
              content = result.data.data.sort(function(a, b) {
                var _a = a.hugoSymbol.toString().toLowerCase();
                var _b = b.hugoSymbol.toString().toLowerCase();

                if (_a === query) {
                  return -1;
                }
                if (_b === query) {
                  return 1;
                }

                return _a.indexOf(query) - _b.indexOf(query);
              });
            } else {
              content = result.data.data.sort();
            }

            return content.slice(0, 10);
          }
        }, function() {

        });
    };

    $scope.searchConfirmed = function() {
      if($scope.content.selectedGene.hugoSymbol) {
        $location.path('/gene/' + $scope.content.selectedGene.hugoSymbol);
      }
    };

    $scope.getGeneCountForLevel = function(level) {
      if ($scope.content.levels.hasOwnProperty(level)) {
        return $scope.content.levels[level].length;
      }
    };

    $rootScope.$watch('meta.numbers.main', function(n, o) {
      $scope.content.main = n;
    });

    $rootScope.$watch('meta.numbers.levels', function(n, o) {
      $scope.content.levels = n;
    });

    function generateWordCloud(content) {
      var levelColors = $rootScope.data.levelColors;
      var levelSize = {
        '1': 60,
        '2A': 50,
        '2B': 40,
        '3A': 35,
        '3B': 30,
        '4': 15,
        'Other': 15
      };
      var genes = {};
      var canvas = document.getElementById('wordCloud');
      var canvasWidth = $('#canvas-container').width();

      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", 600 + 1100 - (canvasWidth > 1100 ? 1100 : canvasWidth));

      WordCloud(document.getElementById('wordCloud'), {
        list: content.map(function(d) {
          d.hLevel = d.hLevel.replace('LEVEL_', '');
          d.hLevel = d.hLevel.replace('NULL', '');
          genes[d.gene] = d;
          return [d.gene, levelSize.hasOwnProperty(d.hLevel) ? (levelSize[d.hLevel] + Math.sqrt(d.altNum)) : levelSize['Other'], d.altNum, d.hLevel];
        }),
        fontFamily: 'Calibri',
        shape: 'circle',
        rotateRatio: 0,
        gridSize: '12',
        shuffle: false,
        color: function(word) {
          return levelColors.hasOwnProperty(genes[word].hLevel) ? levelColors[genes[word].hLevel] : levelColors['Other'];
        },
        hover: function(item, dimension, event) {
          var el = document.getElementById('canvas-hover');
          var hoverLabelElement = document.getElementById('canvas-hover-label');
          if (!item) {
            el.setAttribute('hidden', true);
            hoverLabelElement.setAttribute('hidden', true);
            return;
          }

          el.removeAttribute('hidden');
          el.style.left = dimension.x + 'px';
          el.style.top = dimension.y + 'px';
          el.style.width = dimension.w + 4 + 'px';
          el.style.height = dimension.h + 4 + 'px';


          hoverLabelElement.removeAttribute('hidden');
          $scope.content.hoveredGene = item[0];
          $scope.content.hoveredCount = item[2];
          $scope.content.hoveredHighestLevel = item[3];
          $scope.$apply();
        },
        click: function(item) {
          $location.path('/gene/' + item[0]);
        }
      });
    }
  });
