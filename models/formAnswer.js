const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FormAnswer = new Schema({
  
  personaContacto: {
    name: String,
    phoneNumber: String,
    district: String,
    addressAndReference: String,
    pacientQuantity: Number,
    typeExam: String,
  }, 

  pacientData: {
    documentNumber: String,
    names: String,
    lastPaternalName: String,
    lastMaternalName: String,
    sendResults: String,
    serviceTime: String
  },

  billing: {
    receiptPath: String,
    receiptType: String,
    bank: String
  },

  serviceDate: {
    type: Date,
    required: true
  },
  
  registeredOn: {
    type: Date,
    default: Date.now
  }
  
});


module.exports = mongoose.model("form_answer", FormAnswer);