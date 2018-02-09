var User = require('../models/users');


//get all users
exports.findAll = function () {
	User.find({}, function(err, users) {
		if (err) return handleError(err);
		console.log('findAllUsers', users);
		return users;
	});
};

//get user by id
exports.findById = function(id) {
	User.findById(id).exec(function(err, user) {
		if (err) return handleError(err);
		console.log('get user by id', user);
		return user;
	});
};

//create new user
exports.create = function(user) {
	console.log('creating user...');
	let user = new User(user);
	user.save(function(err) {
		if (err) return handleError(err);

		//user saved
		return true;
	});
};
