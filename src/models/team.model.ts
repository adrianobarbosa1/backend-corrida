import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { toJSON, paginate } from './plugins';

const teamSchema = new mongoose.Schema({
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, uppercase: true, required: true },
  logo: { type: Buffer },
  phrase: { type: String },
  description: { type: String },
  invite_code: { type: String },
  deletado: { type: Boolean, default: false },
}, { timestamps: true }
);

// add plugin that converts mongoose to json
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);

export const Team = mongoose.model('Team', teamSchema);
