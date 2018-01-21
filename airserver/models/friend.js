import mongoose, {Schema} from 'mongoose';

var friendSchema = new Schema({
    seeker: [{type: Schema.Types.ObjectId, ref: 'User'}],
    receiver: [{type: Schema.Types.ObjectId, ref: 'User'}],
    pending: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Friend', friendSchema);
