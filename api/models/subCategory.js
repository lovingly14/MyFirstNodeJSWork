const mongoose = require('mongoose');

//collection structure
const subCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    _product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }

});

//export model
module.exports = mongoose.model('subCategory', subCategorySchema);