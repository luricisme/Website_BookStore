require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/auth/credentials');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const privateKey = fs.readFileSync(path.join(__dirname, './sslkeys/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './sslkeys/cert.pem'), 'utf8');
const options = { key: privateKey, cert: certificate };
const bodyParser = require('body-parser');
const route = require('./routes/app.routes');
const pool = require('./config/database');
const setupSwagger = require('./config/swaggerConfig');
const pgSession = require('connect-pg-simple')(session);

const port = process.env.PORT || 8888;
const isProduction = process.env.NODE_ENV === 'production';
console.log('IS PRODUCTION: ', isProduction);

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({
    store: new pgSession({
        pool: pool, // Dùng kết nối PostgreSQL của bạn
        tableName: 'session' // Bảng lưu session
    }),
    secret: process.env.SESSION_SECRET, // Cần có biến môi trường này
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Chỉ dùng secure trên HTTPS
        httpOnly: true,
        sameSite: 'none', // Hỗ trợ CORS
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Kết nối đến PostgreSQL thất bại!', err);
    }
    console.log('Kết nối đến PostgreSQL thành công!');
    release();
    require('./config/google_passport');
});

// Set up swagger api docs
setupSwagger(app);

// Route init
route(app);

// Lắng nghe trên localhost
// https.createServer(options, app).listen(port, () => {
//     console.log(`Server running at https://localhost:${port}`);
//     console.log(`Swagger UI available at https://localhost:${port}/api-docs`);
// });

if (isProduction) {
    app.listen(port, () => {
        console.log(`🚀 Server running on Render at ${port}`);
    });
} else {
    const privateKey = fs.readFileSync(path.join(__dirname, './sslkeys/key.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, './sslkeys/cert.pem'), 'utf8');
    const options = { key: privateKey, cert: certificate };

    https.createServer(options, app).listen(port, () => {
        console.log(`🚀 Server running at https://localhost:${port}`);
        console.log(`📌 Swagger UI available at https://localhost:${port}/api-docs`);
    });
}
