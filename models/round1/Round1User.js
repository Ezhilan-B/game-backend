const mongoose = require('mongoose');

// Define the schema for user and score
const userScoreround1Schema = new mongoose.Schema({
    username: { type: String},
    score: { type: Number, default: 0 },
  });
  const round1User = mongoose.model('round1User', userScoreround1Schema);

  module.exports = round1User;