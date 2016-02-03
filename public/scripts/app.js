// app declaration
var app = angular.module('wordWizzerdApp', ['ngRoute', 'ngResource', 'ngSanitize']);

// routes
app.config(['$routeProvider', '$locationProvider',
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
        controller: 'HomeCtrl'
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
      // .when('/unscramble-a-word/stories', {
      //   templateUrl: 'templates/unscramble-a-word/responses.html',
      //   controller: 'UnscrambleResponsesCtrl'
      // })
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
      // .when('/proofread-a-story/stories', {
      //   templateUrl: 'templates/proofread-a-story/responses.html',
      //   controller: 'ProofreadResponsesCtrl'
      // })
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
      // .when('/complete-a-story/stories', {
      //   templateUrl: 'templates/complete-a-story/responses.html',
      //   controller: 'CompleteResponsesCtrl'
      // })
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

// factories
app.factory('Passage', ['$resource', function ($resource) {
  return $resource('/api/passages/:id', { id: '@_id' });
}]);

app.factory('Response', ['$resource', function ($resource) {
  return $resource('/api/responses/:id', { id: '@_id' });
}]);

// functions and variables

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

function buildStory (passage, replacements) {
  var printPassage = passage.split(' ');
  var readPassage = passage.split(' ');
  replacements.forEach(function (word) {
    printPassage[word.wordIndex] = '<span class="replacement">&nbsp;&nbsp;'+word.newWord+'&nbsp;&nbsp;</span>';
    readPassage[word.wordIndex] = word.newWord;
  });
  printPassage = printPassage.join(' ');
  readPassage = readPassage.join(' ');
  return { print: printPassage, read: readPassage };
}

function buildScrambledStory (passage, words) {
  var insertion; 
  passage = passage.split(' ');
  words.forEach(function (word) {
    // <span ng-if="userWords.WORD!=='WORD'" class="replacement">SCRAMBLEDWORD
    // <input type="text" class="unscrambleWord" ng-model="userWords.SCRAMBLEDWORD" placeholder="SCRAMBLEDWORD">
    // </span>
    insertion += "<span ng-if=\"userWords."+word.scrambledWord+"==='"+word.word+"'\" class=\"corrected\"><strong>"+word.word+"</strong></span>";

    insertion = "<span ng-if=\"userWords."+word.scrambledWord+"!=='"+word.word+"'\" class=\"replacement\">";
    insertion += word.scrambledWord+" ";
    insertion += "<input type=\"text\" class=\"unscrambleWord\" ng-model=\"userWords."+word.scrambledWord+"\" placeholder=\""+word.scrambledWord+"\"></span>";
    insertion += "<span ng-if=\"userWords."+word.scrambledWord+"==='"+word.word+"'\" class=\"corrected\"><strong>"+word.word+"</strong></span>";
    passage[word.wordIndex] = insertion;
  });
  passage = passage.join(' ');
  return passage;
}

function buildStoryWithMisspellings (passage, words) {
  var insertion; 
  passage = passage.split(' ');
  words.forEach(function (word) {
    passage[word.wordIndex] = word.misspelledWord;
  });
  passage = passage.join(' ');
  return passage;
}

// controllers
app.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.username = 'random user';

  $scope.playStory = function (title, story, voice) {
    var playString = title + ', ' + story;
    responsiveVoice.speak(playString, voice);
  };
}]);

app.controller('HomeCtrl', ['$scope', '$location', 'Passage', 
  function ($scope, $location, Passage) {
    $scope.homeTest = "Welcome to the homepage!";

    $scope.savePassage = function() {
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

app.controller('InjectPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    $scope.choosePassage = function(id) {
      $location.path('/inject-a-word/passages/' + id);
    };

  }
]);

app.controller('InjectPassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage', 'Response',
  function ($scope, $location, $routeParams, Passage, Response) {
    var passageId;

    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId },
        function (data) {
          $scope.passage = data.passage;
          $scope.injectWords = data.injectWords.map(function(item) {
            item.tag = partsOfSpeech[item.tag];
            return item;
          });
        }
      );
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/inject-a-word/passages/' + passageId);
      });
    }

    $scope.generateResponse = function () {
      $scope.showResponse = true;
      $scope.injectWords.forEach(function(item) {
        delete item.word;
        delete item.tag;
      });
      $scope.filledInStory = buildStory($scope.passage.text, $scope.injectWords);
    };

    $scope.saveResponse = function () {
      var responseData = {
        username: $scope.username,
        passage: passageId,
        replacements: $scope.injectWords
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

app.controller('InjectResponsesCtrl', ['$scope', 'Passage', 'Response',
  function ($scope, Passage, Response) {
  $scope.responses = [];
  Response.query(function (data) {
    data.forEach(function(item) {
      item.filledInStory = buildStory(item.passage.text, item.replacements);
      $scope.responses.push(item); 
    });
  });
}]);

app.controller('UnscramblePassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    $scope.choosePassage = function(id) {
      $location.path('/unscramble-a-word/passages/' + id);
    };
  }
]);

