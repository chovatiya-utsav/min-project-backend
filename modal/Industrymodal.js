const mongoose = require("mongoose");

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

const DataModel = mongoose.model("indestryData", indestry);

module.exports = DataModel;
