const bcrypt = require('bcrypt');
const User = require('../models/user');
const NoteFoundsError = require('../errors/NoteFoundsError');
const { creatureToken } = require('../utils/jwt');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOTE_FOUND,
  ERROR_CODE_DEFAULT,
  ERROR_CODE_IS_FOUND,
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
  ERROR_CODE_BAD_PASSWORD,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getMe = (req, res) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError();
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res
        .status(ERROR_CODE_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getProfile = (req, res) => {
  const profileId = () => {
    if (req.params.userId !== ':userId') {
      return req.params.userId;
    }
    return req.user._id;
  };
  User.findById(profileId())
    .orFail(() => {
      throw new NoteFoundsError();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res
        .status(ERROR_CODE_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Не передан email или пароль' });
  } bcrypt.hash(password, SALT_ROUNDS).then((hash) => User.create({
    email, password: hash, name, about, avatar,
  }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(ERROR_CODE_IS_FOUND).send({ message: 'Пользователь с этим email уже зарегистрирован в системе' });
      } if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new NoteFoundsError();
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoteFoundsError();
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordTrue]) => {
      if (!isPasswordTrue) {
        throw new NoteFoundsError();
      }
      const token = creatureToken({ _id: user._id });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .status(200)
        .send();
    })
    .catch((err) => {
      if (err.name === NoteFoundsError) {
        return res.status(ERROR_CODE_BAD_PASSWORD).send({ message: 'Не передан email или пароль' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
