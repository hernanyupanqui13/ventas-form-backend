const router = require("express").Router();
const path = require("path");
const multer = require("multer");

// Models
const FormAnswer = require("../models/formAnswer");

// Routes
const apiRouter = require("./apiRouter");

// Controllers 
const formController = require("../controllers/form");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getSeconds()} - ${file.originalname}`);
  }
});

router.use(multer({storage:fileStorage}).single("formFile"));

//router.use(/\/api/, apiRouter);

/*router.get(/\w{0,}/,(req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});*/

router.get("/", formController.getForm);


router.post("/submit-data", formController.processSubmit);


module.exports = router;