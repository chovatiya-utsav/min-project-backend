const express = require('express');
const router = express.Router();
// const User = require('../modal/modal');
const FormData = require('../modal/modal');


const database = require('../index.js');

const collection = database.collection("user");

// console.log("datbaseName", collection)


router.get('/resive', async (req, res) => {
    // const { name, email } = req.body;

    try {


        // Retrieve users
        const query = {}; // Empty query object to find all users
        const usersData = await collection.find(query).toArray();
        // console.log(usersData);
        
        return res.json(usersData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;