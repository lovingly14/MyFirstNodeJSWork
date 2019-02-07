//Required Libararies
//_______________________________________________________________________________________________

const express = require("express");
const app = express();
//const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Routes to specific apis
//_______________________________________________________________________________________________

const categoryRoutes = require("./api/routes/category");
const subCategoryRoutes = require("./api/routes/SubCategory");
const productRoutes = require("./api/routes/Product");
const subProductRoutes = require("./api/routes/subProduct");

//________________________________________________________________________________________________
//MongoDB cluster URL
var url = "mongodb://root:admin@cluster0-shard-00-00-ghzek.mongodb.net:27017,cluster0-shard-00-01-ghzek.mongodb.net:27017,cluster0-shard-00-02-ghzek.mongodb.net:27017/NodeProject?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

//connect to the given mongodb cluster
mongoose.connect(
  url,
  {
    useMongoClient: true
  }
);

//_________________________________________________________________________________________________

//For use fo specific method
mongoose.Promise = global.Promise;

// app.use(morgan("dev"));

//parse the incoming request body or URL
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });


// Routes which should handle requests
app.use("/category", categoryRoutes);
app.use("/subcategory", subCategoryRoutes);
app.use("/product", productRoutes);
app.use("/subproduct", subProductRoutes);


// app.use((req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message
//     }
//   });
// });


module.exports = app;
