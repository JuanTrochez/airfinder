import mongoose, {Schema} from 'mongoose';

var positionSchema = new Schema({
    name: {type: String},
    startLocation: {coordinates: [Number]},
    endLocation: {coordinates: [Number]},
    currentLocation: {coordinates: [Number]},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Position', positionSchema);
