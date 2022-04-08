const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

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
        type: String,
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

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} cpf - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isCpfTaken = async function (cpf, excludeUserId) {
    const user = await this.findOne({ cpf, _id: { $ne: excludeUserId } })
    return !!user;
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
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

module.exports = User;
