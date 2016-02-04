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
      .when('/inject-a-word/passages', {
        templateUrl: 'templates/inject-a-word/index.html',
        controller: 'InjectPassagesCtrl'
      })
      .when('/inject-a-word/passages/:id', {
        templateUrl: 'templates/inject-a-word/play.html',
        controller: 'InjectPassageShowCtrl'
      })
      .when('/inject-a-word/stories', {
        templateUrl: 'templates/inject-a-word/responses.html',
        controller: 'InjectResponsesCtrl'
      })
      .when('/inject-a-word/randomstory', {
        templateUrl: 'templates/inject-a-word/play.html',
        controller: 'InjectPassageShowCtrl'
      })
      .when('/unscramble-a-word/passages', {
        templateUrl: 'templates/unscramble-a-word/index.html',
        controller: 'UnscramblePassagesCtrl'
      })
      .when('/unscramble-a-word/passages/:id', {
        templateUrl: 'templates/unscramble-a-word/play.html',
        controller: 'UnscramblePassageShowCtrl'
      })
      .when('/unscramble-a-word/randomstory', {
        templateUrl: 'templates/unscramble-a-word/play.html',
        controller: 'UnscramblePassageShowCtrl'
      })
      .when('/proofread-a-story/passages', {
        templateUrl: 'templates/proofread-a-story/index.html',
        controller: 'ProofreadPassagesCtrl'
      })
      .when('/proofread-a-story/passages/:id', {
        templateUrl: 'templates/proofread-a-story/play.html',
        controller: 'ProofreadPassageShowCtrl'
      })
      .when('/proofread-a-story/randomstory', {
        templateUrl: 'templates/proofread-a-story/play.html',
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