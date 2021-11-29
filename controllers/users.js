const User = require('../models/user');
const { errorMessages } = require('../utils/constants');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => { res.send(users); })
    .catch(() => { res.status(500).send(errorMessages.serverError); });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => { res.send(user); })
    .catch(() => { res.send(404).send(errorMessages.notFound); });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => { res.send(user); })
    .catch(() => { res.status(400).send(errorMessages.invalidData); });
};
