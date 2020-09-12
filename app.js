const fs = require("fs");
const http = require("http");
const path = require("path");
const methods = require("methods");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const { urlencoded, json } = express;

// create a global app object
const app = express();

app.use(cors());

//Normal Express Configuration
app.use(require("morgan")("dev"));
app.use([urlencoded({ extended: true }), json()]);

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));
//app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: "microblogging",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
} else {
  mongoose.connect(
    "mongodb+srv://ibukunoluwa:J37XqVAVWWW6T9R@cluster0.8j0zg.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
  );
  mongoose.set("debug", true);
}

app.use(require("./routes"));

//catch 404 and forward to errorhandler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

//development error handlers will print stack trace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

const normalizePort = () => {
  const port = parseInt(process.env.PORT, 10);
  if (Number.isNaN(port) && typeof process.env.PORT !== "undefined")
    return process.env.PORT;
  if (port >= 0) return port;
  return 3000;
};

app.get("/", (req, res) =>
  res.status(200).send({ message: "Welcome to the beginning of nothingness" })
);

const port = normalizePort();
const hostname = process.env.HOSTNAME || "localhost";

app.listen(port, () => console.log(`Server listening on ${hostname}:${port}`));
