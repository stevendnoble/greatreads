var MainControllers = angular.module('MainControllers', []);

MainControllers.controller('MainCtrl', ['$scope', '$location', 'Score',
  function ($scope, $location, Score) {
    $scope.username = 'random user';

    $scope.scores = Score.query();

    // User responsivevoice.js library to read story aloud
    $scope.playStory = function (title, story, voice) {
      var playString = title + ', ' + story;
      responsiveVoice.speak(playString, voice);
    };

    // Save scores to database
    $scope.saveScore = function (username, score) {
      Score.save ({username: username, points: score},
        function(data) {
          $location.path('/leaderboard');
        }
      );
    };
  }
]);

MainControllers.controller('HomeCtrl', ['$scope', '$location', 'Passage', 
  function ($scope, $location, Passage) {
    $scope.homeTest = "Welcome to the homepage!";

    // Save a new passage from user input
    $scope.savePassage = function() {
      // Allows passage to be saved with username attached
      if ($scope.username != 'random user') {
        $scope.newPassage.submittedBy = $scope.username;
      }
      var passageData = $scope.newPassage;
      Passage.save(passageData,
        function (savedPassage) {
          // $location.path('/inject-a-word/passages/' + savedPassage._id);
          $scope.newPassage = {};
        }
      );
    };
  }
]);