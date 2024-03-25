const router = require('express').Router()
const { createUserProduct } = require('../../db');

//router.get('/', async (req, res, next) => {});

router.post('/:user_id/skills', async (req, res, next) => {
  try {
    const { skill_id } = req.body; // req.body.skill_id
    const userSkill = await createUserProduct({user_id: req.params.user_id, skill_id: product_id});
    res.status(200).send(userSkill);
  } catch (error) {
    next(error)
  }
})

module.exports= router;