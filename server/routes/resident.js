const express = require('express');
const userControllers = require('../controllers/UserControllers');
const router = express.Router();

// resident.js = userRouters

router.get('/', userControllers.loadUsers, (req, res) => {
  console.log('got to this endpoint');
  return res.status(200).json(res.locals.usersLoad);
});

//Search resident by name
router.post('/', userControllers.findUserByName, (req, res) => {
  return res.status(200).json(res.locals.userFound);
});

router.post('/register', userControllers.registerUser, (req, res) => {
  return res.status(200).json(res.locals.registeredUser);
});

router.post('/id', userControllers.findUserById, (req, res) => {
  return res.status(200).json(res.locals.userFound);
});

router.post('/update', userControllers.updateUser, (req, res) => {
  return res.status(200);
});

// adding delete functionality
router.post('/delete', userControllers.deleteUser, (req, res) => {
  console.log('deleting user...');
  // redirect to landing (login) page (went from '/residents/delete' to '/')
  return res.redirect('../');
});

module.exports = router;