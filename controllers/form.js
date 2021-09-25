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
      address: req.body["direccion"],
      addressReference: req.body["direccion-referencia"],
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
      receiptType: req.body["tipo-comprobante"],
      bank: req.body["banco"]
    },
    // Here we are adding the 5 hours of the timezone in Peru. That stores the datetime in UTC on database. 
    //This is to avoid sustracting 5 hours of the date when we make requests 
    serviceDate: new Date( Date.parse(req.body["service-date"]) + 5*60*60*1000),
    //attachments: []
  });

  if(req.file) {
    console.log(req.file, "there is a file");
    formAnswer.billing.receiptPath = req.file.path.replace(/\\/g, "/");
  }

  console.log(formAnswer)
  
  // Ensuring that there are files in the form answers
  if(req.files) {
    // Attaching receipt
    if(req.files["formFile"]) {    
      formAnswer.billing.receiptPath = req.files["formFile"][0].path.replace(/\\/g, "/");
      
    }
    
    // Attaching other documents 
    if(req.files["attachDocuments"]) {
      const attachments = [];

      for(let file of req.files["attachDocuments"]) {
        attachments.push({path: file.path.replace(/\\/g, "/")});
      }

      formAnswer.attachedDocuments = attachments;
    }
  }


  await formAnswer.save();
  console.log(formAnswer, "form answerr");


  // Sending email
  const receiver = [
    "ventas.inno@innomedic.pe",
    "kpongo@innomedic.pe",
    "serviciosinhouse@innomedic.pe",
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
      html: str,
      attachments: []
    };

    // Atachments
    if(formAnswer.billing.receiptPath) {
      mailOptions.attachments.push({path: `./${formAnswer.billing.receiptPath}`});
    }

    for(let file of formAnswer.attachedDocuments) {
      mailOptions.attachments.push({path: `./${file.path}`});
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