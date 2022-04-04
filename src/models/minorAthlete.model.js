const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const minorAthleteSchema = mongoose.Schema({
  athlete: {
    type: Schema.Types.ObjectId,
    ref: 'Athlete'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  name: {
    type: String,
    required: true,
  },
  birth: {
    type: String,
    required: true,
  },
  genre: {
    type: Date,
    required: true,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
minorAthleteSchema.plugin(toJSON);
minorAthleteSchema.plugin(paginate);

const MinorAthlete = mongoose.model("MinorAthlete", minorAthleteSchema);

module.exports = MinorAthlete;
