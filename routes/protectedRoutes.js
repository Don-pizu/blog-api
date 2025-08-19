// routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

// Controller for the protected route
const proAdmin = (req, res) => {
    res.json({ message: 'Protected route' });
};


/**
 * @swagger
 * /protected:
 *   get:
 *     summary: get protected route
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected route
 */



// Only authenticated users can access this
router.get('/protected', protect, proAdmin);


module.exports = router;