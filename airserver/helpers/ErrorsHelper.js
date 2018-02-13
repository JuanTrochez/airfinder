
exports.getErrorsFromObject = function(object) {
	let errors = [];
	Object.keys(object).forEach(function (key) {
		let error = object[key];
		errors.push({
			field: error.path,
			message: error.message
		});
	});
	return errors;
}
