(function () {
    'use strict';

    angular.module('app.chart')
        .controller('SparklineCtrl', ['$scope', SparklineCtrl]);

    function SparklineCtrl($scope) {
        $scope.demoData1 = {};
        $scope.simpleChart1 = {};
        $scope.simpleChart2 = {};
        $scope.simpleChart3 = {};
        $scope.tristateChart1 = {};
        $scope.largeChart1 = {};
        $scope.largeChart2 = {};
        $scope.largeChart3 = {};


        ////
        $scope.demoData1 = {
            data: [3, 1, 2, 2, 4, 6, 4, 5, 2, 4, 5, 3, 4, 6, 4, 7],
            options: {
                type: 'line',
                lineColor: '#fff',
                highlightLineColor: '#fff',
                fillColor: $scope.color.success,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '150px'
            }
        };

        $scope.simpleChart1 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'line',
                lineColor: $scope.color.primary,
                fillColor: '#fafafa',
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false
            }
        };

        $scope.simpleChart2 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'bar',
                barColor: $scope.color.primary
            }
        };

        $scope.simpleChart3 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'pie',
                sliceColors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.infoAlt, $scope.color.warning, $scope.color.danger]
            }
        };

        $scope.tristateChart1 = {
            data: [1, 2, -3, -5, 3, 1, -4, 2],
            options: {
                type: 'tristate',
                posBarColor: $scope.color.success,
                negBarColor: $scope.color.danger
            }
        };

        $scope.largeChart1 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'line',
                lineColor: $scope.color.info,
                highlightLineColor: '#fff',
                fillColor: $scope.color.info,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '150px'
            }
        };

        $scope.largeChart2 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'bar',
                barColor: $scope.color.success,
                barWidth: 10,
                width: '100%',
                height: '150px'
            }
        };

        $scope.largeChart3 = {
            data: [3, 1, 2, 3, 5],
            options: {
                type: 'pie',
                sliceColors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.infoAlt, $scope.color.warning, $scope.color.danger],
                width: '150px',
                height: '150px'
            }
        };

        $scope.infoChart1 = {
            data: [10,11,13,12,11,10,11,12,13,14,15,13,14,12,13,15,11,13,11,15,6],
            options: {
                type: 'bar',
                barColor: $scope.color.primary,
                barWidth: 3,
                width: '100%',
                height: '26px'
            }
        };
        $scope.infoChart2 = {
            data: [10,11,12,13,14,15,14,13,12,11,15,14,13,14,12,13,15,13,11,11,12,6],
            options: {
                type: 'bar',
                barColor: $scope.color.success,
                barWidth: 3,
                width: '100%',
                height: '26px'
            }
        };
        $scope.infoChart3 = {
            data: [13,14,15,14,12,10,11,12,13,14,15,13,14,12,13,15,11,13,11,15,6],
            options: {
                type: 'bar',
                barColor: $scope.color.danger,
                barWidth: 3,
                width: '100%',
                height: '26px'
            }
        };
        $scope.infoChart4 = {
            data: [12,11,13,12,11,10,11,12,11,12,15,13,14,12,13,15,11,13,11,15,6],
            options: {
                type: 'bar',
                barColor: $scope.color.warning,
                barWidth: 3,
                width: '100%',
                height: '26px'
            }
        };


    }


})(); 