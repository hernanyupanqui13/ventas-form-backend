const router = require("express").Router();

router.get(/\/\w{0,}/, (req,res,next) => {
  res.json({test:"yest"});
});


module.exports = router;