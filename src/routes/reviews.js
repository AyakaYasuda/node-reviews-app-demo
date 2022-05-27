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
  const { reviewer, movie, rate, review_comment } = request.body;

  pool.query(
    'INSERT INTO reviews(reviewer, movie, rate, review_comment) VALUES($1, $2, $3, $4)',
    [reviewer, movie, rate, review_comment],
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

router.get('/edit/:rid', (request, response, next) => {
  const { rid } = request.params;
  const { email, uid } = request.session;

  pool.query('SELECT * FROM reviews WHERE rid=($1)', [rid], (err, res) => {
    if (err) return next(err);

    const review = res.rows[0];

    if (email && uid) {
      response.render('edit-review', {
        rid: rid,
        review: review,
        email: email,
        uid: uid,
      });
    } else {
      response.end('Please log in first');
    }
  });
});

router.put('/edit/:rid', (request, response, next) => {
  const { uid } = request.session;
  const { rid } = request.params;

  const keys = ['rate', 'review_comment'];
  let fields = [];

  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE reviews SET ${field}=($1) WHERE rid=($2)`,
      [request.body[field], rid],
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

router.delete('/delete/:rid', (request, response, next) => {
  const { uid } = request.session;
  const { rid } = request.params;

  pool.query('DELETE FROM reviews WHERE rid=($1)', [rid], (err, res) => {
    if (err) return next(err);

    if (uid) {
      response.redirect(`/reviews/${uid}`);
    } else {
      response.end('Please log in first');
    }
  });
});

module.exports = router;
