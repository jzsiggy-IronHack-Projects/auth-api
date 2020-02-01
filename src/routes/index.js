const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

router.post('/signup', (request , response , next) => {
  console.log(request.body);
  const { username , password } = request.body;

  User.findOne({ username })
  .then(userInDB => {
    if (userInDB) {
      response.status(400).json({ message : 'User already exists' });
      return ;
    } else {
      const newUserHashPass = bcrypt.hashSync(password, 10);
    
      const newUser = {
        username,
        password : newUserHashPass,
      };
    
      User.create(newUser)
      .then(newUserInDB => {
        request.session.user = newUserInDB;
        response.status(200).json( newUserInDB );
      })
      .catch(err => {
        response.status(500).json({ message : 'Could not create user' });
      });
    };
  });
});

router.post('/login', (request , response , next) => {
  const { username , password } = request.body;
  User.findOne({ username })
  .then(userInDB => {
    if (!userInDB) {
      response.status(400).json({ message : 'No user found in DB' })
    } else if (!bcrypt.compareSync(password, userInDB.password)) {
      response.status(400).json({ message : 'Wrong password' })
    } else {
      request.session.user = userInDB;
      response.status(200).json( userInDB );
    };
  });
});

router.post('/logout', (request , response , next) => {
  request.session.user = null;
  response.status(200).json({ message : 'User logged out' })
});

router.get('/loggedin' , (request , response , next) => {
    request.session.user
    ?
    response.status(200).json(request.session.user)
    :
    response.status(403).json({ message : 'Unauthorized' })
  });

module.exports = {
  router,
};