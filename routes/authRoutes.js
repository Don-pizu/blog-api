// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * @swagger
 * /auth/register:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               type: object
 *               required:
 *                  - username
 *                  - email
 *                  - password
 *               properties:
 *                   username:
 *                      type: string
 *                   email:
 *                       type: string
 *                   password:
 *                       type: string
 *      responses:
 *         201:
 *           description: User registered successfully
 *         400:
 *           description: Validation error            
 * 
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and receive JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post('/register', register);
router.post('/login', login);

module.exports = router;