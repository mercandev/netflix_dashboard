const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const path = require('path');
const routes = require('./routes/loginroutes'); // loginroutes.js dosyasını içeri aktar
const mainRoutes = require('./routes/mainroutes'); // mainroutes.js dosyasını içeri aktar
const usersRoutes = require('./routes/usersRoute'); // mainroutes.js dosyasını içeri aktar


// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // JSON verilerini işlemek için

// Session middleware
app.use(session({
  secret: 'ayse123', // Güvenlik için rastgele bir anahtar
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Eğer HTTPS kullanmıyorsanız false yapın
}));

// View engine ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes dosyasındaki yönlendirmeleri kullan
app.use(routes); // loginroutes.js dosyasındaki yönlendirmeleri kullan
app.use(mainRoutes); // mainroutes.js dosyasındaki yönlendirmeleri kullan
app.use(usersRoutes); 


// Sunucuyu başlat
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});