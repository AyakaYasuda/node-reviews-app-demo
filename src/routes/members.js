const { Router } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = Router();

router.get('/register', (request, response) => {
  let sess = request.session;
  if (sess.email) {
    response.redirect('/members/feed');
  }
  response.render('register');
});

router.post('/register', (request, response, next) => {
  const { name, email, password } = request.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  pool.query(
    'INSERT INTO members(name, email, password, favorite_movies) VALUES($1, $2, $3, $4)',
    [name, email, passwordHash, {}],
    (err, res) => {
      if (err) return next(err);

      response.redirect('/members/login');
    }
  );
});

router.get('/login', (request, response) => {
  let sess = request.session;

  if (sess.email) {
    return response.redirect('/members/feed');
  }

  response.render('login');
});

router.post('/login', (request, response, next) => {
  const { email, password } = request.body;

  pool.query('SELECT * FROM members WHERE email=($1)', [email], (err, res) => {
    if (err) return next(err);

    if (
      res.rows.length > 0 &&
      bcrypt.compareSync(password, res.rows[0].password)
    ) {
      request.session.email = email;
      request.session.uid = res.rows[0].id;
      response.redirect('/members/feed');
    } else {
      response.end('Invalid credentials');
    }
  });
});

router.get('/feed', (request, response, next) => {
  const { email, uid } = request.session;

  pool.query('SELECT * FROM reviews ORDER BY rid ASC', (err, res) => {
    if (err) return next();

    const reviews = res.rows;

    if (email && uid) {
      response.render('feed', { email: email, uid: uid, reviews: reviews });
    } else {
      response.end('Please log in first');
    }
  });
});

router.get('/logout', (request, response, next) => {
  request.session.destroy((err) => {
    return next(err);
  });
  response.redirect('/members/login');
});

module.exports = router;
