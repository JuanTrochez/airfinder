import mongoose, { Schema } from "mongoose";
let uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Le nom est obligatoire'],
	},
	firstname: {
		type: String,
		required: [true, 'Le prénom est obligatoire'],
	},
	password: {
		type: String,
		required: [true, 'Le mot de passe est obligatoire'],
	},
	isFacebook: {
		type: Boolean,
		default: false,
	},
	email: {
		type: String,
		unique: true,
		validate: {
			validator: function(v) {
				let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				return re.test(v);
			},
			message: 'L\'email n\'est pas valide',
		},
		required: [true, 'L\'email est obligatoire'],
	},
	isOnline: {
		type: Boolean,
		default: true,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	friends: [{ type: Schema.Types.ObjectId, ref: "Friend" }],
	position: [{ type: Schema.Types.ObjectId, ref: "Position" }],
	history: [{ type: Schema.Types.ObjectId, ref: "History" }],
});

userSchema.plugin(uniqueValidator, { message: 'La valeur est déjà utilisée' });

module.exports = mongoose.model("User", userSchema);
