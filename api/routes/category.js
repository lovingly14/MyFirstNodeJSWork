//Required Libararies 
//____________________________________________________________________________________________

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//Required Models
//____________________________________________________________________________________________

const category = require("../models/category");
const subCategory = require("../models/subCategory");

//Handling Incoming get request
//____________________________________________________________________________________________

router.get("/", (req, res, next) => {
  //search query that finds document from a specific collection
  category.find()
  //selecting fields name to be displayed
    .select("subCategory name")
    .exec()
    .then(docs => {
      //giving the status of our query in JSON
      res.status(200).json({
        count: docs.length,
        categorys: docs.map(doc => {
          return {
            _id: doc._id,
            subCategory: doc.subCategory,
            request: {
              type: "GET",
              url: "http://localhost:3000/category/" + doc._id
            }
          };
        })
      });
    })
    //catching the errors
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Inserting through POST request
//___________________________________________________________________________________________________

router.post("/", (req, res, next) => {
  //search for subcategory by ID
  subCategory.findById(req.body.subCategoryId)
    .then(subCategory => {
      //if sub Category not found then showing an error message
      if (!subCategory) {
        return res.status(404).json({
          message: "subCategory not found"
        });
      }

      //if subcategory exists then creating a new category
      const newCategory = new category({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        _subCategory: req.body.subCategoryId

      });
      //save the newly created category
      return newCategory.save();
    })
    .then(result => {
      console.log(result);
      //showing the result in JSON
      res.status(201).json({
        message: "category stored",
        createdcategory: {
          _id: result._id,
          name : req.body.name,
          _subCategory: result._subCategory,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/category/" + result._id
        }
      });
    })
    //Handling the errors
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//show collection by collections primary key
//_____________________________________________________________________________________________________

router.get("/:categoryId", (req, res, next) => {
  category.findById(req.params.categoryId)
    .exec()
    .then(category => {
      //if category not found show not found status
      if (!category) {
        return res.status(404).json({
          message: "category not found"
        });
      }
      // if found show the result
      res.status(200).json({
        category: category,
        request: {
          type: "GET",
          url: "http://localhost:3000/category"
        }
      });
    })
    //handling errors
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Delete document of specific ID
//_____________________________________________________________________________________________________

router.delete("/:categoryId", (req, res, next) => {
  //remove document with specific in a collection
  category.remove({ _id: req.params.categoryId })
    .exec()
    .then(result => {
      //show the status
      res.status(200).json({
        message: "category deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/category",
          body: { name: 'String'}
        }
      });
    })
    //handling errors
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//update colletion
//_______________________________________________________________________________________________________

router.patch("/:categoryId", (req, res, next) => {
  //get the primary key of the collection to be updated
  const id = req.params.categoryId;
  //loop for each property to be updated
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  //update query
  category.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      //response status
      res.status(200).json({
          message: 'category updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/category/' + id
          }
      });
    })
    //handling errors
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
