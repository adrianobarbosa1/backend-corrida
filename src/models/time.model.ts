const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const timeSchema = mongoose.Schema({
  athlete: {
    type: Schema.Types.ObjectId,
    ref: 'Athlete'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  time: {
    type: Number,
    default: false,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
timeSchema.plugin(toJSON);
timeSchema.plugin(paginate);

const Time = mongoose.model("Time", timeSchema);

module.exports = Time;
