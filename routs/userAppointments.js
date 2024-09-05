const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
const User = require('../modal/modal');

const database = require('../index.js');

const collection = database.collection("user");

console.log("datbaseName", collection)


// Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, CompanyName, TeamSize, phoneNo, email } = req.body;

    try {
        // Check if user already exists
        let user = await collection.findOne({ email });
        let phoneNoData = await collection.findOne({ phoneNo });
        if (user || phoneNoData) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ firstName, lastName, CompanyName, TeamSize, phoneNo, email });

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);

        // await user.save();
        console.log("user",user)
        await collection.insertOne(user);

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
