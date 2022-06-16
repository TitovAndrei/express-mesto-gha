const User = require('../models/user');
const NoteFoundsError = require('../errors/NoteFoundsError');
const { ERROR_CODE, ERROR_CODE_NOTE_FOUND } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
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
      return res
        .status(ERROR_CODE)
        .send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
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
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
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
        res.status(200).send({ avatar });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } if (err.name === 'NoteFoundsError') {
        return res.status(ERROR_CODE_NOTE_FOUND).send({
          message: 'Пользователь по указанному id не найден.',
        });
      }
      return res.send({ message: 'На сервере произошла ошибка' });
    });
};
