import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

import {roles} from '../config/roles'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
    },
    cpf: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email Inválido');
            }
        },
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'A senha é obrigatória'],
    },
    strategy:{
      type: String,
      required:[true, 'Uma estrategia de autenticação é obrigatório']
  },
    role: {
        type: [String],
        enum: roles,
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    deletado: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


userSchema.statics.isCpfTaken = async function (cpf, excludeUserId) {
    const user = await this.findOne({ cpf, _id: { $ne: excludeUserId } })
    return !!user;
};

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

//check if password matches the user's password
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema)

export default User;
