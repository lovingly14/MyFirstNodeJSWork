//Required Libararies 
//_________________________________________________________________________________________________

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//Required Models
//_________________________________________________________________________________________________

const product = require("../models/product");
const subProduct = require("../models/subProduct");

//Handling Incoming get request
//_________________________________________________________________________________________________

router.get("/", (req, res, next) => {
  product.find()
    .select("subProduct name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        product: docs.map(doc => {
          return {
            _id: doc._id,
            subProduct: doc.subProduct,
            request: {
              type: "GET",
              url: "http://localhost:3000/product/" + doc._id
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
//________________________________________________________________________________________________

router.post("/", (req, res, next) => {
  subProduct.findById(req.body.subProductId)
    .then(subProduct => {
      if (!subProduct) {
        return res.status(404).json({
          message: "subProduct not found"
        });
      }
      const newProduct = new product({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        _subProduct: req.body.subProductId

      });
      return newProduct.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "product stored",
        createdcategory: {
          _id: result._id,
          name : req.body.name,
          _subProduct: result._subProduct,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/product/" + result._id
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
//_________________________________________________________________________________________________

router.get("/:productId", (req, res, next) => {
  product.findById(req.params.productId)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "product not found"
        });
      }
      res.status(200).json({
        product: product,
        request: {
          type: "GET",
          url: "http://localhost:3000/product"
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
//______________________________________________________________________________________________________

router.delete("/:productId", (req, res, next) => {
  product.remove({ _id: req.params.ProductId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/product",
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
//_____________________________________________________________________________________________________

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/product/' + id
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

