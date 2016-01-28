var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  username: String,
  replacement: [{
    wordIndex: {
      type: Number,
      required: true
    },
    newWord: {
      type: String,
      required: true
    }
  }],
  passage: {
    type: Schema.Types.ObjectId,
    ref: 'Passage'
  }
});

var Response = mongoose.model('Response', ResponseSchema);
module.exports = Response;