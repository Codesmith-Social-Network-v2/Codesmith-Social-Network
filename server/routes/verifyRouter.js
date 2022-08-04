const { Router } = require('express');
const { route } = require('../server');
const { exchangeCode, callMeAPI,  callEmailAPI,  verifyUserExists, createUser, userComplete} = require('../controllers/oauthController');

const router = Router();

// localhost:8080/verifyuser
router.get('/', exchangeCode, userComplete, (req, res) => {
  // return res.redirect('/');
  console.log('hello from final func in /verifyuser GET request');
  return res.status(200).json(res.locals.complete);
});

// localhost:8080/verifyuser/complete
// router.get('/complete', userComplete, (req, res) => {
//   return res.status(200).json(res.locals.complete);
// });

// router.get('/', exchangeCode, userComplete, callMeAPI, callEmailAPI,  verifyUserExists, createUser, (req, res) => {
//   console.log('We are at the end of the oauthRouter.js middleware chain!');
//   return res.redirect('http://localhost:8080/');
// });

module.exports = router;