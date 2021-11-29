const Card = require('../models/card');
const User = require('../models/user');
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
  const ownerId = req.user._id;

  // Ensure only known users can create or manipulate card data
  User.findById(ownerId)
    .orFail()
    .then((owner) => {
      Card.create({ name, link, owner })
        .then((card) => {
          res.send(card);
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
    })
    .catch((error) => {
      switch (error.name) {
        // Looking for a non-existing document by id throws a CastError sometimes
        case 'CastError':
        case 'DocumentNotFoundError':
          res.status(401).send({ message: responseMessages.unauthorized });
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

  User.findById(userId)
    .orFail()
    .then(() => {
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
    })
    .catch((error) => {
      switch (error.name) {
        case 'CastError':
        case 'DocumentNotFoundError':
          res.status(401).send({ message: responseMessages.unauthorized });
          break;

        default:
          res.status(500).send({ message: responseMessages.serverError });
      }
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then(() => {
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
    })
    .catch(() => {
      res.status(401).send({ message: responseMessages.unauthorized });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
