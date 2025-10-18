const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.status(400).json({ message: err });
    } else {
      if(req.files == undefined){
        res.status(400).json({ message: 'Error: No File Selected!' });
      } else {
        let imagePath = '';
        if (req.files['image']) {
          imagePath = `/uploads/${req.files['image'][0].filename}`;
        }
        let imagesPaths = [];
        if (req.files['images']) {
          imagesPaths = req.files['images'].map(file => `/uploads/${file.filename}`);
        }
        res.json({
          message: 'Files uploaded successfully',
          image: imagePath,
          images: imagesPaths
        });
      }
    }
  });
});

module.exports = router;