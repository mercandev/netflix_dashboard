const express = require('express');
const router = express.Router();
const { checkLogin } = require('../config/db');

// Login sayfası
router.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

// Login işlemi
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  checkLogin(username, password, (err, results) => {
    if (err) {
      console.error('Login hatası:', err);
      return res.status(500).send('Veritabanı hatası');
    }

    if (results.length > 0) {
      // Kullanıcı adı doğru, session'a ekleyelim
      req.session.username = username; // Kullanıcı adını session'a ekleyelim

      // Ana sayfaya yönlendir
      res.redirect('/main'); // Başarılı giriş sonrası main sayfasına yönlendir
    } else {
      // Hatalı giriş
      res.render('login', { errorMessage: 'Hatalı kullanıcı adı veya şifre' });
    }
  });
});

// Logout işlemi
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Çıkış hatası');
    }
    res.redirect('/login'); // Çıkış yaptıktan sonra login sayfasına yönlendir
  });
});

module.exports = router;