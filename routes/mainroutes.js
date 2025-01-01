const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısını ayarladığınız yer

// Main sayfasına yönlendirme
router.get('/main', (req, res) => {
  if (req.session.username) {
    // offset parametresi alınır, varsayılan olarak 0
    const offset = req.query.offset || 0;

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

                // Çizgi grafik için veri al
                db.getLineChartData(offset, (err, lineChartData) => {
                  if (err) {
                    console.error('Çizgi grafik verisi alınamadı:', err);
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
                    genreData: genreData, 
                    lineChartData: lineChartData // Çizgi grafik verisini gönderiyoruz
                  });
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

router.get('/get-line-chart-data', (req, res) => {
  const offset = req.query.offset || 10; // Eğer offset parametresi yoksa 10 olsun.
  
  db.getLineChartData(offset, (err, lineChartData) => {
      if (err) {
          console.error('Çizgi grafik verisi alınamadı:', err);
          return res.status(500).send('Veritabanı hatası');
      }
      res.json(lineChartData); // Line chart verisini JSON olarak dönüyoruz
  });
});

module.exports = router;