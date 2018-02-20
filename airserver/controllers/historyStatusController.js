import ErrorHelper from '../helpers/ErrorsHelper';
import ErrorsMessage from '../config/errors';
let HistoryStatusService = require('../services/historyStatus');

const defaultResponse = {
	valid: false,
	message: ErrorsMessage.defaultMessage,
	errors: [],
	data: []
}

//history status index page
exports.index = function(req, res) {
	let response = defaultResponse;
	HistoryStatusService.findAll()
		.then((data) => {
			console.log('history status finally founded', data);
			response.valid = data.length > 0;
			response.message = response.valid ? 'Des status ont bien été trouvé' : 'Aucun status trouvé';
			response.data = data;
			res.json(response);
		}).catch((errors) => {
			console.error(errors);
		});
};


/**
 * CREATE METHODS
 */

//create single status
exports.historyStatus_create_post = function(req, res) {
	let response = defaultResponse;
	let historyStatus = req.body;
	HistoryStatusService.create(historyStatus)
	.then((data) => {
		console.log('history status created ', data);
		response.valid = true;
		response.data = data;
		response.message = 'L\'utilisateur a bien été créé';
		res.json(response);
	}).catch((data) => {
		console.error("error while creating history status");
		response.errors = ErrorHelper.getErrorsFromObject(data.errors);
		response.code = ErrorsMessage.codes.displayErrors;
		res.json(response);
	});
};

//create multiple status
exports.historyStatus_create_multiple_post = function(req, res) {
	let response = defaultResponse;
	let historyStatus = req.body.statusCollection;
	console.log('historyStatus list', historyStatus);
	historyStatus.forEach((element, index) => {
		// let status = (typeof element === 'string') ? JSON.parse(element) : element;
		console.log('type of element', typeof element);
		HistoryStatusService.create(element)
		.then((data) => {
			console.log('history status created ', data);
			response.valid = true;
			response.data.push(data);
			response.message = 'Les status ont bien été créés';
			if (index === historyStatus.length - 1) {
				res.json(response);
			}
		}).catch((data) => {
			console.error("error while creating history status");
			response.errors = ErrorHelper.getErrorsFromObject(data.errors);
			response.code = ErrorsMessage.codes.displayErrors;
			res.json(response);
		});
	});

};
/**
 * END CREATE METHODS
 */
