// app declaration
var app = angular.module('badlibsApp', ['ngRoute', 'ngResource', 'ngSanitize']);

// routes
app.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .when('/passages', {
        templateUrl: 'templates/passages/index.html',
        controller: 'PassagesCtrl'
      })
      .when('/passages/:id', {
        templateUrl: 'templates/passages/play.html',
        controller: 'PassageShowCtrl'
      })
      .when('/newpassage', {
        templateUrl: 'templates/passages/new.html',
        controller: 'PassagesCtrl'
      })
      .when('/stories', {
        templateUrl: 'templates/responses/index.html',
        controller: 'ResponsesCtrl'
      })
      .when('/randomstory', {
        templateUrl: 'templates/passages/play.html',
        controller: 'PassageShowCtrl'
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

// factories
app.factory('Passage', ['$resource', function ($resource) {
  return $resource('/api/passages/:id', { id: '@_id' });
}]);

app.factory('Response', ['$resource', function ($resource) {
  return $resource('/api/responses/:id', { id: '@_id' });
}]);

// controllers
app.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.username = "random user";
}]);

app.controller('HomeCtrl', ['$scope', function ($scope) {
  $scope.homeTest = "Welcome to the homepage!";
}]);

app.controller('PassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    $scope.choosePassage = function(id) {
      $location.path('/passages/' + id);
    };

    $scope.savePassage = function() {
      var passageData = $scope.newPassage;
      // check passage for non-word characters
      // if more than one space between sentences, gsub
      // check submittedBy
      // if (passageData.submittedBy ===)
      Passage.save(passageData,
        function (savedPassage) {
          $location.path('/passages/' + savedPassage._id);
        },
        function(error) {
          // Error handling
        }
      );
    };
  }
]);

var partsOfSpeech = {
  CD: {
    definition: 'Counting number',
    examples: 'one,two'
  },
  IN: {
    definition: 'Preposition',
    examples: 'of,in,by'
  },
  JJ: {
    definition: 'Adjective',
    examples: 'big'
  },
  JJR: {
    definition: 'Adjective with -er',
    examples: 'bigger'
  },
  JJS: {
    definition: 'Adjective with -est',
    examples: 'biggest'
  },
  NN: {
    definition: 'Noun',
    examples: 'dog'
  },
  NNP: {
    definition: 'Proper noun',
    examples: 'Edinburgh'
  },
  NNPS: {
    definition: 'Proper noun (plural)',
    examples: 'Smiths'
  },
  NNS: {
    definition: 'Plural noun',
    examples: 'dogs'
  },
  PP$: {
    definition: 'Possessive pronoun',
    examples: "my,one's"
  },
  PRP: {
    definition: 'Pronoun',
    examples: 'I, you, she'
  },
  RB: {
    definition: 'Adverb',
    examples: 'quickly'
  },
  RBR: {
    definition: 'Adverb with -er',
    examples: 'faster'
  },
  RBS: {
    definition: 'Adverb with -est',
    examples: 'fastest'
  },
  UH: {
    definition: 'Interjection',
    examples: 'oh, oops'
  },
  VB: {
    definition: 'Verb',
    examples: 'eat'
  },
  VBD: {
    definition: 'Past tense verb',
    examples: 'ate'
  },
  VBG: {
    definition: 'Verb with -ing',
    examples: 'eating'
  },
  VBP: {
    definition: 'Verb',
    examples: 'eat'
  },
  VBZ: {
    definition: 'Verb ending in -s',
    examples: 'eats'
  }
};

function buildStory(passage, replacements) {
  var printPassage = passage.split(' ');
  var readPassage = passage.split(' ');
  replacements.forEach(function (word, index) {
    printPassage[word.wordIndex] = '<span class="replacement">&nbsp;&nbsp;'+word.newWord+'&nbsp;&nbsp;</span>';
    readPassage[word.wordIndex] = word.newWord;
  });
  printPassage = printPassage.join(' ');
  readPassage = readPassage.join(' ');
  return { print: printPassage, read: readPassage };
}


app.controller('PassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage', 'Response',
  function ($scope, $location, $routeParams, Passage, Response) {
    var passageId;

    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId },
        function (data) {
          $scope.passage = data.passage;
          $scope.wordsToReplace = data.wordsToReplace.map(function(item) {
            item.tag = partsOfSpeech[item.tag];
            return item;
          });
        }
      );
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/passages/' + passageId);
      });
    }

    $scope.playStory = function (title, story) {
      var playString = title + ', ' + story;
      responsiveVoice.speak(playString);
    };

    $scope.generateResponse = function () {
      $scope.showResponse = true;
      $scope.wordsToReplace.forEach(function(item) {
        delete item.word;
        delete item.tag;
      });
      $scope.filledInStory = buildStory($scope.passage.text, $scope.wordsToReplace);
    };

    $scope.saveResponse = function () {
      var responseData = {
        username: $scope.username,
        passage: passageId,
        replacements: $scope.wordsToReplace
      };
      Response.save(responseData,
        function (savedResponse) {
          $location.path('/stories');
        },
        function(error) {
          // Error handling
        }
      );
    };
  }
]);

app.controller('ResponsesCtrl', ['$scope', 'Passage', 'Response',
  function ($scope, Passage, Response) {
  $scope.responses = [];
  Response.query(function (data) {
    data.forEach(function(item) {
      item.filledInStory = buildStory(item.passage.text, item.replacements);
      $scope.responses.push(item); 
    });
  });

  $scope.playStory = function (title, story) {
    var playString = title + ', ' + story;
    responsiveVoice.speak(playString);
  };
}]);



