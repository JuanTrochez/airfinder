import { Promise } from 'mongoose';

var User = require('../models/user');

//get all users
exports.findAll = function () {
	console.log('finding users...');
	return new Promise((success, error) => {
		User.find(function(err, users) {
			console.log("data user find all", err, users);
			if (err) error("Une erreure est survenue lors de la creation : " + err.message);
			success(users);
		});
	});
};

//get user by id
exports.findById = function(id) {
	console.log('find user by id... ', id);
	return new Promise((success, error) => {
		User.findById(id).exec(function(err, user) {
			console.log('find user by id', err, user);
			if (err) error("Une erreure est survenue lors de la creation : " + err.message);
			success(user);
		});
	});
};

//create new user
exports.create = function(newUser) {
	console.log('creating user...');
	console.log(newUser);
	let userModel = new User(newUser);
	return new Promise((success, error) =>  {
		userModel.save(function(err) {
			if (err) error("Une erreure est survenue lors de la creation : " + err.message);
			success(true);
		});
	});
};
