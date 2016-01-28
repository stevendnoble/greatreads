// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    request = require('request'),
    mongoose = require('mongoose');

// require models
var Passage = require('./models/passage'),
    Response = require('./models/response');

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

app.get('/api/passages/:id', function (req, res) {
  // ...
});

app.put('/api/passages/:id', function (req, res) {
  // ...
});

app.delete('/api/passages/:id', function (req, res) {
  // ...
});

app.get('/api/responses', function (req, res) {
  // ...
});

app.post('/api/responses', function (req, res) {
  // ...
});

app.get('/api/responses/:id', function (req, res) {
  // ...
});

app.put('/api/responses/:id', function (req, res) {
  // ...
});

app.delete('/api/responses/:id', function (req, res) {
  // ...
});

// catchall route
app.get('*', function (req, res) {
  res.render('index');
});


// listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});