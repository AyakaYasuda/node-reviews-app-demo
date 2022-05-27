const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/:id', (request, response, next) => {
  const { id } = request.params;
  const { email, uid } = request.session;

  pool.query(
    'SELECT * FROM likes JOIN members ON likes.member = members.name WHERE review=($1)',
    [id],
    (err, res) => {
      if (err) return next();

      const likers = res.rows;

      if (email && uid) {
        response.render('who-liked', {
          likers: likers,
          email: email,
          uid: uid,
        });
      } else {
        response.end('Please log in first');
      }
    }
  );
});

router.get('/member/:id', (request, response, next) => {
  const { id } = request.params;
  const { email, uid } = request.session;

  pool.query(
    'SELECT * FROM likes JOIN members ON likes.member = members.name JOIN reviews ON likes.review = reviews.rid WHERE id=($1)',
    [id],
    (err, res) => {
      if (err) return next(err);

      if (email && uid) {
        response.render('member-likes', {
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

router.post('/:id', (request, response, next) => {
  const { uid } = request.session;
  const { id } = request.params;

  if (uid) {
    pool.query('SELECT name FROM members WHERE id=($1)', [uid], (err, res) => {
      if (err) return next();

      const username = res.rows[0].name;

      pool.query(
        'INSERT INTO likes(member, review) VALUES($1, $2)',
        [username, id],
        (err, res) => {
          if (err) return next();
          response.redirect(`/likes/${id}`);
        }
      );
    });
  }
});

module.exports = router;
