'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/' , (req, res, next) => {
  knex('users')
    .select( 'id', 'firstname', 'lastname', 'username', 'phone', 'email')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/' , (req, res, next) => {
  const { firstName, lastName, username ,email, phone } = req.body.users;

    if (!firstName) {
      const err = new Error('Firstname must not be blank');
      err.status = 400;

      return next(err);
    }

    if (!lastName) {
      const err = new Error('Lastname must not be blank');
      err.status = 400;

      return next(err);
    }

    if (!username || 6 >= username.length || !/^([a-zA-Z0-9])$/.test(username) || !/^[a-zA-Z]$/.test(username[0])) {
      const err = new Error('Username must not be blank');
      err.status = 400;

      return next(err);
    }

    if (!email || email.trim() === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      const err = new Error('Email must not be blank');
      err.status = 400;

      return next(err);
    }

    if (!phone || 10 < phone.length || 10 > phone.length) {
      const err = new Error('Phone must not be blank');
      err.status = 400;

      return next(err);
    }

  knex('users')
    .insert({
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      phone: phone
    })
    .returning(['firstname', 'lastname', 'username','phone','email'])
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
