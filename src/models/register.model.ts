const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const registerSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  avatar: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  birth: {
    type: Date,
    required: true,
  },
  fone: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String
  },
  block: {
    type: String
  },
  bach: {
    type: String
  },
  district: {
    type: String,
    required: true,
  },
  county: {
    type: String
  },

  city: {
    type: String,
    required: true,
  },
  uf: {
    type: String,
    required: true,
  },
  complement: {
    type: String
  },
  country: {
    type: String,
    required: true,
  },
  rg: {
    type: String,
    required: true,
  },
  uf_rg: {
    type: String,
    required: true,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
registerSchema.plugin(toJSON);
registerSchema.plugin(paginate);

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
