const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısını ayarladığınız yer

// Main sayfasına yönlendirme
router.get('/main', (req, res) => {
  if (req.session.username) {
    // 1. Aktif kullanıcı sayısını al
    db.getActiveUserCount((err, activeUserCount) => {
      if (err) {
        console.error('Aktif kullanıcı sayısı alınamadı:', err);
        return res.status(500).send('Veritabanı hatası');
      }

      // 2. Kapalı kullanıcı sayısını al
      db.getInactiveUserCount((err, inactiveUserCount) => {
        if (err) {
          console.error('Kapalı kullanıcı sayısı alınamadı:', err);
          return res.status(500).send('Veritabanı hatası');
        }

        // 3. Toplam bütçe miktarını al
        db.getTotalBudget((err, totalBudget) => {
          if (err) {
            console.error('Toplam bütçe alınamadı:', err);
            return res.status(500).send('Veritabanı hatası');
          }

          // 4. Toplam diziler sayısını al
          db.getSeriesCount((err, seriesCount) => {
            if (err) {
              console.error('Toplam diziler sayısı alınamadı:', err);
              return res.status(500).send('Veritabanı hatası');
            }

            // 5. Toplam filmler sayısını al
            db.getFilmsCount((err, filmsCount) => {
              if (err) {
                console.error('Toplam filmler sayısı alınamadı:', err);
                return res.status(500).send('Veritabanı hatası');
              }

              // 6. Türler bazında izlenme verisini al
              db.getGenreData((err, genreData) => {
                if (err) {
                  console.error('Türler verisi alınamadı:', err);
                  return res.status(500).send('Veritabanı hatası');
                }

                // Verileri şablona gönderiyoruz
                res.render('main', { 
                  username: req.session.username, 
                  activeUserCount: activeUserCount, // Aktif kullanıcı sayısı
                  inactiveUserCount: inactiveUserCount, // Kapalı kullanıcı sayısı
                  totalBudget: totalBudget, // Toplam bütçe
                  seriesCount: seriesCount, // Toplam diziler
                  filmsCount: filmsCount, // Toplam filmler
                  genreData: genreData // Türler bazında izlenme verisi
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