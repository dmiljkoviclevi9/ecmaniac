import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Test Case Schema
const testCaseSchema = new Schema({
  input: {
    type: [Schema.Types.Mixed], // Array of any type to support multiple parameters of different types
    required: true
  },
  expectedOutput: {
    type: Schema.Types.Mixed, // Can be any type to support various return values
    required: true
  }
}, { _id: false }); // Disable automatic _id generation for each test

// Challenge Schema
const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['EASY', 'MEDIUM', 'HARD']
  },
  category: {
    type: String,
    required: true,
    enum: ['FUNDAMENTALS', 'ARRAYS', 'OBJECTS', 'SETS', 'MAPS', 'DATES', 'REGEX', 'RECURSION', 'CLASSES', 'ERRORS', 'PROMISES']
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tests: [testCaseSchema] // Incorporating the Test Case Schema
});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;