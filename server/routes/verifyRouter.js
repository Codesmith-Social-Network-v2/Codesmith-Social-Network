const { Router } = require('express');
const { route } = require('../server');
const { exchangeCode, userComplete} = require('../controllers/oauthController');

const router = Router();

// localhost:8080/verifyuser
router.get('/', exchangeCode, (req, res) => {
  return res.status(200).send(true);
});

// localhost:8080/verifyuser/complete
router.get('/complete', userComplete, (req, res) => {
  return res.status(200).json(res.locals.complete);
}
);

module.exports = router;