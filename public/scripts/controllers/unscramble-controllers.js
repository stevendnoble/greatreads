var UnscrambleControllers = angular.module('UnscrambleControllers', []);

UnscrambleControllers.controller('UnscramblePassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to passage from button press
    $scope.choosePassage = function(id) {
      $location.path('/unscrambling/passages/' + id);
    };
  }
]);

UnscrambleControllers.controller('UnscramblePassageShowCtrl', ['$scope', '$location', '$routeParams', '$interval', '$timeout', 'Passage',
  function ($scope, $location, $routeParams, $interval, $timeout, Passage) {
    var passageId;
    $scope.userWords = {};
    $scope.unscrambledWords = 0;
    $scope.score = 0;
    $scope.bonus = 0;
    // If id is given, get passage from database
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId }, function(data) { 
        $scope.passage = data.passage;
        $scope.totalQuestions = data.totalQuestions;
        $scope.unscrambleWords = data.unscrambleWords;
        // Start the timer
        $scope.seconds = 0;
        $scope.start();
        // Create array of words to check against
        $scope.checkWords = [];
        data.unscrambleWords.forEach(function(item) {
          $scope.checkWords.push(item.word);
        });

        // Waits until after angular has loaded, then calls function to compile the scrambled passage and inject into the virtual DOM
        $timeout( function(){ $scope.compileScrambledPassage(); }, 100);
      });
    // If no id given, generates a random id and redirects
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/unscrambling/passages/' + passageId);
      });
    }

    // Compiles the passage and inject into the dom
    $scope.compileScrambledPassage = function() {
      var passage = buildScrambledStory($scope.passage.text, $scope.unscrambleWords);
      var $div = $('<div>'+passage+'</div>');
      var $target = $('#passage');
      angular.element($target).injector().invoke(function($compile) {
        var $scope = angular.element($target).scope();
        $target.append($compile($div)($scope));
        $scope.$apply();
      });
    };

    // Timer code
    $scope.Timer = null;
    $scope.start = function() {
      $scope.Timer = $interval(function () {
        $scope.checkResults();
      }, 1000);
    };
    $scope.stop = function() {
      if ($scope.Timer) {
        $interval.cancel($scope.Timer);
      }
    };

    // Check results every second
    $scope.checkResults = function() {
      // If user has unscrambled all the words, stop the timer and calculate bonus score
      if ($scope.unscrambledWords === $scope.totalQuestions) {
        $scope.stop();
        $scope.bonus = Math.max(0, Math.floor(($scope.totalQuestions * 10 - $scope.seconds) / 10));
      }
      // Calculate how many words the user has answered correctly every second
      var counter = 0;
      for (var key in $scope.userWords) {
        if ($scope.checkWords.indexOf($scope.userWords[key]) !== -1) {
          counter += 1;
        }
      }
      $scope.unscrambledWords = counter;
      // Increment the timer
      $scope.seconds += 1;
      // Score = (0 or 3xwords - total) + bonus
      $scope.score = Math.max(0, (3 * $scope.unscrambledWords - $scope.totalQuestions)) + $scope.bonus;
    };
  }
]);

