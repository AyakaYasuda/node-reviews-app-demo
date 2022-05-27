const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/:id', (request, response, next) => {
  const { email, uid } = request.session;
  const { id } = request.params;

  pool.query('SELECT name FROM members WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    const username = res.rows[0].name;

    pool.query(
      'SELECT * FROM reviews WHERE reviewer=($1)',
      [username],
      (err, res) => {
        if (err) return next(err);

        if (email && uid) {
          response.render('users-reviews', {
            reviews: res.rows,
            email: email,
            uid: uid,
          });
        } else {
          response.end('Please log in first');
        }
      }
    );
  });
});

router.get('/create/:id', (request, response, next) => {
  const { id } = request.params;
  const { email, uid } = request.session;

  pool.query('SELECT * FROM movies WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    const movie = res.rows[0];

    pool.query('SELECT name FROM members WHERE id=($1)', [uid], (err, res) => {
      if (err) return next(err);

      const username = res.rows[0]?.name;

      if (email && uid) {
        response.render('new-review', {
          id: id,
          movie: movie,
          email: email,
          uid: uid,
          reviewer: username,
        });
      } else {
        response.end('Please log in first');
      }
    });
  });
});

router.post('/create/:id', (request, response, next) => {
  const { uid } = request.session;
  const { reviewer, movie, rate, review } = request.body;

  pool.query(
    'INSERT INTO reviews(reviewer, movie, rate, review) VALUES($1, $2, $3, $4)',
    [reviewer, movie, rate, review],
    (err, res) => {
      if (err) return next(err);

      if (uid) {
        response.redirect(`/reviews/${uid}`);
      } else {
        response.end('Please log in first');
      }
    }
  );
});

router.get('/edit/:id', (request, response, next) => {
  const { id } = request.params;
  const { email, uid } = request.session;

  pool.query('SELECT * FROM reviews WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    const review = res.rows[0];

    if (email && uid) {
      response.render('edit-review', {
        id: id,
        review: review,
        email: email,
        uid: uid,
      });
    } else {
      response.end('Please log in first');
    }
  });
});

router.put('/edit/:id', (request, response, next) => {
  const { uid } = request.session;
  const { id } = request.params;

  const keys = ['rate', 'review'];
  let fields = [];

  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE reviews SET ${field}=($1) WHERE id=($2)`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(err);

        if (index === fields.length - 1) {
          if (uid) {
            response.redirect(`/reviews/${uid}`);
          } else {
            response.end('Please log in first');
          }
        }
      }
    );
  });
});

router.delete('/delete/:id', (request, response, next) => {
  const { uid } = request.session;
  const { id } = request.params;

  pool.query('DELETE FROM reviews WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    if (uid) {
      response.redirect(`/reviews/${uid}`);
    } else {
      response.end('Please log in first');
    }
  });
});

module.exports = router;
