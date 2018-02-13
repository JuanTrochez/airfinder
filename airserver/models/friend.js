import mongoose, {Schema} from 'mongoose';

var friendSchema = new Schema({
    seeker: [{type: Schema.Types.ObjectId, ref: 'User'}],
    receiver: [{type: Schema.Types.ObjectId, ref: 'User'}],
    status: {type: Integer, default: 0},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Friend', friendSchema);
