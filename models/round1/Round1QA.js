// models/Round1QA.js
const mongoose = require('mongoose');

const round1QASchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const Round1QA = mongoose.model('Round1QA', round1QASchema);

module.exports = Round1QA;
