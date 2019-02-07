//Required Libararies 
//_______________________________________________________________________________________________

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Required Models
//_______________________________________________________________________________________________

const subProduct = require("../models/subProduct");

//Handling Incoming get request
//________________________________________________________________________________________________

router.get("/", (req, res, next) => {
  subProduct.find()
    .select("name ")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        subProduct: docs.map(doc => {
          return {
            name: doc.name,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/subProduct/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Inserting through POST request
//___________________________________________________________________________________________________

router.post("/", (req, res, next) => {
  const newsubProduct = new subProduct({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
    newsubProduct
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created subProduct successfully",
        createdsubProduct: {
            name: result.name,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/subProduct/" + result._id
            }
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
//___________________________________________________________________________________________________

router.get("/:subProductId", (req, res, next) => {
  const id = req.params.subProductId;
  subProduct.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            subProduct: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/subProduct'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//update colletion
//__________________________________________________________________________________________________

router.patch("/:subProductId", (req, res, next) => {
  const id = req.params.subProductId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  subProduct.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'subProduct updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/subProduct/' + id
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

//Delete document of specific ID
//________________________________________________________________________________________________

router.delete("/:subProductId", (req, res, next) => {
  const id = req.params.subProductId;
  subProduct.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'subProduct deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/subProduct',
              body: { name: 'String'}
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
