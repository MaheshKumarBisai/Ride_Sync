const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    const files = {
      image: req.files.image ? req.files.image[0] : null,
      images: req.files.images || [],
    };
    res.json({ files });
  });
});

module.exports = router;