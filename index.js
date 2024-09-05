const express = require("express");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const FormData = require('./modal/modal');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb+srv://utsavchovatiya3:=C6j6k27Ug58LZqYm@user-db.shxkh.mongodb.net/?retryWrites=true&w=majority&appName=user-db"


const client = new MongoClient(uri);

client.connect();
const database = client.db("user-details");
module.exports = database;


mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));



// API endpoint to handle form submission
// app.post("/api/submit", async (req, res) => {
//   try {
//     // res.json(req.body);
//     // console.log(req.body);
//     const newFormData = new FormData(req.body);
//     const doc = await newFormData.save();
//     console.log(doc);
//     res.json(doc);
//   } catch (err) {
//     console.error(err);
//     res.send("Server Error");
//   }
// });

const userAppointments = require('./routs/userAppointments');
app.use('/api/userAppointments', userAppointments);


// app.get("/resive", async (req, res) => {
//     try {
//         const docs = await FormData.find({});
//         res.json(docs);
//     } catch (err) {
//         console.error(err);
//         res.send("Server Error");
//     }
// });

const displayUser = require('./routs/displayUser');
app.use('/api/displayUser', displayUser);

const deleteuser = require('./routs/deleteUserAppointment');
app.use('/api/deleteUserAppointment', deleteuser);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${port}`);
});
