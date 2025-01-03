const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısını ayarladığınız yer

router.get('/series', (req, res) => {
    if (req.session.username) {
      // Sayfa numarasını alıyoruz, varsayılan değeri 0
      const offset = parseInt(req.query.offset) || 0;
  
      db.getSeriesData(offset, (err, seriesData) => {
        if (err) {
          console.error('Veri alınamadı:', err);
          return res.status(500).send('Veritabanı hatası');
        }
  
        db.getTurlerData((err, turler) => {
          if (err) {
            console.error('Türler alınamadı:', err);
            return res.status(500).send('Veritabanı hatası');
          }
  
          // EJS şablonuna gönderiyoruz
          res.render('series', {
            username: req.session.username,
            seriesData: seriesData,
            turler: turler,
            currentOffset: offset  // Sayfa numarasını EJS'ye gönderiyoruz
          });
        });
      });
    } else {
      res.redirect('/login');
    }
  });

// Diziyi ekleme (POST)
router.post('/series', (req, res) => {
  const { dizi_adi, imdb_id, dizi_turu_id, imdb_puani, yayin_tarihi, sezon_sayisi, bolum_sayisi, aciklama, sure } = req.body;

  db.addNewSeries(dizi_adi, imdb_id, dizi_turu_id, imdb_puani, yayin_tarihi, sezon_sayisi, bolum_sayisi, aciklama, sure, (err) => {
    if (err) {
      console.error('Yeni dizi eklenemedi:', err);
      return res.status(500).send('Veritabanı hatası');
    }
    res.redirect('/series');  // Başarıyla ekledikten sonra tekrar diziler sayfasına yönlendir
  });
});

// Dizi silme işlemi
router.post('/series/delete', (req, res) => {
    const { dizi_id } = req.body;

    // Silme işlemini veritabanında gerçekleştir
    db.deleteSeries(dizi_id, (err, result) => {
        if (err) {
            console.error('Dizi silinemedi:', err);
            return res.status(500).json({ success: false, message: 'Silme işlemi başarısız oldu' });
        }

        // Başarılı ise JSON olarak başarı mesajı döndürüyoruz
        return res.json({ success: true, message: 'Dizi başarıyla silindi' });
    });
});
module.exports = router;