
//Required Libararies 
//_______________________________________________________________________________________________

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Required Models
//_______________________________________________________________________________________________

const subCategory = require("../models/subCategory");
const Product = require("../models/product");

//Handling Incoming get request
//________________________________________________________________________________________________

router.get("/", (req, res, next) => {
  subCategory.find()
    .select("product name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        subCategory: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            request: {
              type: "GET",
              url: "http://localhost:3000/subCategory/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Inserting through POST request
//_________________________________________________________________________________________________

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(Product => {
      if (!Product) {
        return res.status(404).json({
          message: "product not found"
        });
      }
      const newSubCategory = new subCategory({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        _product: req.body.productId

      });
      return newSubCategory.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "subCategory stored",
        createdsubCategory: {
          _id: result._id,
          name : req.body.name,
          _product: result._product,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/subCategory/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//show collection by collection primary key
//__________________________________________________________________________________________________

router.get("/:subCategoryId", (req, res, next) => {
  subCategory.findById(req.params.subCategoryId)
    .exec()
    .then(subCategory => {
      if (!subCategory) {
        return res.status(404).json({
          message: "subCategory not found"
        });
      }
      res.status(200).json({
        subCategory: subCategory,
        request: {
          type: "GET",
          url: "http://localhost:3000/subCategory"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Delete document of specific ID
//__________________________________________________________________________________________________

router.delete("/:subCategoryId", (req, res, next) => {
  subCategory.remove({ _id: req.params.subCategoryId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "subCategory deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/subCategory",
          body: { name: 'String'}
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//update colletion
//____________________________________________________________________________________________________

router.patch("/:subCategoryId", (req, res, next) => {
  const id = req.params.subCategoryId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  subCategory.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'subCategory updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/subCategory/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
