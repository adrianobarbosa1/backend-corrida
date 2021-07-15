const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

const AdmValidation = {
    adm: (req, res, next) => {
        if (!req.payload.id) return res.sendStatus(401);
        Usuario.findById(req.payload.id).then(usuario => {
            if (!usuario) return res.sendStatus(401);
            if (!usuario.permissao.includes("super-adm")) return res.sendStatus(401);
            next();
        }).catch(next);
    },
};

module.exports = { AdmValidation };