// controllers/authController.js

const User = require ('../models/User');
const jwt = require ('jsonwebtoken');

//Generate JWT Token
const createToken = (user) => {
	return jwt.sign (
		{id: user._id, role: user.role},
		process.env.JWT_SECRET,
		{expiresIn: '1h'}
		);
};


// Register a new user
exports.register = async (req, res) => {
	const { username, email, password, role } = req.body;

	if (!username || !email || !password)
		return res.status(400).json({ message: 'All the fields are required'});


	  // Check if username already exists
	const userExists = await User.findOne({ username: username });
	if (userExists) 
		return res.status(400).json({ message: 'Username already exists'});

	  // Check if email already exists
	const eExists = await User.findOne({ email: email });
	if (eExists) 
		return res.status(400).json({ message: 'Email already exists'});


	const user = await User.create({ 
		username: username, 
		email: email, 
		password, 
		role: role === 'admin' ? 'admin' : 'user'
	});

	res.status(201).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		role: user.role, 
		token: createToken(user)
	});
};


//Login user
exports.login = async (req, res) => {
	const { username, email, password } = req.body;

	const user = await User.findOne({ username: username });
	if( user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			token: createToken(user)
		});
	} else {
		return res.status(401).json({ message: 'Invalid Credentials'});
	}
};