const mongoose = require('mongoose');

//collection structure
const subProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
});

//export model
module.exports = mongoose.model('subProduct', subProductSchema);