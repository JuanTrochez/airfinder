import { Promise } from 'mongoose';
import ErrorHelper from '../helpers/ErrorsHelper';

var User = require('../models/user');

//get all users
exports.findAll = function () {
	console.log('finding users...');
	return new Promise((success, error) => {
		User.find(function(err, users) {
			console.log("data user find all", err, users);
			if (err) {
				let errors = ErrorHelper.getErrorsFromObject(err.errors);
				error(errors);
			}
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
			if (err) {
				let errors = ErrorHelper.getErrorsFromObject(err.errors);
				error(errors);
			}
			success(user);
		});
	});
};

//create new user
exports.create = function(newUser) {
	console.log('creating user...');
	// console.log(newUser);
	let userModel = new User(newUser);
	return new Promise((success, error) =>  {
		userModel.save(function(err) {
			if (err) {
				// console.log(err);
				let errors = ErrorHelper.getErrorsFromObject(err.errors);
				error(errors);
			}
			newUser._id = userModel._id;
			success(newUser);
		});
	});
};

exports.findByCriterias = function(criteras) {
	console.log('finding user by criterias...');
	// console.log(criterias);
	return new Promise((success, error) => {
		User.find(criteras, function(err, user) {
			// console.log('data user find criterias', err, user);
			if (err) {
				let errors = ErrorHelper.getErrorsFromObject(err.errors);
				error(errors);
			}
			success(user);
		});
	});
}
