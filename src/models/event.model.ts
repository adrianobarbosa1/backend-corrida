const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  maxNumber: {
    type: Number,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  map: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
