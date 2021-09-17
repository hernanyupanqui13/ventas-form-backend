const router = require("express").Router();
const path = require("path");
const multer = require("multer");

// Models
const FormAnswer = require("../models/formAnswer");

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

  const typeExams = [
    "Prueba Molecular",
    "Prueba de Antígeno",
    "Prueba Serológica Cuantitativa (CLIA)",
    "Prueba Rápida de Anticuerpos"
  ];

  console.log(req.body);
  const formAnswer = new FormAnswer({
    personaContacto: {
      name: req.body["nombre-contacto"],
      phoneNumber: req.body["celular-contacto"],
      district: req.body.distrito,
      addressAndReference: req.body["direccio-y-ref"],
      pacientQuantity: req.body["cantidad-pacientes"],
      typeExam: typeExams[req.body["tipo-prueba"]],
    }, 
    pacientData: {
      documentNumber: req.body["dni-pacient-input"],
      names: req.body["nombres-paciente-input"],
      lastPaternalName: req.body["apellido-pat-paciente"],
      lastMaternalName: req.body["apellido-mat-paciente"],
      sendResults: req.body["envio-resultados"],
      serviceTime: req.body["horario-servicio"]
    },
    billing: {
      receiptPath: req.file.path,
      receiptType: req.body["tipo-comprobante"],
      bank: req.body["banco"]
    }
  });

  formAnswer.save();
  console.log(req.file);
  res.redirect("/");
});


module.exports = router;