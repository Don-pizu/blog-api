// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { makePost, getAllPosts, updatePost, deletePost } = require('../controllers/postController');


router.post('/post', protect, makePost);
router.get('/getposts', getAllPosts);
router.put('/update/:id', protect, updatePost);
router.delete('/delete/:id', protect, deletePost);

module.exports = router;