const router = require('express').Router();

router.use('/favorite', require('./Favorite'));
router.use('/product', require('./Product'));
router.use('/user', require('./User'));
module.exports= router;