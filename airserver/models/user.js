import mongoose, { Schema } from "mongoose";

var userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Le nom est obligatoire'],
	},
	firstname: {
		type: String,
		required: [true, 'Le prénom est obligatoire'],
	},
	username: {
		type: String,
		unique: true,
		validate: {
			validator: function(v) {
				return /[a-z0-9]/i.test(v);
			},
			message: 'Le pseudo ne doit comporter que des caractères alphanumeriques'
		},
		required: [true, 'Le pseudo est obligatoire']
	},
	password: {
		type: String,
		required: [true, 'Le mot de passe est obligatoire'],
	},
	email: {
		type: String,
		unique: true,
		validate: {
			validator: function(v) {
				let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				return re.test(v);
			}
		},
		required: [true, 'L\'email est obligatoire'],
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	friends: [{ type: Schema.Types.ObjectId, ref: "Friend" }],
	position: [{ type: Schema.Types.ObjectId, ref: "Position" }]
});


module.exports = mongoose.model("User", userSchema);
