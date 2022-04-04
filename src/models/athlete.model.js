const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const athleteSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  runningGroup: {
    type: Schema.Types.ObjectId,
    ref: 'RunningGroup'
  },
  register: {
    type: Schema.Types.ObjectId,
    ref: 'Register'
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
athleteSchema.plugin(toJSON);
athleteSchema.plugin(paginate);

const Athlete = mongoose.model("Athlete", athleteSchema);

module.exports = Athlete;
