const router = require('express').Router();

router.get('/', (req, res) => {
  //
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
});

module.exports = router;
