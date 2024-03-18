import mongoose from "mongoose";

const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    difficulty: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tests: {
        type: String,
        required: true,
    },
});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;