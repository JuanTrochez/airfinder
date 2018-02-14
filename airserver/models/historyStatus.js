import mongoose, { Schema } from "mongoose";
let uniqueValidator = require('mongoose-unique-validator');

var historyStatusSchema = new Schema({
	name: {
		type: String,
	},
});

historyStatusSchema.plugin(uniqueValidator, { message: 'La valeur est déjà utilisée' });

module.exports = mongoose.model("HistoryStatus", historyStatusSchema);
