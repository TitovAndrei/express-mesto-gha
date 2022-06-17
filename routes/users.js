const router = require('express').Router();
const {
  createUser,
  getUsers,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getProfile);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);
router.post('/users', createUser);

module.exports = router;
