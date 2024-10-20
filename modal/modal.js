const mongoose = require("mongoose");

// Appointment schema 

const formDataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    CompanyName: String,
    TeamSize: String,
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("user", formDataSchema);
