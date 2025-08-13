// routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

// Controller for the protected route
const proAdmin = (req, res) => {
    res.json({ message: 'Protected route' });
};

// Only authenticated users can access this
router.get('/protected', protect, proAdmin);


module.exports = router;