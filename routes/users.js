const fs = require('fs');
const path = require('path');
const router = require('express').Router();

const userDataPath = path.join(__dirname, '../data/users.json');

router.get('/', (req, res) => {
  const reader = fs.createReadStream(userDataPath, { encoding: 'utf8' });
  let userData = '';

  reader.on('data', (chunk) => {
    userData += chunk;
  });

  reader.on('end', () => {
    // JSON.parse throws an exception when
    // attempting to parse some files (tested with a vsix file).
    try {
      const parsedUserData = JSON.parse(userData);
      res.send(parsedUserData);
    } catch (err) {
      res.status(500).send({ message: 'An error has occured on the server' });
    }
  });

  reader.on('error', () => {
    res.status(500).send({ message: 'An error has occured on the server' });
  });
});

router.get('/:id', (req, res) => {
  const reader = fs.createReadStream(userDataPath, { encoding: 'utf8' });
  let userData = '';

  reader.on('data', (chunk) => {
    userData += chunk;
  });

  reader.on('end', () => {
    try {
      const parsedUserData = JSON.parse(userData);
      const user = parsedUserData.find((usr) => usr._id === req.params.id);

      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User ID not found' });
      }
    } catch (err) {
      res.status(500).send({ message: 'An error has occured on the server' });
    }
  });

  reader.on('error', () => {
    res.status(500).send({ message: 'An error has occured on the server' });
  });
});

module.exports = router;
