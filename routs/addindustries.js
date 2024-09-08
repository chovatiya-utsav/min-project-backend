const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const DataModel = require('../modal/Industrymodal.js');
const fs = require('fs');
const moment = require('moment')

const database = require('../index.js');

const collection = database.collection("indestryData");

const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/indestryimages'); // Save images in the 'public' directory
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `indestryimages-${Date.now()}_${file.originalname}`); // Rename the file
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



router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;

        const date = moment(new Date()).format("DD-MMM-YYYY"); // Formatting the date

        const existImage = await collection.findOne({ title });

        if (existImage) {
            fs.unlinkSync(`./public/indestryimages/${req.file.filename}`);
            return res.json({ msg: "Industry already exists" });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newData = {
            title,
            description,
            indestryImage: req.file.filename,
            date,
        };

        const result = await collection.insertOne(newData);
        res.status(200).json({ msg: "industries successfully submited" }); // Return the inserted document

    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: 'Failed to save data' });

    }
});

app.use('/public', express.static(path.join(__dirname, 'public')));


module.exports = router;
