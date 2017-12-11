var Router = angular.module('Router', ['ngRoute']);

Router.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .when('/newpassage', {
        templateUrl: 'templates/new.html',
        controller: 'HomeCtrl'
      })
      .when('/leaderboard', {
        templateUrl: 'templates/leaderboard.html',
        controller: 'MainCtrl'
      })
      .when('/grammaring/passages', {
        templateUrl: 'templates/grammaring/index.html',
        controller: 'InjectPassagesCtrl'
      })
      .when('/grammaring/passages/:id', {
        templateUrl: 'templates/grammaring/play.html',
        controller: 'InjectPassageShowCtrl'
      })
      .when('/grammaring/stories', {
        templateUrl: 'templates/grammaring/responses.html',
        controller: 'InjectResponsesCtrl'
      })
      .when('/grammaring/randomstory', {
        templateUrl: 'templates/grammaring/play.html',
        controller: 'InjectPassageShowCtrl'
      })
      .when('/unscrambling/passages', {
        templateUrl: 'templates/unscrambling/index.html',
        controller: 'UnscramblePassagesCtrl'
      })
      .when('/unscrambling/passages/:id', {
        templateUrl: 'templates/unscrambling/play.html',
        controller: 'UnscramblePassageShowCtrl'
      })
      .when('/unscrambling/randomstory', {
        templateUrl: 'templates/unscrambling/play.html',
        controller: 'UnscramblePassageShowCtrl'
      })
      .when('/proofreading/passages', {
        templateUrl: 'templates/proofreading/index.html',
        controller: 'ProofreadPassagesCtrl'
      })
      .when('/proofreading/passages/:id', {
        templateUrl: 'templates/proofreading/play.html',
        controller: 'ProofreadPassageShowCtrl'
      })
      .when('/proofreading/randomstory', {
        templateUrl: 'templates/proofreading/play.html',
        controller: 'ProofreadPassageShowCtrl'
      })
      .when('/complete-a-story/passages', {
        templateUrl: 'templates/complete-a-story/index.html',
        controller: 'CompletePassagesCtrl'
      })
      .when('/complete-a-story/passages/:id', {
        templateUrl: 'templates/complete-a-story/play.html',
        controller: 'CompletePassageShowCtrl'
      })
      .when('/complete-a-story/randomstory', {
        templateUrl: 'templates/complete-a-story/play.html',
        controller: 'CompletePassageShowCtrl'
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