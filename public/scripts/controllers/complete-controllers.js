////////////////////////////////////////
//                                    //
// NEXT ITERATION: Not functional yet //
//                                    //
////////////////////////////////////////

var CompleteControllers = angular.module('CompleteControllers', []);

CompleteControllers.controller('CompletePassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to show page for passage
    $scope.choosePassage = function(id) {
      $location.path('/complete-a-story/passages/' + id);
    };
  }
]);

CompleteControllers.controller('CompletePassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage',
  function ($scope, $location, $routeParams, Passage) {
    var passageId;

    // If a passage id is given
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId },
        function (data) {
          // Set the passage and array of injectWords (objects)
          $scope.passage = data.passage;
          $scope.injectWords = data.injectWords.map(function(item) {
            item.tag = partsOfSpeech[item.tag];
            return item;
          });
        }
      );
    // If a random story is chosen, get a random id then load that view
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/grammaring/passages/' + passageId);
      });
    }

    // Compiles the passage and inject into the dom
    $scope.compilePassageToComplete = function() {
      var passage = buildStoryToComplete($scope.passage.text, $scope.unscrambleWords);
      var $div = $('<div>'+passage+'</div>');
      var $target = $('#passage');
      angular.element($target).injector().invoke(function($compile) {
        var $scope = angular.element($target).scope();
        $target.append($compile($div)($scope));
        $scope.$apply();
      });
    };

    // Builds the story with words replaced
    $scope.generateResponse = function () {
      $scope.showResponse = true;
      $scope.injectWords.forEach(function(item) {
        delete item.word;
        delete item.tag;
      });
      $scope.filledInStory = buildStory($scope.passage.text, $scope.injectWords);
    };

    // Saves the response to the database and updates the score
    $scope.saveResponse = function () {
      var responseData = {
        username: $scope.username,
        passage: passageId,
        replacements: $scope.injectWords
      };
      Response.save(responseData,
        function (savedResponse) {
          if ($scope.username === 'random user' || $scope.username === '') {
            $location.path('/stories');
          } else {
            $location.path('/leaderboard');
          }
        }
      );
    };
  }
]);