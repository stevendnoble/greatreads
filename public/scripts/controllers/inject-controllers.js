var InjectControllers = angular.module('InjectControllers', []);

InjectControllers.controller('InjectPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to passage using id from the button
    $scope.choosePassage = function(id) {
      $location.path('/grammaring/passages/' + id);
    };
  }
]);

InjectControllers.controller('InjectPassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage', 'Response',
  function ($scope, $location, $routeParams, Passage, Response) {
    var passageId;
    // If id is given, retrieve passage from the database
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId },
        function (data) {
          $scope.passage = data.passage;
          // Get part of speech for each word using library
          $scope.injectWords = data.injectWords.map(function(item) {
            item.tag = partsOfSpeech[item.tag];
            return item;
          });
        }
      );
    // If no id given, generate an id and redirect to passage
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/grammaring/passages/' + passageId);
      });
    }

    // Build story with user responses
    $scope.generateResponse = function () {
      $scope.showResponse = true;
      $scope.injectWords.forEach(function(item) {
        delete item.word;
        delete item.tag;
      });
      $scope.filledInStory = buildStory($scope.passage.text, $scope.injectWords);
    };

    // Save the response to the database and update score
    $scope.saveResponse = function () {
      var responseData = {
        username: $scope.username,
        passage: passageId,
        replacements: $scope.injectWords
      };
      Response.save(responseData,
        function (savedResponse) {
          if ($scope.username === 'random user' || $scope.username === '') {
            $location.path('/grammaring/stories');
          } else {
            $location.path('/leaderboard');
          }
        }
      );
      // Add 20 points to username's score if they have given a username
      if($scope.username !== 'random user' && $scope.username !== '') {
        $scope.saveScore($scope.username, 20);
      }
    };
  }
]);

InjectControllers.controller('InjectResponsesCtrl', ['$scope', 'Passage', 'Response',
  function ($scope, Passage, Response) {
  $scope.responses = [];
  Response.query(function (data) {
    data.forEach(function(item) {
      item.filledInStory = buildStory(item.passage.text, item.replacements);
      $scope.responses.push(item); 
    });
  });
}]);