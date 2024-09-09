const express = require("express");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const FormData = require('./modal/modal');
const multer = require('multer');
const path = require('path');
const moment = require("moment");
const fs = require('fs');
const { ObjectId } = require('mongodb');
const DataModel = require('./modal/Industrymodal');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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

//delete user appoinyment api

const deleteuser = require('./routs/deleteUserAppointment');
app.use('/api/deleteUserAppointment', deleteuser);


//indestry add api

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image'); // Save images in the 'public' directory
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${Date.now()}_${file.originalname}`); // Rename the file
  }
});

// const upload = multer({ storage: storage });

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // 500KB file size limit
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

const collection = database.collection("industriesData");


app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const existimage = await collection.findOne({ title: req.body.title });
    const { title, description } = req.body;

    const date = moment(new Date()).format("DD-MM-YYYY");

    if (existimage) {
      console.log("exsit", existimage)
      res.send({ status: 403, msg: "indstry is exest" });
      fs.unlinkSync(`./public/image/${req.file.filename}`);
      console.log('filename', req.file.filename)
    } else {
      if (!req.file) {
        // Return early if no file is uploaded, ensuring no further code runs
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const newData = new DataModel({
        title,
        description,
        indestryImage: req.file.filename,
        date: date
      });


      const savedData = await collection.insertOne(newData);
      res.status(200).json(savedData);
    }

  } catch (error) {
    // If an error occurs, send the error response
    res.status(500).json({ error: 'Failed to save data' });
  }
});



app.use('/public', express.static(path.join(__dirname, 'public')));



// Set up Mongoose model for storing image details

app.get('/api/display', async (req, res) => {
  try {

    const query = {}; // Empty query object to find all users
    const usersData = await collection.find(query).toArray();
    // const industries = await DataModel.find({});
    res.status(200).json(usersData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/api/delete', async (req, res) => {
  try {
    const userid = req.body.id;
    const objectId = new ObjectId(userid);

    console.log("id", objectId)
    // const data = await collection.findOneAndDelete({ _id: objectId });
    const data = await collection.findOneAndDelete({ _id: objectId });
    console.log("data", data)

    if (data) {
      fs.unlinkSync(`./public/image/${data.indestryImage}`);
      res.json({ msg: "Industry deleted" });
    } else {
      res.status(404).json({ msg: "Industry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete industry' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${port}`);
});
