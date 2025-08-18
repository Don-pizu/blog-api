// controllers/commentController.js

const Comment = require('../models/comment');


//POST make comment
exports.addComment = async (req, res, next) => {
	try {
		const { comment } = req.body;
		const { postId } = req.params;

		if (!comment || !postId) {
			return res.status(400).json({ message: 'Comment and Post Id are required'});
		}

		// creeate comment
		const createComment = await Comment.create({
			comment,
			post: postId,
			user: req.user._id,
		})

		res.status(201).json({
			message: 'Comment added successfully',
			createComment
		})

	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};


//GET    get comment by post ID
exports.getCommentById = async (req, res, next) => {
	try {
		const getComment = await Comment.find({ post: req.params.postId})
											.populate('user', 'username email')
											.sort({createdAt: -1});

		if(!getComment) {
			return res.status(404).json({ message: 'Comment not found'});
		}

		res.json(getComment);
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};


//PUT      Update comment by author and admin

exports.updateComment = async (req, res, next) => {
	try {
		const getComment = await Comment.findById(req.params.id);

		if(!getComment || getComment.length === 0) {
			return res.status(404).json({ message: 'Comment not found'});
		}

		// check for author and admin
		const notAuthor = getComment.user.toString() !== req.user._id.toString();
		const notAdmin = req.user.role !== 'admin';

		if (notAuthor && notAdmin) {
			return res.status(403).json({ message: 'Not authorized to update comment'});
		}  


		// Update Comment
		const { comment } = req.body;
		if (comment)
			getComment.comment = comment;

		await getComment.save();
		res.status(200).json(getComment);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//DELETE        Delete comment by author and admin
exports.deleteComment = async (req, res, next) => {
	try {
		const delGetComment = await Comment.findById(req.params.id);

		if(!delGetComment) {
			return res.status(404).json({ message: 'Comment not found'});
		}

		// check for author and admin
		const notAuthor = delGetComment.user.toString() !== req.user._id.toString();
		const notAdmin = req.user.role !== 'admin';

		if (notAuthor && notAdmin) {
			return res.status(403).json({ message: 'Not authorized to delete comment'});
		}  


		// Delete Comment
		await delGetComment.deleteOne();
		res.status(200).json({ message: 'Comment deleted successfully' });
		
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};