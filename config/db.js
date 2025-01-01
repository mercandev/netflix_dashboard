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
  getCityData
};