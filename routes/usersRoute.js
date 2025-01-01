const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısını ayarladığınız yer

router.get('/users', (req, res) => {
  if (req.session.username) {
    db.getCityData((err, cityData) => {
      if (err) {
        console.error('Veri alınamadı:', err);
        return res.status(500).send('Veritabanı hatası');
      }

      // `cityData`'yı JSON formatında frontend'e gönderiyoruz
      res.render('users', {
        username: req.session.username,
        cityData: JSON.stringify(cityData)  // cityData'yı JSON formatında gönderiyoruz
      });
    });
  } else {
    res.redirect('/login'); // Eğer session'da kullanıcı yoksa login sayfasına yönlendir
  }
});

module.exports = router;