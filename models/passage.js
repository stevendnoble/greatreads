var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PassageSchema = new Schema({
  title: {
    type: String,
    required: true    
  },
  text: {
    type: String,
    required: true
  },
  submittedBy: String
});

var Passage = mongoose.model('Passage', PassageSchema);
module.exports = Passage;