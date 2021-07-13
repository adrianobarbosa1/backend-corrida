const router = require('express').Router();

router.use('/usuarios', require('./usuarios'))
router.use('/cadastros', require('./cadastro'))

module.exports = router;