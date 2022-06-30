const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { isUrlValid } = require('../utils/isUrlValid');

const {
  getUsers,
  getProfile,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(isUrlValid),
    }),
  }),
  updateAvatar,
);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getProfile,
);

module.exports = router;
