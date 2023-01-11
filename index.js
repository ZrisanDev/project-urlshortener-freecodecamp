require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const localStorage = require("localStorage");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  localStorage.setItem("data", JSON.stringify([]));

  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

function isValidURL(value) {
  var expression =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regexp = new RegExp(expression);
  return regexp.test(value);
}

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  try {
    if (!isValidURL(url)) {
      res.json({
        error: "invalid url",
      });
    } else {
      const id = parseInt(Math.random() * 999999);

      const datURLs = JSON.parse(localStorage.getItem("data"));

      datURLs.push({ original_url: url, short_url: id });

      localStorage.setItem("data", JSON.stringify(datURLs));

      res.send({ original_url: url, short_url: id });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/shorturl/:number", function (req, res) {
  try {
    const { number } = req.params;

    const dataURL = JSON.parse(localStorage.getItem("data"));

    const url = dataURL.find((data) => data.short_url === parseInt(number));

    res.redirect(url.original_url);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
