const router = require('express').Router();
const {
  getUsers,
  getProfile,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getProfile);
router.get('/me', getMe);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
