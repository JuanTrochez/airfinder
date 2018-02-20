import ErrorHelper from '../helpers/ErrorsHelper';
import ErrorsMessage from '../config/errors';
let UserService = require('../services/user');

const defaultResponse = {
	valid: false,
	message: ErrorsMessage.defaultMessage,
	errors: [],
	data: []
}

//user index page
exports.index = function(req, res) {
	let response = defaultResponse;
	UserService.findAll()
	.then(function (data) {
		console.log('users finally founded');
		response.valid = data.length > 0;
		response.message = response.valid ? 'Des utilisateurs ont bien été trouvé' : 'Aucun utilisateur trouvé';
		response.data = data;
		res.json(response);
	}).catch((errors) => {
		console.error(errors);
	});
};

// Display list of all users.
exports.user_list = function(req, res) {
	let response = defaultResponse;
	UserService.findAll()
		.then((data) => {
			console.log('users finally founded');
			response.valid = data.length > 0;
			response.message = response.valid ? 'Des utilisateurs ont bien été trouvé' : 'Aucun utilisateur trouvé';
			response.data = data;
			res.json(response);
		}).catch((errors) => {
			console.error(errors);
		});
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: user detail: ' + req.params.id);
};

// Handle user create on POST.
exports.user_create_post = function(req, res) {
	let response = defaultResponse;
	let user = req.body;
	user.password = user.isFacebook ? 'testmdp' : user.password;
	UserService.create(user)
	.then((data) => {
		console.log('user created ', data);
		response.valid = true;
		response.data = data;
		response.message = 'L\'utilisateur a bien été créé';
		res.json(response);
	}).catch((data) => {
		console.error("error while creating user");
		response.errors = ErrorHelper.getErrorsFromObject(data.errors);
		response.code = ErrorsMessage.codes.displayErrors;
		res.json(response);
	});
};

const checkUserCredentials = function(user, authData) {
	let response = defaultResponse;
	//user log without facebook
	if (!authData.isFacebook) {
		if (user.isFacebook) {
			//user is facebook and want to connect without fb
			response.valid = false;
			response.message = 'Cet email est lié à facebook';
			response.code = ERROR_CODES.default;
			console.log('connecting login without fb account');
			return response;
		}
		//on verifie son mdp
		response.valid = (user.password === authData.password);
		response.message = response.valid ? 'Good good' : 'Identifiant/Mot de passe incorrect';
		response.code = ErrorsMessage.codes.default;
		return response;
	}
	//user log via fb and the user retrieved isn't facebook connected
	if (!user.isFacebook) {
		//send error email is already used without fb account
		response.valid = false;
		response.message = 'Cet email est déjà utilisé';
		response.code = ERROR_CODES.default;
		return response;
	}

	//user is facebook and log via fb
	//user is good
	response.valid = true;
	response.message = 'Good good';
	return response;
};

exports.user_login_post = function(req, res) {
	let response = defaultResponse;
	let user = {
		email: req.body.email
	}
	UserService.findOneByCriterias(user)
	.then((data) => {
		user = req.body;
		console.log('request data', user);
		console.log('user data', data);
		if (data) {
			response = checkUserCredentials(data, user);
		} else {
			response.valid = false;
			response.message = 'Vous n\'êtes pas encore inscrit';
			response.code = user.isFacebook ? ErrorsMessage.codes.createFbAccount : ErrorsMessage.codes.default;
			console.log("code de reponse : ",user.isFacebook,response.code);
		}
		response.data = data;
		res.json(response);
	})
	.catch((errors) => {
		// console.log(errors);
		response.errors = ErrorHelper.getErrorsFromObject(data.errors);
		response.code = ERROR_CODES.errors;
		res.json(response);
	});
}

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: user delete POST');
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: user update POST');
};


//Handle user request for contacting another
exports.user_contact_get = function(req, res) {
	res.send('NOT IMPLEMENTED: user contact get');
};


exports.user_search = function(req, res) {
	let response = defaultResponse;
	let searchString = new RegExp(req.body.search, 'i');
	let criterias = { $or:[{'email': searchString}, {'name':searchString}, {'firstname':searchString} ]};
	UserService.findByCriterias(criterias)
	.then((datas) => {
		console.log('search request datas', datas);
		if (datas.length >0) {
			console.log('found users');
			response.valid = true;
			response.message = 'found users';
		} else {
			response.valid = false;
			response.message = 'Aucun utilisateur trouvé';
			response.code = ErrorsMessage.codes.default;
		}
		response.data = datas;
		res.json(response);
	})
	.catch((errors) => {
		// console.log(errors);
		response.errors = ErrorHelper.getErrorsFromObject(data.errors);
		response.code = ERROR_CODES.errors;
		res.json(response);
	});
}
