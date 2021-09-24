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

const upload = multer({storage:fileStorage});

//router.use(multer({storage:fileStorage}).single("formFile"));

//router.use(multer({ dest: 'uploads/' }).array("attachDocuments", 10));

//router.use(/\/api/, apiRouter);

/*router.get(/\w{0,}/,(req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});*/

router.get("/", formController.getForm);

router.post("/submit-data-fake",  (req,res,next) => {
  res.json({msg: "success"});
});

router.post("/submit-data", upload.fields(
  [
    {name:"formFile", maxCount:1},
    {name: "attachDocuments", maxCount: 30}
  ]), 
  
  formController.processSubmit
);


module.exports = router;