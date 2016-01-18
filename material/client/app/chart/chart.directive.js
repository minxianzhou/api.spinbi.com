(function () {
    'use strict';

    angular.module('app.chart')
        .directive('sparkline', sparkline);

    function sparkline() {
        var directive = {
            restrict: 'A',
            scope: {
            data: '=',
            options: '='
            },
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var data, options, sparkResize, sparklineDraw;

            data = scope.data;

            options = scope.options;

            sparkResize = void 0;

            sparklineDraw = function() {
            ele.sparkline(data, options);
            };

            $(window).resize(function(e) {
            clearTimeout(sparkResize);
            sparkResize = setTimeout(sparklineDraw, 200);
            });

            sparklineDraw();             
        }        
    }    

})(); 