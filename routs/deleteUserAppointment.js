const express = require('express');
const app = express();
const router = express.Router();
const User = require('../modal/modal'); // Adjust the path if needed
const database = require('../index.js');
const { ObjectId } = require('mongodb'); // Import ObjectId to convert string to ObjectId

const collection = database.collection("user");

app.use(express.json());

router.post('/delete', async (req, res) => {
    const { userid } = req.body;

    try {
        // Ensure userid is converted to ObjectId
        const objectId = new ObjectId(userid);

        // Perform the delete operation
        const result = await collection.findOneAndDelete({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user: ' + err.message);
    }
});

module.exports = router;
