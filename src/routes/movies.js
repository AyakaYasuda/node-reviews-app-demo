const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
  const { email, uid } = request.session;

  pool.query('SELECT * FROM movies ORDER BY id ASC', (err, res) => {
    if (err) return next(err);

    if (email && uid) {
      response.render('movies', {
        movies: res.rows,
        email: email,
        uid: uid,
      });
    } else {
      response.end('Please log in first');
    }
  });
});

module.exports = router;
