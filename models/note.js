'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// set all known trail api param to required: true
const noteSchema = new mongoose.Schema({
  ascent: Number,
  conditionDate: String,
  conditionDetails: String,
  conditionStatus: String,
  descent: Number,
  difficulty: String,
  high: Number,
  id: Number,
  imgMedium: String,
  imgSmall: String,
  imgSmallMed: String,
  imgSqSmall: String,
  latitude: Number,
  length: Number,
  location: String,
  longitude: Number,
  low: Number,
  name: String,
  starVotes: Number,
  stars: Number,
  summary: String,
  type: String,
  url: String,
  // placeholder = admin
  user: {type: String, required: false, default: "admin"},
  comment: {type: String, required: false, default: ""},
  date: {type: String, required: false, default: ""},
  created: {
    type: Date,
    default: Date.now
  }
});

// noteSchema.index({
//   title: 'text',
//   content: 'text'
// });

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Note = mongoose.model('Note', noteSchema);
// module.exports = mongoose.model('Note', noteSchema);
module.exports = Note;