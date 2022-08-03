const { Router } = require('express');
const { route } = require('../server');
const { exchangeCode, userComplete} = require('../controllers/oauthController');

const router = Router();

router.get('/',
  (req, res, next) => {
    console.log('LOGGING REQ.COOKIES: ', req.cookies, ' END OF REQ.COOKIES');
    return next()
  },
  exchangeCode,
  (req, res) => {
    res.status(200).send(true);
  }
);

router.get('/complete', userComplete, (req, res) => {
  return res.status(200).json(res.locals.complete);
}
);

module.exports = router;