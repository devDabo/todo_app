const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  todo: {type: String},
  complete: {type: Boolean}
});

module.exports = mongoose.model('Todo', todoSchema);
