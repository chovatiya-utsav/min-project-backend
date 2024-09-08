const mongoose = require('mongoose');

const indestry = mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true
  },
  description: {
    type: String,
    require: true
  },
  indestryImage: {
    type: String,
    require: true
  },
  date: {
    type: Date,
  }
});


const Industry = mongoose.model('addimage', indestry);
module.exports = Industry;
