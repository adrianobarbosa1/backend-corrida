import mongoose from 'mongoose';
import { Types, Schema, Document } from 'mongoose';
import { toJSON } from './plugins';

export interface AthleteDocument extends Document {
  user: Types.ObjectId;
  team?: Types.ObjectId;
  runningGroup?: Types.ObjectId;
  cpf: string;
  rg: string;
  uf_rg: string;
  genero: string;
  fone: string;
  dt_nascimento: Date;
  tipo_sanguineo: string;
  alergia: string;
  pais: string;
  cep: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  quadra: string;
  lote: string;
  complemento: string;
  deletado: boolean;
}

const athleteSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    running_group: { type: Schema.Types.ObjectId, ref: 'RunningGroup' },
    cpf: { type: String, unique: true, required: true },
    rg: { type: String, unique: true, required: true },
    uf_rg: { type: String, required: true },
    genero: { type: String, required: true },
    fone: { type: String, required: true },
    dt_nascimento: { type: Date, required: true },
    pais: { type: String, required: true },
    cep: { type: String, required: true },
    uf: { type: String, required: true },
    municipio: { type: String, required: true },
    bairro: { type: String, required: true },
    logradouro: { type: String, required: true },
    quadra: { type: String },
    lote: { type: String },
    complemento: { type: String },
    tipo_sanguineo: { type: String },
    alergia: { type: String },
    deletado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

athleteSchema.plugin(toJSON);

export const Athlete = mongoose.model<AthleteDocument>('Athlete', athleteSchema);
