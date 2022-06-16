const Card = require('../models/card');
const NoteFoundsError = require('../errors/NoteFoundsError');
const { ERROR_CODE, ERROR_CODE_NOTE_FOUND, ERROR_CODE_DEFAULT } = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ body: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.name === 'NoteFoundsError') {
        return res
          .status(ERROR_CODE_NOTE_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при elfktybb карточки.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NoteFoundsError();
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'NoteFoundsError') {
        return res
          .status(ERROR_CODE_NOTE_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError();
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'NoteFoundsError') {
        return res
          .status(ERROR_CODE_NOTE_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};
