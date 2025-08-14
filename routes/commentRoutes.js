// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { addComment, getCommentById, updateComment, deleteComment } = require('../controllers/commentController');


router.post('/:postId/comment', protect, addComment);
router.get('/getcomment/:postId', getCommentById);
router.put('/update/:id', protect, updateComment);
router.delete('/commentdelete/:id', protect, deleteComment);

module.exports = router;