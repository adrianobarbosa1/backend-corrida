import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins';

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, uppercase: true, required: true, trim: true },
    foto: { type: Array, default: [] },
    maxNumber: { type: Number, required: true },
    eventDate: { type: Date, required: true },
    hour: { type: String, required: true },
    map: { type: String, required: true },
    address: { type: String, required: true },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    deletado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

export const Event = mongoose.model('Event', eventSchema);
