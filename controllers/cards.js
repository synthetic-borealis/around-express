const Card = require('../models/card');
const { responseMessages } = require('../utils/constants');

const getAllCards = (req, res) => {
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

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.populate(card, { path: 'owner' })
        .then(() => {
          res.send(card);
        })
        .catch(() => {
          res.status(500).send(responseMessages.serverError);
        });
    })
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError':
          res.status(400).send({ message: responseMessages.invalidData });
          break;

        default:
          res.status(500).send({ message: responseMessages.serverError });
      }
    });
};

const deleteCard = (req, res) => {
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
    .catch((error) => {
      switch (error.name) {
        // Looking for a non-existing document by id can also throw a CastError
        case 'CastError':
        case 'DocumentNotFoundError':
          res.status(404).send({ message: responseMessages.notFound });
          break;

        default:
          res.status(500).send({ message: responseMessages.serverError });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      switch (error.name) {
        case 'CastError':
        case 'DocumentNotFoundError':
          res.status(404).send({ message: responseMessages.notFound });
          break;

        default:
          res.status(500).send({ message: responseMessages.serverError });
      }
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      switch (error.name) {
        case 'CastError':
        case 'DocumentNotFoundError':
          res.status(404).send({ message: responseMessages.notFound });
          break;

        default:
          res.status(500).send({ message: responseMessages.serverError });
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
