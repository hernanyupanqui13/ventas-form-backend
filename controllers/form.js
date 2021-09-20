const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");


// Models 
const FormAnswer = require("../models/formAnswer");

exports.getForm = (req,res,next) => {
  res.render("ventas-form");
};

exports.processSubmit= async (req, res, next) => {
  const typeExams = [
    "Prueba Molecular",
    "Prueba de Antígeno",
    "Prueba Serológica Cuantitativa (CLIA)",
    "Prueba Rápida de Anticuerpos"
  ];

  console.log(req.file);

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
      receiptPath: req.file ? `${req.file.path.replace(/\\/g, "/")}` : "",
      receiptType: req.body["tipo-comprobante"],
      bank: req.body["banco"]
    }
  });

  console.log(formAnswer);

  await formAnswer.save();

  // Sending email
  const receiver = "hernan.yupanqui.prieto@gmail.com";
  const subject = "prueba 1";

  const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:"465",
    auth: {
      user:"sistemas.innomedic@gmail.com",
      pass:"s1st3m4s2411"
    }
  });

  const p = path.join(
    path.dirname(process.mainModule.filename),
    'views',
    'email',
    'email.ejs'
  );

  ejs.renderFile(p, {formAnswer: formAnswer}, (err, str) => {

    console.log(err, "the error");


    // The email comes from the database when the user was registered
    const mailOptions = {
      from: "sistemas.innomedic@gmail.com",
      to:receiver,
      bcc: "hernany@innomedic.pe",
      subject:subject,
      html: str,
      attachments: [
        {path: `./${formAnswer.receiptPath}`}
      ]
    };
    
    // Sending email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        const response = {msg: "Hubo problemas en el envio. Lo sentimos", error: err, state:"Fail"};
        
        res.json(response);
        

      } else {
        console.log("Email send: " + info.response);
        const response = {msg: "El correo fue enviado con éxito", error: err, state:"Success"};
        
        res.redirect("/");
      }
    });

  })
}