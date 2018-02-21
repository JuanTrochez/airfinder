import mongoose, { Schema } from "mongoose";
let uniqueValidator = require('mongoose-unique-validator');

var historySchema = new Schema({
	name: {
		type: String,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	historyStatus: { type: Schema.Types.ObjectId, ref: "HistoryStatus" },
});

historySchema.plugin(uniqueValidator, { message: 'La valeur est déjà utilisée' });

module.exports = mongoose.model("History", historySchema);
