const router = require("express").Router()
const auth = require("../../auth")
const CadastroController = require("../../../controllers/CadastroController")

const validate = require("express-validation")
const { CadastroValidation } = require("../../../controllers/validacoes/cadastroValidation")

const cadastroController = new CadastroController()

router.post("/", validate(CadastroValidation.store), cadastroController.store) //TESTADO
router.get("/", auth.required, cadastroController.index) //TESTADO
router.put("/:id", auth.required, validate(CadastroValidation.update), cadastroController.update) //TESTADO
router.post("/cpf",  validate(CadastroValidation.show), cadastroController.show) //TESTADO
router.delete("/:id", auth.required, validate(CadastroValidation.remove), cadastroController.remove); //TESTADO

module.exports = router