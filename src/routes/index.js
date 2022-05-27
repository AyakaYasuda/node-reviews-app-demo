const { Router } = require('express');

const members = require('./members');

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/members/login');
});

router.use('/members', members);

module.exports = router;
