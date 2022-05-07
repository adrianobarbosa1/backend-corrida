const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const runningGroupSchema = mongoose.Schema({
  name: {
    type: String,
    uppercase: true,
    required: true,
  },
  criterion: {
    type: String,
    required: true,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
runningGroupSchema.plugin(toJSON);
runningGroupSchema.plugin(paginate);

const RunningGroup = mongoose.model("RunningGroup", runningGroupSchema);

module.exports = RunningGroup;
