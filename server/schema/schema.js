const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  todo: { type: String },
  complete: { type: Boolean },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Todo', todoSchema);
