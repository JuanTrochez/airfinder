let User = require('../models/user');
let UserService = require('../services/user');

const ERROR_DEFAULT_MESSAGE = 'Une erreur est survenue lors de la requête';

//user index page
exports.index = function(req, res) {
	let response = {
		valid: false,
		message: ERROR_DEFAULT_MESSAGE
	};
	UserService.findAll()
		.then((data) => {
			console.log('users finally founded');
			response.valid = data.length > 0;
			response.message = response.valid ? 'Des utilisateurs ont bien été trouvé' : 'Aucun utilisateur trouvé';
			response.data = data;
			res.json(response);
		}).catch((message) => {
			console.error(message);
		});
};

// Display list of all users.
exports.user_list = function(req, res) {
	let response = {
		valid: false,
		message: ERROR_DEFAULT_MESSAGE
	};
	UserService.findAll()
		.then((data) => {
			console.log('users finally founded');
			reponse.valid = data.length > 0;
			response.message = response.valid ? 'Des utilisateurs ont bien été trouvé' : 'Aucun utilisateur trouvé';
			response.data = data;
			res.json(response);
		}).catch((message) => {
			console.error(message);
		});
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: user detail: ' + req.params.id);
};

// Handle user create on POST.
exports.user_create_post = function(req, res) {
	let response = {
		valid: false,
		message: ERROR_DEFAULT_MESSAGE
	};
	UserService.create(req.body).then((data) => {
		console.log('user created ', data);
		response.valid = data;
		response.message = 'L\'utilisateur a bien été créé';
		res.json(response);
	}).catch((message) => {
		console.error(message);
	});
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: user delete POST');
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: user update POST');
};
