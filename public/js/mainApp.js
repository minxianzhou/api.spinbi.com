'use strict'
var mainApp = angular.module('mainApp', []);



mainApp.controller('MainPageCtrl', ['$scope', '$http', function ($scope, $http) {

	$scope.title = 'test';
	$scope.link = '';
	$scope.result = '';


	$scope.sendLink =   function(){

		// var data = {
	 //        link: $scope.link 
	        
	 //    };


	 //    $http.post("/content", data).success(function(data, status) {
  //           $scope.result = data;

  //       })

	
	}


}]);

