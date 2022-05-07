import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { toJSON, paginate } from './plugins';

const dependentsSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    name: {
      type: String,
      uppercase: true,
      required: true,
    },
    dt_nascimento: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    deletado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
dependentsSchema.plugin(toJSON);
dependentsSchema.plugin(paginate);

export const Dependents = mongoose.model('Dependents', dependentsSchema);
