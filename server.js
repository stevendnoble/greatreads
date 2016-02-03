// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    request = require('request'),
    mongoose = require('mongoose'),
    pos = require('pos');

// require models
var Passage = require('./models/passage'),
    Response = require('./models/response');

var seedPassages = require('./seeds/passages');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/madlibs'
);

// API routes

app.get('/api/passages', function (req, res) {
  Passage.find(function (err, allPassages) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(allPassages);
    }
  });
});

app.post('/api/passages', function (req, res) {
  var newPassage = new Passage(req.body);
  newPassage = newPassage.replace(/\n/g, ' ');
  newPassage = newPassage.replace(/\s\s+/g, ' ');
  newPassage.save(function (err, savedPassage) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedPassage);
    }
  });
});

function shuffle(array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function scramble (word) {
  var scrambledWord = word.split('');
  scrambledWord = shuffle(scrambledWord);
  scrambledWord = scrambledWord.join('');
  return scrambledWord;
}

function misspell (word) {
  var option = word.length % 3;
  // Get random letter, not the last letter of the word
  var randLetter;
  do {
    randLetter = Math.floor(Math.random() * (word.length-1));
  } while (word[randLetter] === word[randLetter+1]);
  word = word.split('');
  if (option === 1) {
    // switch two letters
    var temp = word[randLetter];
    word[randLetter] = word[randLetter + 1];
    word[randLetter+1] = temp;
  } else if (option === 2) {
    // change a letter to a different letter
    var letterMap = {
      a: 'ai',
      b: 'bb',
      c: 'k',
      d: 's',
      e: 'i',
      f: 'th',
      g: 'gg',
      h: 'g',
      i: 'e',
      j: 'g',
      k: 'c',
      l: 'll',
      m: 'n',
      n: 'm',
      o: 'u',
      p: 'pp',
      q: 'c',
      r: 't',
      s: 'c',
      t: 'tt',
      u: 'o',
      v: 'w',
      w: 'v',
      x: 'z',
      y: 'ie',
      z: 's'
    };
    word[randLetter] = letterMap[word[randLetter]];
  } else {
    // eliminate a letter
    word.splice(randLetter, 1);
  }
  return word.join('');
}

var ACCEPTABLE_POS = ['CD', 'IN', 'JJ', 'JJR', 'JJS', 'NN', 'NNP', 'NNPS', 'NNS', 'PP$', 'PRP', 'RB', 'RBR', 'RBS', 'UH', 'VB', 'VBD', 'VBG', 'VBP', 'VBZ'];

app.get('/api/passages/:id', function (req, res) {
  var passageId = req.params.id;
  var result = {};
  Passage.findOne({ _id: passageId }, function (err, foundPassage) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // POS
      result.passage = foundPassage;
      var words = foundPassage.text.split(' ');
      // Take 10% of the words in the story
      var tenPercentOfWords = Math.floor(words.length / 10);
      result.totalQuestions = tenPercentOfWords;
      // Create a range from 0 to words.length-1
      var range = Array.apply(null, Array(words.length)).map(function (_, i) {return i;});
      shuffledRange = shuffle(range);
      // Build injectWords: Display only those words which we want in Inject-a-Word
      var tagger = new pos.Tagger();
      var wordTag, testWord;
      var index = 0;
      result.injectWords = [];
      while (result.injectWords.length < tenPercentOfWords) {
        testWord = words[shuffledRange[index]];
        if((/^[a-zA-Z]+$/.test(testWord)) && testWord.length > 3) {
          wordTag = tagger.tag([testWord])[0][1];
          if(ACCEPTABLE_POS.indexOf(wordTag) !== -1) {
            result.injectWords.push({ wordIndex: shuffledRange[index], word: testWord, tag: wordTag });
          }
        }
        index++;
      }
      // Build unscrambleWords
      index = 0;
      result.unscrambleWords = [];
      while (result.unscrambleWords.length < tenPercentOfWords && index < words.length-1) {
        testWord = words[shuffledRange[index]];
        if((/^[a-zA-Z]+$/.test(testWord)) && testWord.length > 3) {
          result.unscrambleWords.push({ wordIndex: shuffledRange[index], word: testWord, scrambledWord: scramble(testWord) });
        }
        index++;
      }
      // Build misspelledWords
      index = 0;
      result.misspelledWords = [];
      testArray = [];
      while (result.misspelledWords.length < tenPercentOfWords && index < words.length-1) {
        testWord = words[shuffledRange[index]];
        if((/^[a-zA-Z]+$/.test(testWord)) && testWord.length > 3) {
          if(testArray.indexOf(testWord) === -1) {
            result.misspelledWords.push({ wordIndex: shuffledRange[index], word: testWord, misspelledWord: misspell(testWord) });
            testArray.push(testWord);
          }
        }
        index++;
      }
      // Respond with json object
      res.json(result);
    }
  });
  // .exec(function () {
  //   res.json(result);
  // });
});

// app.put('/api/passages/:id', function (req, res) {
// });
// app.delete('/api/passages/:id', function (req, res) {
// });

app.get('/api/responses', function (req, res) {
  Response.find()
    .populate('passage')
    .exec(function (err, allResponses) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(allResponses);
      }
    }
  );
});

app.post('/api/responses', function (req, res) {
  var newResponse = new Response(req.body);
  newResponse.save(function (err, savedResponse) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedResponse);
    }
  });
});

// app.get('/api/responses/:id', function (req, res) {
// });
// app.put('/api/responses/:id', function (req, res) {
// });
// app.delete('/api/responses/:id', function (req, res) {
// });

// catchall route
app.get('*', function (req, res) {
  res.render('index');
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});