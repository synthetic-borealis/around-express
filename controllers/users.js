const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then(user => res.send(user))
    .catch(() => res.status(404).send({ message: 'card or user not found' }));
};