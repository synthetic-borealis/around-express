const Card = require('../models/card');
const User = require('../models/user');
const { responseMessages } = require('../utils/constants');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: responseMessages.serverError });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  User.findById(ownerId)
    .orFail()
    .then((owner) => {
      Card.create({ name, link, owner })
        .then((card) => {
          res.send(card);
        })
        .catch(() => {
          res.status(400).send({ message: responseMessages.invalidData });
        });
    })
    .catch(() => {
      res.status(401).send({ message: responseMessages.unauthorized });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner._id.toString() !== userId) {
        res.status(403).send({ message: responseMessages.unauthorized });
        return;
      }

      Card.findByIdAndDelete(cardId)
        .then(() => {
          res.send({ message: responseMessages.cardDeleted });
        })
        .catch(() => {
          res.status(500).send({ message: responseMessages.serverError });
        });
    })
    .catch(() => {
      res.status(404).send({ message: responseMessages.notFound });
    });
};
