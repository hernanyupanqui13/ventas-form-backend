const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const sgTransporter = require("nodemailer-sendgrid-transport");
require("dotenv").config({ path: path.join(__dirname , "..",".env")});


// Models 
const FormAnswer = require("../models/formAnswer");




// Init Transporter 
const transporter = nodemailer.createTransport(sgTransporter({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  },
  service: 'SendGrid',
}));




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
      typeExam: typeExams[req.body["tipo-prueba"]-1],
    }, 
    pacientData: {
      documentNumber: req.body["dni-pacient-input"],
      names: req.body["nombres-paciente"],
      lastPaternalName: req.body["apellido-pat-paciente"],
      lastMaternalName: req.body["apellido-mat-paciente"],
      sendResults: req.body["envio-resultados"],
      serviceTime: req.body["horario-servicio"]
    },
    billing: {
      // receiptPath: req.file ? `${req.file.path.replace(/\\/g, "/")}` : "",
      receiptType: req.body["tipo-comprobante"],
      bank: req.body["banco"]
    }
  });

  if(req.file) {
    console.log(req.file, "there is a file");
    formAnswer.receiptPath = req.file.path.replace(/\\/g, "/");
  } 
  

  console.log(formAnswer, "form answerr");

  await formAnswer.save();

  // Sending email
  const receiver = [
    // "ventas.inno@innomedic.pe",
    // "kpongo@innomedic.pe",
    // "serviciosinhouse@innomedic.pe",
    "hernany@innomedic.pe"
  ];
  const subject = "Respuestas Formulario";


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
      bcc: "hernan.yupanqui.prieto@gmail.com",
      subject:subject,
      html: str
    };

    if(formAnswer.billing.receiptPath) {
      mailOptions.attachments = [{path: `./${formAnswer.billing.receiptPath}`}];
    }
    
    // Sending email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        const response = {msg: "Hubo problemas en el envio. Lo sentimos", error: err, state:"Fail"};
        
        res.json(response);
        

      } else {
        console.log("Email send: " + info.response);
        const response = {msg: "El correo fue enviado con éxito", error: err, state:"Success"};
        
        res.json(response);
      }
    });

  })
}