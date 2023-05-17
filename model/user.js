var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//todo schema just consists of a string (for now)
const userSchema = new Schema({
    todo: {
        type: String
    }
})

//todo is the name of the collection in studio3T
const usermodel = mongoose.model('todo', userSchema);
module.exports = usermodel;