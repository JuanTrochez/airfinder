var HistoryStatus = require('../models/historyStatus');

/**
 * GETTERS
 */

//find all historyStatuss
exports.findAll = function () {
	console.log('finding all historyStatuss...');
	let query = HistoryStatus.find();
	return query.exec();
};

//find historyStatus by id
exports.findById = function(id) {
	console.log('find historyStatus by id... ', id);
	let query = HistoryStatus.findById(id);
	return query.exec();
};

//find multiple historyStatus by criterias
exports.findByCriterias = function(criterias) {
	console.log('finding historyStatus by criterias...');
	// console.log(criterias);
	let query = HistoryStatus.find(criterias);
	return query.exec();
}

//find single historyStatus by criterias
exports.findOneByCriterias = function(criterias) {
	console.log('finding single historyStatus by criterias...');
	// console.log(criterias);
	let query = HistoryStatus.findOne(criterias);
	return query.exec();
}


/**
 * WRITERS
 */

//create new historyStatus
exports.create = function(newhistoryStatus) {
	console.log('creating historyStatus...');
	// console.log(newhistoryStatus);
	let historyStatusModel = new HistoryStatus(newhistoryStatus);
	return historyStatusModel.save();
};

//create new historyStatus
exports.insert = function(newhistoryStatus) {
	console.log('creating historyStatus...');
	// console.log(newhistoryStatus);
	return HistoryStatus.insert(newhistoryStatus);
};
