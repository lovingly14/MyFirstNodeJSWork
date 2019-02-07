const mongoose = require('mongoose');

//collection structure
const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    _subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'subCategory', required: true }
});

//export the model 
module.exports = mongoose.model('category', categorySchema);