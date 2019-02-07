const mongoose = require('mongoose');

//collection structure
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    _subProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'subProduct', required: true }
});

//export model
module.exports = mongoose.model('product', productSchema);