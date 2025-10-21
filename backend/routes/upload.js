const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ location: req.file.location, filename: req.file.filename });
});

router.post('/multiple', upload.array('images', 10), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files uploaded.');
  }
  const locations = req.files.map(file => file.location);
  res.json({ locations });
});

module.exports = router;