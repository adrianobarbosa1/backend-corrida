const mongoose = require("mongoose");
const { toJSON, paginate } = require('./plugins');

const teamSchema = mongoose.Schema({
  athlete: {
    type: Schema.Types.ObjectId,
    ref: 'Athlete'
  },
  name: {
    type: String,
    required: true,
  },
  leader: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  phrase: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inviteCode: {
    type: String,
    required: true,
  },
  deletado: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


// add plugin that converts mongoose to json
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
