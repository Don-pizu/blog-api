// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { makePost, getAllPosts, updatePost, deletePost } = require('../controllers/postController');



/**
 * @swagger
 * /post:
 *   post:
 *     summary: Perform posting on blog
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post successfully created
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /getposts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Posts]
 *     responses:
 *        200:
 *          description: A list of all posts
 */



/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */



router.post('/post', protect, makePost);
router.get('/getposts', getAllPosts);
router.put('/update/:id', protect, updatePost);
router.delete('/delete/:id', protect, deletePost);

module.exports = router;