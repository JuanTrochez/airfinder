let HistoryStatusService = null;

//user index page
exports.index = function(req, res) {
	let response = defaultResponse;
	HistoryStatusService.findAll()
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