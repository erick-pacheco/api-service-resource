const express = require('express');

const router = express.Router();

router.all('/', (_, res) => {
  res.status(200).send('Hello, world!');
});

module.exports = router;
