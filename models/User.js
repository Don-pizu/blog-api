// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');    // For harshing password

//User Schema
const userSchema = new mongoose.Schema ({
	username : {
		type: String,
		required: true,    //it is needed
		unique: true      // must be unique for each users
	},
	email : {
		type: String,
		required: true,    //it is needed
		unique: true      // must be unique for each users
	},
	password : {
		type: String,
		required: true,    //it is needed
		minlength: 4,           // minimum of 4 letters
	},
	role: { 
		type: String, 
		enum: ['user', 'admin'], 
		default: 'user' 
	}
});


// Password hashing before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password'))
		return next();          /// If password id not change

	const salt = await bcrypt.genSalt(10);   //Generate salt
	this.password = await bcrypt.hash(this.password, salt);  //Hash password
	next();
});


// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);     //using bcrypt to compare passwords
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);