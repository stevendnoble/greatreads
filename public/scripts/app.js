// app declaration
var app = angular.module('badlibsApp', ['ngRoute', 'ngResource']);

// routes
app.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl'
      })
      .when('/passages', {
        templateUrl: 'passages/index.html',
        controller: 'PassagesCtrl'
      })
      .when('/responses', {
        templateUrl: 'responses/index.html',
        controller: 'ResponsesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
]);

// controllers
app.controller('HomeCtrl', ['$scope', function ($scope) {
  $scope.homeTest = "Welcome to the homepage!";
}]);

app.controller('PassagesCtrl', ['$scope', function ($scope) {
  $scope.test = "Welcome to the passages homepage!";
}]);

app.controller('ResponsesCtrl', ['$scope', function ($scope) {
  $scope.test = "Welcome to the responses homepage!";
}]);
