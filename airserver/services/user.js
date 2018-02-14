var User = require('../models/user');

/**
 * GETTERS
 */

//find all users
exports.findAll = function () {
	console.log('finding all users...');
	let query = User.find();
	return query.exec();
};

//find user by id
exports.findById = function(id) {
	console.log('find user by id... ', id);
	let query = User.findById(id);
	return query.exec();
};

//find multiple user by criterias
exports.findByCriterias = function(criterias) {
	console.log('finding user by criterias...');
	// console.log(criterias);
	let query = User.find(criterias);
	return query.exec();
}

//find single user by criterias
exports.findOneByCriterias = function(criterias) {
	console.log('finding single user by criterias...');
	// console.log(criterias);
	let query = User.findOne(criterias);
	return query.exec();
}


/**
 * WRITERS
 */

//create new user
exports.create = function(newUser) {
	console.log('creating user...');
	// console.log(newUser);
	let userModel = new User(newUser);
	return userModel.save();
};
