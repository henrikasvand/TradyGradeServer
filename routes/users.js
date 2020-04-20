const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser
} = require('../dao/usersDao');
const { getItemsByUserId } = require('../dao/itemsDao');
const User = require('../models/User');
const hashService = require('../auth/hashService');
const { authenticateToken } = require('../middleware/middleware'); //apply to all routes that require the user to be logged in 

router
  .route('/')
  // .get(authenticateToken, async (req, res, next) => {
    .get(async (req, res, next) => {
    try {
      let usersData = await getUsers();
      if (usersData) {
        res.status(200).json(usersData);
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ success: false });
      next(err);
    }
  })
  //registration route:
  .post(async (req, res, next) => {
    try {
      const { name, email, picture, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({
          error: 'Please fill out the required fields',
          success: false
        });
        return;
      }
      const hashedPassword = await hashService.hash(req.body.password);
      const user = new User((id = null), name, hashedPassword, email, picture); //initialize new user with id null (database generates id)
      const data = await createUser(user);
      if (data) {
        res.status(201).json({
          success: true,
          id: data,
          msg: 'Registration successful! You may now log in.'
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Username or email already in use, please try again.'
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'An unexpected error occurred. Please try again later.'
      });
      next(err);
    }
  });

router
  .route('/:id')
  .get(authenticateToken, async (req, res, next) => {
    try {
      let userData = await getUser(req.params.id);
      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ success: false });
      next(err);
    }
  })
  .put(authenticateToken, async (req, res, next) => {
    try {
      const hashedPassword = await hashService.hash(req.body.password);
      req.body.password = hashedPassword;
      const response = await updateUser(req.params.id, req.body);
      if (response) {
        res
          .status(204)
          .json({ success: true, msg: 'User successfully updated.' });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ success: false, msg: 'Server error' });
      next(err);
    }
  })
  .delete(authenticateToken, async (req, res, next) => {
    try {
      const id = req.params.id;
      let data = await deleteUser(id);
      if (!data) res.status(400).json({ success: false, msg: 'No such user' });
      else
        res
          .status(200)
          .json({ success: true, msg: 'User successfully deleted.' });
    } catch (err) {
      next(err);
      res.status(500).json({ success: false });
    }
  });

//GET all items user has listed on the marketplace - Pekka

router.get('/:id/items', authenticateToken, async (req, res) => {
  try {
    let response = await getItemsByUserId(req.params.id);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(400).json({ success: false, error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
    next(err);
  }
});

module.exports = router;
