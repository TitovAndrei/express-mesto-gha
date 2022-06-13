const User = require("../models/user");
const ValidationError = require("../errors/ValidationError");
const NoteFoundsError = require("../errors/NoteFoundsError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
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
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send({ user });
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

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.status(200).send(user);
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
