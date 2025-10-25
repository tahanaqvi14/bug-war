import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default:0,
    }
});

const Matches =mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [participantSchema],
    winner: {
        type: String,
        default:'tobedecided',
        trim: true

    },
    matchDate: {
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        default: 'Incomplete'
    }
});

export default Matches;
