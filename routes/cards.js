const router = require('express').Router();
const fsPromises = require('fs').promises;
const path = require('path');

router.get('/', (req, res) => {
  const cardDataPath = path.join(__dirname, '../data/cards.json');

  fsPromises.readFile(cardDataPath, 'utf8')
    .then((data) => {
      const parsedCardData = JSON.parse(data);
      res.send(parsedCardData);
    })
    .catch(() => {
      res.status(500).send({ message: 'An error has occured on the server' });
    });
});

module.exports = router;