app.controller('UnscramblePassageShowCtrl', ['$scope', '$location', '$routeParams', '$sce', '$interval', '$timeout', 'Passage',
  function ($scope, $location, $routeParams, $sce, $interval, $timeout, Passage) {
    var passageId;
    $scope.userWords = {};
    $scope.unscrambledWords = 0;

    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId }, function(data) { 
        $scope.passage = data.passage;
        $scope.totalQuestions = data.totalQuestions;
        $scope.unscrambleWords = data.unscrambleWords;
        $scope.seconds = 0;
        $scope.start();
        $scope.checkWords = [];
        data.unscrambleWords.forEach(function(item) {
          $scope.checkWords.push(item.word);
        });

        // Waits until after angular has loaded, then calls function to compile the scrambled passage and inject into the virtual DOM
        $timeout( function(){ $scope.compileScrambledPassage(); }, 100);
      });
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/unscramble-a-word/passages/' + passageId);
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

    // Timer
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
    $scope.checkResults = function() {
      if ($scope.unscrambledWords === $scope.totalQuestions) {
        $scope.stop();
      }
      var counter = 0;
      $scope.seconds += 1;
      for (var key in $scope.userWords) {
        if ($scope.checkWords.indexOf($scope.userWords[key]) !== -1) {
          counter += 1;
        }
      }
      $scope.unscrambledWords = counter;
    };
  }
]);

app.controller('ProofreadPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    $scope.choosePassage = function(id) {
      $location.path('/proofread-a-story/passages/' + id);
    };
  }
]);

app.controller('ProofreadPassageShowCtrl', ['$scope', '$location', '$routeParams', '$sce', 'Passage',
  function ($scope, $location, $routeParams, $sce, Passage) {
    var passageId;
    $scope.attempts = { correct: [], incorrect: 0 };
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId }, function(data) { 
        $scope.passage = data.passage;
        $scope.totalQuestions = data.totalQuestions;
        $scope.correctSpellings = {};
        data.misspelledWords.forEach(function (item) {
          $scope.correctSpellings[item.word] = item.misspelledWord;
        });
        $scope.storyToProofread = buildStoryWithMisspellings($scope.passage.text, data.misspelledWords);
      });
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/proofread-a-story/passages/' + passageId);
      });
    }

    $scope.checkWord = function () {
      var wordToCheck = $scope.wordToCheck;
      $scope.wordToCheck = '';
      if ($scope.correctSpellings[wordToCheck]) {
        $scope.storyToProofread = $scope.storyToProofread.replace($scope.correctSpellings[wordToCheck], '<span class="corrected">'+wordToCheck+'</span>');
        $scope.attempts.correct.push(wordToCheck);
        delete $scope.correctSpellings[wordToCheck];
      } else {
        $scope.attempts.incorrect++;
      }
    };

    $scope.deliberatelyTrustDangerousSnippet = function() {
      return $sce.trustAsHtml($scope.storyToUnscramble);
    };
  }
]);

app.controller('CompletePassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    $scope.choosePassage = function(id) {
      $location.path('/complete-a-story/passages/' + id);
    };
  }
]);

app.controller('CompletePassageShowCtrl', ['$scope', '$location', '$routeParams', '$sce', 'Passage',
  function ($scope, $location, $routeParams, $sce, Passage) {
    var passageId;

    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId },
        function (data) {
          $scope.passage = data.passage;
          $scope.injectWords = data.injectWords.map(function(item) {
            item.tag = partsOfSpeech[item.tag];
            return item;
          });
        }
      );
    } else {
      Passage.query(function (passageArray) {
        var randomIndex = Math.floor(passageArray.length * Math.random());
        passageId = passageArray[randomIndex]._id;
        $location.path('/inject-a-word/passages/' + passageId);
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



    $scope.generateResponse = function () {
      $scope.showResponse = true;
      $scope.injectWords.forEach(function(item) {
        delete item.word;
        delete item.tag;
      });
      $scope.filledInStory = buildStory($scope.passage.text, $scope.injectWords);
    };

    $scope.saveResponse = function () {
      var responseData = {
        username: $scope.username,
        passage: passageId,
        replacements: $scope.injectWords
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