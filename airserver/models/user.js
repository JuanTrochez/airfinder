import mongoose, { Schema } from "mongoose";

var userSchema = new Schema({
	pseudo: { type: String, unique: true, match: /[a-z0-9]/ },
	password: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	friends: [{ type: Schema.Types.ObjectId, ref: "Friend" }],
	position: [{ type: Schema.Types.ObjectId, ref: "Position" }]
});


export default mongoose.model("User", userSchema);
