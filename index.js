const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const router = require("./routes/index");


require("dotenv").config({ path: __dirname + "/.env" });

const PORT = process.env.PORT || 5000;


app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, './frontend/build')));


app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');  
app.use(router);


const corsOptions = {
  origin: "https://peaceful-headland-60459.herokuapp.com/",
  optionsSuccessStatus: 200
};

//app.use(cors(corsOptions));


const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4,
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log(" * Connected to Database: ", result.connections[0].name);
    const server = app.listen(PORT, () => {
      console.log(` * Listening on http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error(err);
  });

