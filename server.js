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
    Response = require('./models/response'),
    Score = require('./models/score');

var wordFunctions = require('./serverscripts/wordFunctions.js');

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
  'mongodb://localhost/wordwizzerd'
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
  newPassage.text = newPassage.text.replace(/\n/g, ' ');
  newPassage.text = newPassage.text.replace(/\s\s+/g, ' ');
  newPassage.save(function (err, savedPassage) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedPassage);
    }
  });
});

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
      shuffledRange = wordFunctions.shuffle(range);
      // Build injectWords: Display only those words which we want in Grammaring
      var tagger = new pos.Tagger();
      var wordTag, testWord;
      var index = 0;
      result.injectWords = [];
      while (result.injectWords.length < tenPercentOfWords) {
        testWord = words[shuffledRange[index]];
        if((/^[a-zA-Z]+$/.test(testWord)) && testWord.length > 3) {
          wordTag = tagger.tag([testWord])[0][1];
          if(wordFunctions.ACCEPTABLE_POS.indexOf(wordTag) !== -1) {
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
          result.unscrambleWords.push({ wordIndex: shuffledRange[index], word: testWord, scrambledWord: wordFunctions.scramble(testWord) });
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
            result.misspelledWords.push({ wordIndex: shuffledRange[index], word: testWord, misspelledWord: wordFunctions.misspell(testWord) });
            testArray.push(testWord);
          }
        }
        index++;
      }
      // Respond with json object
      res.json(result);
    }
  });
});

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

app.get('/api/scores', function (req, res) {
  Score.find(function (err, allScores) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(allScores);
    }
  });
});

app.post('/api/scores', function (req, res) {
  Score.findOne({username: req.body.username}, function(err, foundScore) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (foundScore) {
        foundScore.points += Number(req.body.points);
        foundScore.save();
        res.json(foundScore);
      } else {
        var newScore = new Score(req.body);
        newScore.save();
        res.json(newScore);
      }
    }
  });
});

// catchall route
app.get('*', function (req, res) {
  res.render('index');
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});