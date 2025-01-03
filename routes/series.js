const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Veritabanı bağlantısı

// Diziler listesini göster (GET /series)
router.get('/series', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }

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

      res.render('series', {
        username: req.session.username,
        seriesData: seriesData,
        turler: turler,
        currentOffset: offset
      });
    });
  });
});

// Dizi silme işlemi (POST /series/delete)
router.post('/series/delete', (req, res) => {
  const { dizi_id } = req.body;

  db.deleteSeries(dizi_id, (err, result) => {
    if (err) {
      console.error('Dizi silinemedi:', err);
      return res.status(500).json({ success: false, message: 'Silme işlemi başarısız oldu' });
    }

    // Başarılı ise JSON dönüyoruz (AJAX için)
    return res.json({ success: true, message: 'Dizi başarıyla silindi' });
  });
});

// Dizi ekleme işlemi (POST /series/add) - AJAX
router.post('/add', (req, res) => {
  const {
    dizi_adi,
    imdb_id,
    dizi_turu_id,
    imdb_puani,
    yayin_tarihi,
    sezon_sayisi,
    bolum_sayisi,
    aciklama,
    sure
  } = req.body;

  db.addNewSeries(
    dizi_adi,
    imdb_id,
    dizi_turu_id,
    imdb_puani,
    yayin_tarihi,
    sezon_sayisi,
    bolum_sayisi,
    aciklama,
    sure,
    (err) => {
      if (err) {
        console.error('Yeni dizi eklenemedi:', err);
        // AJAX isteğine JSON olarak hata dönüyoruz
        return res.status(500).json({ success: false, message: 'Veritabanı hatası' });
      }
      // AJAX isteğine başarı dönüyoruz
      return res.json({ success: true, message: 'Dizi başarıyla eklendi' });
    }
  );
});

module.exports = router;