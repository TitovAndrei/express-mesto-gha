const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NoteFoundsError = require("../errors/NoteFoundsError");

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ body: card }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndDelete({ _id })
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send({ message: "Карточка удалена" });
      }
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE_NOTE_FOUND = 404;
      if (err.name === "NoteFoundsError") {
        return res
          .status(ERROR_CODE_NOTE_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else if (err.name === "CastError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при elfktybb карточки.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(
    _id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError();
      } else {
        res.status(201).send(card);
      }
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "NoteFoundsError") {
        return res.status(ERROR_CODE).send({
          message: "Передан несуществующий _id карточки.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.body;
  Card.findByIdAndUpdate(
    _id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "NoteFoundsError") {
        return res.status(ERROR_CODE).send({
          message: "Передан несуществующий _id карточки.",
        });
      } else {
        res.send({ message: "На сервере произошла ошибка" });
      }
    });
};
