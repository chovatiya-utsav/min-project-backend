const mongoose = require("mongoose");

// Define a schema and model for the data

const formDataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    CompanyName: String,
    TeamSize: String,
    phoneNo: String,
    email: String,
    // other fields
});

module.exports = mongoose.model("user", formDataSchema);
