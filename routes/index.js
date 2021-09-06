const router = require("express").Router();
const path = require("path");

const apiRouter = require("./apiRouter");

router.use(/\/api/, apiRouter);

router.get(/\w{0,}/,(req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


module.exports = router;