const Card = require('../models/card');
const NoteFoundsError = require('../errors/NoteFoundsError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ body: card }))
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const cardRemove = () => {
    Card.findByIdAndDelete(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NoteFoundsError('Карточка с указанным _id не найдена.');
        }
        res.status(200).send({ message: 'Карточка удалена' });
      })
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError('Передан несуществующий _id карточки.');
      } if (req.user._id === card.owner.toString()) {
        cardRemove();
      } else {
        throw new NoteFoundsError('Карточка не содержит указанный идентификатор пользователя.');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NoteFoundsError('Передан несуществующий _id карточки.');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NoteFoundsError('Передан несуществующий _id карточки.');
      } else {
        res.status(200).send(card);
      }
    })
    .catch(next);
};
