const router = require("express").Router();
const path = require("path");
const multer = require("multer");

const apiRouter = require("./apiRouter");

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

router.get("/",(req,res,next) => {
  res.render("ventas-form");
});


router.post("/submit-data", (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  res.redirect("/");
});


module.exports = router;