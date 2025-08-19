// controllers/postController.js

const Post = require('../models/post');
const User = require('../models/User');


//POST   blog posts
exports.makePost = async (req, res, next) => {
	try {
		const { title, content, tags} = req.body;
		const user = req.user;

		//validate title & content
		if (!title || !content) {
			return res.status(400).json({ message: 'Title and Content are required'});
		}

		 if (!user) {
	      return res.status(401).json({ message: 'User not authenticated' });
	    }

		//fetch user data
		const dbUser = await User.findById(user._id);
		if (!dbUser) {
			return res.status(400).json({ message: 'User not found'});
		}

		// create post
		const createPost = await Post.create({
			user: dbUser._id,
			title,
			content,
			tags: tags  || [],
		});

		res.status(201).json({
			message: 'Post created successfylly',
			createPost
		});

	} catch (err) {
		console.error("Post creation error:", err);
    	res.status(500).json({ message: err.message || 'Internal server error' });
	}
};

//GET all post (public)
exports.getAllPosts = async (req, res, next) => {
	try {
		const { page = 1, limit = 10, author, tags, date } = req.query;
		const query = {};     // use for filtering

		const skip = (page - 1) * limit;       

		if (author) {
			query.user = author;     
		}

		if(tags) {
			query.tags = { $in: tags.split(',') };
		}

		if (date) {
			query.createdAt = { $gte: new Date(date) };
		}


		const posts = await Post.find(query)
									.populate('user', 'username email')
									.skip(skip)
									.limit(parseInt(limit))
									.sort({ createdAt: -1 });

		const totalPosts = await Post.countDocuments(query);
		const totalPages = Math.ceil(totalPosts / limit);

		res.json({
			posts,
			Page: parseInt(page),
			totalPages,
			totalPosts
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//PUT  Update post by author and admin
exports.updatePost = async (req, res, next) => {
	try{
		const getPost = await Post.findById(req.params.id);

		if (!getPost) {
			return res.status(404).json({ message: 'Post not found'});
		} 

		//check if accessing user is author or admin
		const notAuthor = getPost.user.toString() !== req.user._id.toString();  //post owerner  !== the user requesting
		const notAdmin = req.user.role !== 'admin';

		if (notAuthor && notAdmin ) {
			return res.status(403).json({ message: 'Not authorized to update post'});
		}

		//Update post
		
		/*
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true}
		);

		res.status(200).json(updatedPost);
		*/

		const { title, content, tags } = req.body;
		if(title)
			getPost.title = title;
		if(content)
			getPost.content = content;
		if(tags)
			getPost.tags = tags;

		await getPost.save();
		res.status(200).json(getPost);

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//DELETE      Delete post by author and admin
exports.deletePost = async (req, res, next) => {
	try {
		const getPost = await Post.findById(req.params.id)

		if (!getPost) {
			return res.status(404).json({ message: 'Post not found'});
		} 

		//check if accessing user is author or admin
		const notAuthor = getPost.user.toString() !== req.user._id.toString();
		const notAdmin = req.user.role !== 'admin';

		if (notAuthor && notAdmin ) {
			return res.status(403).json({ message: 'Not authorized to update post'});
		}

		//Delete Post
		await getPost.deleteOne();
		res.status(200).json({ message: 'Post deleted successfully'});

	} catch (err) {
		res.status(500).json({ message: err.message});
	}
};