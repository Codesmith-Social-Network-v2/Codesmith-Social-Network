const { Router } = require('express');
const { exchangeCode, callMeAPI, callEmailAPI, setAuthCodeCookie } = require('../controllers/oauthController');
const { createUser, verifyUserExists } = require('../controllers/UserControllers');
// TODO: (Nick) no idea if the below line is necessary. Test?
// TODO: I don't know how to get to the homepage without React Router
const { route } = require('../server');

const router = Router();

router.get('/', 
  // oauthController verify user middleware?
  exchangeCode, 
  callMeAPI,
  callEmailAPI, 
  verifyUserExists,
  createUser,
  (req, res) => {
    console.log('We are at the end of the oauthRouter.js middleware chain!');
    return res.redirect('/');
  });

module.exports = router;