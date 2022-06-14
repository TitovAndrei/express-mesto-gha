const User = require("../models/user");
const NoteFoundsError = require("../errors/NoteFoundsError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.getProfile = (req, res) => {
  const { _id } = req.body;
  User.findById({ _id })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE_NOTE_FOUND = 404;
      if (err.name === "NoteFoundsError") {
        res.status(ERROR_CODE).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.status(ERROR_CODE_NOTE_FOUND).send({ message: "Переданы некорректные данные" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { _id, name, about } = req.body;
  User.findByIdAndUpdate(
    { _id, name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE_NOT_FOUND = 404;
      if (err.name === "CastError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else if (err.name === "NoteFoundsError") {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { _id, avatar } = req.body;
  User.findByIdAndUpdate({ _id, avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE_NOT_FOUND = 404;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else if (err.name === "NoteFoundsError") {
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: `Пользователь по указанному ${req.user._id} не найден.`,
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};
