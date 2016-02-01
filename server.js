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
mongoose.connect('mongodb://localhost/madlibs');

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

var ACCEPTABLE_POS = ['CD', 'IN', 'JJ', 'JJR', 'JJS', 'NN', 'NNP', 'NNPS', 'NNS', 'PP$', 'PRP', 'RB', 'RBR', 'RBS', 'UH', 'VB', 'VBD', 'VBG', 'VBP', 'VBZ'];

app.get('/api/passages/:id', function (req, res) {
  var passageId = req.params.id;
  Passage.findOne({ _id: passageId }, function (err, foundPassage) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // POS
      var words = foundPassage.text.split(' ');
      // Take 10% of the words in the story
      var numOfWordsToReplace = Math.floor(words.length / 10);
      // Create a range from 0 to words.length-1
      var range = Array.apply(null, Array(words.length)).map(function (_, i) {return i;});
      shuffledRange = shuffle(range);
      // Display only those words
      wordsToReplace = [];
      var index = 0;
      var tagger = new pos.Tagger();
      var wordTag;
      while (wordsToReplace.length < numOfWordsToReplace) {
        wordTag = tagger.tag([words[shuffledRange[index]]])[0][1];
        if(ACCEPTABLE_POS.indexOf(wordTag) !== -1) {
          wordsToReplace.push({ wordIndex: shuffledRange[index], word: words[shuffledRange[index]], tag: wordTag });
        }
        index++;
      }
      res.json({ passage: foundPassage, wordsToReplace: wordsToReplace });
    }
  });
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
app.listen(3000, function() {
  console.log('server started');
});