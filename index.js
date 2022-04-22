const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const config = require("./server/config/keys");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/dialogflow', require('./server/routes/dialogflow'));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });


const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
