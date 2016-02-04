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

// factories
app.factory('Passage', ['$resource', function ($resource) {
  return $resource('/api/passages/:id', { id: '@_id' });
}]);

app.factory('Response', ['$resource', function ($resource) {
  return $resource('/api/responses/:id', { id: '@_id' });
}]);

app.factory('Score', ['$resource', function ($resource) {
  return $resource('/api/scores/:id', { id: '@_id' });
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
app.controller('MainCtrl', ['$scope', 'Score', function ($scope, Score) {
  $scope.username = 'random user';

  $scope.scores = Score.query();

  // User responsivevoice.js library to read story aloud
  $scope.playStory = function (title, story, voice) {
    var playString = title + ', ' + story;
    responsiveVoice.speak(playString, voice);
  };

  // Save scores to database
  $scope.saveScore = function (username, score) {
    Score.save ({username: username, points: score});
  };
}]);

app.controller('HomeCtrl', ['$scope', '$location', 'Passage', 
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

app.controller('InjectPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to passage using id from the button
    $scope.choosePassage = function(id) {
      $location.path('/inject-a-word/passages/' + id);
    };

  }
]);

app.controller('InjectPassageShowCtrl', ['$scope', '$location', '$routeParams', 'Passage', 'Response',
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
        $location.path('/inject-a-word/passages/' + passageId);
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
          $location.path('/stories');
        }
      );
      // Add 20 points to username's score if they have given a username
      if($scope.username !== 'random user' && $scope.username !== '') {
        $scope.saveScore($scope.username, 20);
      }
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

    // Redirect to passage from button press
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
    $scope.score = 0;
    $scope.bonus = 0;
    // If id is given, get passage from database
    if ($routeParams.id) {
      passageId = $routeParams.id;
      Passage.get({ id: passageId }, function(data) { 
        console.log(data);
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

app.controller('ProofreadPassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to passage with id from button
    $scope.choosePassage = function(id) {
      $location.path('/proofread-a-story/passages/' + id);
    };
  }
]);

app.controller('ProofreadPassageShowCtrl', ['$scope', '$location', '$routeParams', '$sce', 'Passage',
  function ($scope, $location, $routeParams, $sce, Passage) {
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

////////////////////////////////////////
//                                    //
// NEXT ITERATION: Not functional yet //
//                                    //
////////////////////////////////////////

app.controller('CompletePassagesCtrl', ['$scope', '$location', 'Passage',
  function ($scope, $location, Passage) {
    $scope.passages = Passage.query();

    // Redirect to show page for passage
    $scope.choosePassage = function(id) {
      $location.path('/complete-a-story/passages/' + id);
    };
  }
]);

app.controller('CompletePassageShowCtrl', ['$scope', '$location', '$routeParams', '$sce', 'Passage',
  function ($scope, $location, $routeParams, $sce, Passage) {
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