const mysql = require('mysql2');

// MySQL veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Veritabanı kullanıcı adınızı buraya girin
    password: 'Ayse123',       // Veritabanı şifrenizi buraya girin
    database: 'Netflix' // Veritabanınızın adını buraya girin
});

// Bağlantıyı kontrol et
db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err.stack);
    return;
  }
  console.log('Veritabanına başarıyla bağlanıldı.');
});

// Kullanıcı girişi kontrol fonksiyonu
const checkLogin = (username, password, callback) => {
  const query = 'SELECT * FROM admin_kullanici WHERE username = ? AND password = ?';
  db.execute(query, [username, password], (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Aktif kullanıcı sayısını al
const getActiveUserCount = (callback) => {
    const query = 'SELECT COUNT(*) AS activeCount FROM kullanicilar WHERE aktif_mi = 1';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result[0].activeCount); // Aktif kullanıcı sayısını geri gönder
    });
};

// Kapalı kullanıcı sayısını al
const getInactiveUserCount = (callback) => {
    const query = 'SELECT COUNT(*) AS inactiveCount FROM kullanicilar WHERE aktif_mi = 0';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result[0].inactiveCount); // Kapalı kullanıcı sayısını geri gönder
    });
};

// Toplam bütçeyi al
const getTotalBudget = (callback) => {
    const query = 'SELECT SUM(abonelik_tur.ucret) AS totalBudget FROM kullanicilar INNER JOIN abonelik_tur ON kullanicilar.abonelik_tur_id = abonelik_tur.id';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result[0].totalBudget); // Toplam bütçeyi geri gönder
    });
};

// Toplam diziler sayısını al
const getSeriesCount = (callback) => {
    const query = 'SELECT COUNT(*) AS seriesCount FROM diziler';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result[0].seriesCount); // Toplam diziler sayısını geri gönder
    });
};

// Toplam filmler sayısını al
const getFilmsCount = (callback) => {
    const query = 'SELECT COUNT(*) AS filmsCount FROM filmler';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result[0].filmsCount); // Toplam filmler sayısını geri gönder
    });
};

// Türler bazında izlenme verisini al
const getGenreData = (callback) => {
    const query = `
        SELECT turler.ad AS ad, COUNT(izlenme_kaydi.id) AS adet 
        FROM izlenme_kaydi
        INNER JOIN diziler ON izlenme_kaydi.dizi_id = diziler.id
        INNER JOIN turler ON turler.id = diziler.dizi_turu_id
        WHERE film_id IS NULL 
        GROUP BY turler.ad
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, result); // Türler bazında izlenme verilerini geri gönder
    });
};

// İllerin verilerini almak için fonksiyon
const getCityData = (callback) => {
    const query = `
       select 
            kullanicilar.il as il,
            count(kullanicilar.id) as adet
            from kullanicilar
        group by kullanicilar.il
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return callback(err, null);
      }
      callback(null, results); // İl ve adet verilerini geri gönder
    });
};

// Çizgi grafiği verisini almak için fonksiyon (offset parametresi ile)
const getLineChartData = (offset, callback) => {
  const query = `
      SELECT diziler.dizi_adi, COUNT(*) AS izlenme_adet
      FROM diziler 
      INNER JOIN izlenme_kaydi 
          ON izlenme_kaydi.dizi_id = diziler.id
      WHERE izlenme_kaydi.film_id IS NULL 
      GROUP BY diziler.dizi_adi
      LIMIT 10 OFFSET ?; 
  `;

  db.query(query, [parseInt(offset)], (err, results) => { // offset değerini tamsayıya dönüştürüyoruz
    if (err) {
      console.error('Veritabanı hatası:', err);
      return callback(err, null);
    }
    console.log(results);
    callback(null, results); // Veriyi geri gönder
  });
};

////////////////////////////////////

// Dizileri almak için fonksiyon (sayfalama ile)
const getSeriesData = (offset, callback) => {
  const query = `
    SELECT diziler.id, diziler.dizi_adi, turler.ad AS dizi_turu, DATE_FORMAT(diziler.yayin_tarihi, '%d/%m/%Y') as yayin_tarihi, diziler.sure, diziler.aciklama
    FROM diziler
    INNER JOIN turler ON diziler.dizi_turu_id = turler.id
    LIMIT 10 OFFSET ?;
  `;
  
  db.query(query, [parseInt(offset)], (err, results) => {  // parseInt ile offset'i doğru şekilde işliyoruz
    if (err) {
      console.error('Veritabanı hatası:', err);
      return callback(err, null);
    }
    callback(null, results); // Dizileri geri gönder
  });
};

// Dizi türlerini almak için fonksiyon
const getTurlerData = (callback) => {
  const query = 'SELECT * FROM turler';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return callback(err, null);
    }
    callback(null, results); // Türleri geri gönder
  });
};

// Yeni dizi eklemek için fonksiyon
const addNewSeries = (dizi_adi, imdb_id, dizi_turu_id, imdb_puani, yayin_tarihi, sezon_sayisi, bolum_sayisi, aciklama, sure, callback) => {
  const query = `
    INSERT INTO diziler (dizi_adi, imdb_id, dizi_turu_id, imdb_puani, yayin_tarihi, sezon_sayisi, bolum_sayisi, aciklama, sure)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  db.query(query, [dizi_adi, imdb_id, dizi_turu_id, imdb_puani, yayin_tarihi, sezon_sayisi, bolum_sayisi, aciklama, sure], (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return callback(err);
    }
    callback(null); // Başarıyla eklendi
  });
};

// Diziyi silme işlemi
const deleteSeries = (diziId, callback) => {
  // Öncelikle butce tablosundan ilgili diziyi sil
  const deleteFromButceQuery = 'DELETE FROM butce WHERE dizi_id = ?';

  db.query(deleteFromButceQuery, [diziId], (err, result) => {
      if (err) {
          console.error('Butçeden silme hatası:', err);
          return callback(err, null);
      }

      // İzlenme kaydı tablosundan da diziyi silelim
      const deleteFromIzlenmeKaydiQuery = 'DELETE FROM izlenme_kaydi WHERE dizi_id = ?';

      db.query(deleteFromIzlenmeKaydiQuery, [diziId], (err, result) => {
          if (err) {
              console.error('İzlenme kaydı tablosundan silme hatası:', err);
              return callback(err, null);
          }

          // Diziler tablosundan ilgili kaydı silelim
          const deleteFromDizilerQuery = 'DELETE FROM diziler WHERE id = ?';

          db.query(deleteFromDizilerQuery, [diziId], (err, result) => {
              if (err) {
                  console.error('Diziler tablosundan silme hatası:', err);
                  return callback(err, null);
              }

              // Başarıyla silindi
              callback(null, result);
          });
      });
  });
};


// Bu fonksiyonları dışa aktarıyoruz
module.exports = { 
  db, 
  checkLogin, 
  getActiveUserCount, 
  getInactiveUserCount, 
  getTotalBudget, 
  getSeriesCount, 
  getFilmsCount, 
  getGenreData,
  getCityData,
  getLineChartData,
  deleteSeries,
  getSeriesData,
  addNewSeries,
  getTurlerData
};