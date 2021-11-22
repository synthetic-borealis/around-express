const fsPromises = require('fs').promises;
const path = require('path');
const router = require('express').Router();

const userDataPath = path.join(__dirname, '../data/users.json');

router.get('/', (req, res) => {
  fsPromises.readFile(userDataPath, 'utf8')
    .then((data) => {
      res.send(JSON.parse(data));
    })
    .catch(() => {
      res.status(500).send({ message: 'An error has occured on the server' });
    });
});

router.get('/:id', (req, res) => {
  fsPromises.readFile(userDataPath, 'utf8')
    .then((data) => {
      const users = JSON.parse(data);
      const user = users.find((usr) => usr._id === req.params.id);

      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User ID not found' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'An error has occured on the server' });
    });
});

module.exports = router;
