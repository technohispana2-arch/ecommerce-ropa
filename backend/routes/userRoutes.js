const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, admin, updateUser);

module.exports = router;
