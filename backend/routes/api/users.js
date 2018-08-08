const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;


  if(!user.firstname) {
    return res.status(422).json({
      errors: {
        firstname: 'is required',
      },
    });
  }

  if(!user.lastname) {
    return res.status(422).json({
      errors: {
        lastname: 'is required',
      },
    });
  }

  if(!user.address) {
    return res.status(422).json({
      errors: {
        address: 'is required',
      },
    });
  }

  if(!user.sex) {
    return res.status(422).json({
      errors: {
        sex: 'is required',
      },
    });
  }

  if(!user. addhobbies) {
    return res.status(422).json({
      errors: {
        addhobbies: 'is required',
      },
    });
  }

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON(),
 message:'You have successfully created an account at Hobbies Online..'}));
  
});


//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.send({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.send({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON(),message :'Logged In...'});
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});
module.exports = router;