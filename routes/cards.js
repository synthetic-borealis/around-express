const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const cardDataPath = path.join(__dirname, '../data/cards.json');
  const reader = fs.createReadStream(cardDataPath, { encoding: 'utf8' });
  let cardData = '';

  reader.on('data', (chunk) => {
    cardData += chunk;
  });

  reader.on('end', () => {
    const parsedCardData = JSON.parse(cardData);
    res.send(parsedCardData);
  });

  reader.on('error', () => {
    res.status(500).send({ message: 'An error has occured on the server' });
  });
});

module.exports = router;
