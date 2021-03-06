const bcrypt = require('bcrypt');
const User = require('../models/user');
const NoteFoundsError = require('../errors/NoteFoundsError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateErrorCode = require('../errors/DuplicateErrorCode');
const AuthError = require('../errors/AuthError');
const ValidationError = require('../errors/ValidationError');
const { creatureToken } = require('../utils/jwt');
const {
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
} = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError('Пользователь по указанному _id не найден.');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  const profileId = () => {
    if (req.params.userId !== ':userId') {
      return req.params.userId;
    }
    return req.user._id;
  };
  User.findById(profileId())
    .orFail(() => {
      throw new NoteFoundsError('Пользователь по указанному _id не найден.');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  } bcrypt.hash(password, SALT_ROUNDS).then((hash) => User.create({
    email, password: hash, name, about, avatar,
  }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new DuplicateErrorCode('Пользователь с этим email уже зарегистрирован в системе'));
      } if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError('Пользователь по указанному _id не найден.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidationError('Переданные некорректные данные');
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Передан неверный email или пароль');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordTrue]) => {
      if (!isPasswordTrue) {
        throw new AuthError('Передан неверный email или пароль');
      }
      const token = creatureToken({ _id: user._id });
      res.status(200).send({ token });
    })
    .catch(next);
};
