import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedChallenges: [{
    type: String,
    required: true,
    trim: true,
  }],
});

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;
