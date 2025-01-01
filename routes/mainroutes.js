const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısını ayarladığınız yer

// Main sayfasına yönlendirme
router.get('/main', (req, res) => {
  if (req.session.username) {
    // Aktif kullanıcı sayısını al
    db.getActiveUserCount((err, activeUserCount) => {
      if (err) {
        console.error('Aktif kullanıcı sayısı alınamadı:', err);
        return res.status(500).send('Veritabanı hatası');
      }

      // Kapalı kullanıcı sayısını al
      db.getInactiveUserCount((err, inactiveUserCount) => {
        if (err) {
          console.error('Kapalı kullanıcı sayısı alınamadı:', err);
          return res.status(500).send('Veritabanı hatası');
        }

        // Toplam bütçe miktarını al
        db.getTotalBudget((err, totalBudget) => {
          if (err) {
            console.error('Toplam bütçe alınamadı:', err);
            return res.status(500).send('Veritabanı hatası');
          }

          // Toplam diziler sayısını al
          db.getSeriesCount((err, seriesCount) => {
            if (err) {
              console.error('Toplam diziler sayısı alınamadı:', err);
              return res.status(500).send('Veritabanı hatası');
            }

            // Toplam filmler sayısını al
            db.getFilmsCount((err, filmsCount) => {
              if (err) {
                console.error('Toplam filmler sayısı alınamadı:', err);
                return res.status(500).send('Veritabanı hatası');
              }

              // Türler bazında izlenme verisini al
              db.getGenreData((err, genreData) => {
                if (err) {
                  console.error('Türler verisi alınamadı:', err);
                  return res.status(500).send('Veritabanı hatası');
                }

                // Verileri şablona gönderiyoruz
                res.render('main', { 
                  username: req.session.username, 
                  activeUserCount: activeUserCount, 
                  inactiveUserCount: inactiveUserCount, 
                  totalBudget: totalBudget, 
                  seriesCount: seriesCount, 
                  filmsCount: filmsCount, 
                  genreData: genreData // Türler bazında izlenme verisini doğrudan gönderiyoruz
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/login'); // Eğer session'da kullanıcı yoksa login sayfasına yönlendir
  }
});

module.exports = router;