const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.status(400).json({ message: err });
    } else {
      if(req.file == undefined){
        res.status(400).json({ message: 'Error: No File Selected!' });
      } else {
        res.json({
          message: 'File uploaded successfully',
          filePath: `/uploads/${req.file.filename}`
        });
      }
    }
  });
});

module.exports = router;