var ProofreadControllers = angular.module('ProofreadControllers', ['ngSanitize']);

ProofreadControllers.controller('ProofreadPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to passage with id from button
    $scope.choosePassage = function(id) {
      $location.path('/proofread-a-story/passages/' + id);
    };
  }
]);

ProofreadControllers.controller('ProofreadPassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage',
  function ($scope, $location, $routeParams, Passage) {
    var passageId;
    // Score variables
    $scope.score = 0;
    $scope.attempts = { correct: [], incorrect: 0 };
    // If id is given, get that passage from database
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId }, function(data) { 
        $scope.passage = data.passage;
        $scope.totalQuestions = data.totalQuestions;
        $scope.correctSpellings = {};
        // Build misspellings object
        data.misspelledWords.forEach(function (item) {
          $scope.correctSpellings[item.word] = item.misspelledWord;
        });
        // Build the story to show on the page with incorrect spellings
        $scope.storyToProofread = buildStoryWithMisspellings($scope.passage.text, data.misspelledWords);
      });
    // If a random story is chosen, find random id and redirect
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/proofread-a-story/passages/' + passageId);
      });
    }

    // Check to see if the word is correct
    $scope.checkWord = function () {
      var wordToCheck = $scope.wordToCheck;
      $scope.wordToCheck = '';
      if ($scope.correctSpellings[wordToCheck]) {
        // Replace word in the passage with formatted correct word
        $scope.storyToProofread = $scope.storyToProofread.replace($scope.correctSpellings[wordToCheck], '<span class="corrected">'+wordToCheck+'</span>');
        // Add to the correct words so it can be checked and not used twice
        $scope.attempts.correct.push(wordToCheck);
        // Remove from the object so it cannot be used again
        delete $scope.correctSpellings[wordToCheck];
        // Update the score each time a word is checked
        $scope.score = Math.max(0, ($scope.attempts.correct.length - $scope.attempts.incorrect), (3 * $scope.attempts.correct.length - $scope.totalQuestions - $scope.attempts.incorrect));
      } else {
        // If incorrect, increment the counter for incorrect answers
        $scope.attempts.incorrect++;
      }
    };
  }
]);
