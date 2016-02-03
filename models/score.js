var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  scores: [{
    username: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    }
  }]
});

var Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;