'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:GenesCtrl
 * @description
 * # GenesCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
    .controller('GenesCtrl', function($scope, $rootScope, $location, _, api) {
        $scope.meta = {};

        $scope.clickGene = function(gene) {
            $location.path('/gene/' + gene);
        };
        $scope.doneLoading = false;
        // DataTable initialization & options
        $scope.dt = {};
        $scope.dt.dtOptions = {
            paging: false,
            hasBootstrap: true,
            language: {
                loadingRecords: '<img src="resources/images/loader.gif">'
            },
            scrollY: 500,
            scrollCollapse: true,
            aaSorting: [[1, 'desc'], [0, 'asc']],
            aoColumnDefs: [{
                aTargets: 0
            }, {
                aTargets: 1,
                sType: 'level',
                asSorting: ['desc', 'asc']
            }, {
                aTargets: 2,
                asSorting: ['desc', 'asc']
            }
            ],
            columnDefs: [
                {responsivePriority: 1, targets: 0},
                {responsivePriority: 2, targets: 1},
                {responsivePriority: 3, targets: 2}
            ],
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.childRowImmediate,
                    type: '',
                    renderer: function(api, rowIdx, columns) {
                        var data = $.map(columns, function(col) {
                            return col.hidden ?
                                '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                '<td>' + col.title + ':</td> ' +
                                '<td>' + col.data + '</td>' +
                                '</tr>' :
                                '';
                        }).join('');

                        return data ?
                            $('<table/>').append(data) :
                            false;
                    }
                }
            }
        };

        api.getNumbers('genes')
            .then(function(content) {
                if (content && _.isArray(content.data)) {
                    $scope.meta.genes = _.map(content.data, function(item) {
                        var levels = ['4', '3B', '3A', '2B', '2A', 'R1', '1'];
                        var _index = -1;
                        var __index = -1;
                        if (_.isString(item.highestSensitiveLevel)) {
                            __index = levels.indexOf(item.highestSensitiveLevel.replace('LEVEL_', ''));
                            if (__index > _index) {
                                _index = __index;
                            }
                        }
                        if (_.isString(item.highestResistanceLevel)) {
                            __index = levels.indexOf(item.highestSensitiveLevel.replace('LEVEL_', ''));
                            if (__index > _index) {
                                _index = __index;
                            }
                        }
                        var _hLevel = _index === -1 ? '' : levels[_index];
                        return {
                            gene: item.gene.hugoSymbol,
                            level: _hLevel,
                            altNum: item.alteration
                        };
                    });
                } else {
                    $scope.meta.genes = [];
                }
                $scope.doneLoading = true;
            }, function() {
                $scope.meta.genes = [];
                $scope.doneLoading = true;
            });
    });
