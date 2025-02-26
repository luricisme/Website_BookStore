require('dotenv').config();

// LIBRARY
const express = require('express');
const path = require('path');
const { format } = require('date-fns');
const morgan = require('morgan'); // Module ghi log
const expressHandlebars = require('express-handlebars'); // Template engine
const session = require('express-session');
const bodyParser = require('body-parser'); // Xử lý dữ liệu từ các yêu cầu HTTP
const cors = require('cors');
const route = require('./routes/index.routes');
const pool = require('./config/database');
const https = require('https');
const fs = require('fs');

const domain_backend = process.env.DOMAIN_BACKEND || 'https://localhost:8888';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
console.log('IS PRODUCTION: ', isProduction);
const port = process.env.PORT || 6868; // Cổng để chạy server

// Cấu hình CORS
app.use(cors({
    origin: isProduction ? domain_backend : 'https://localhost:8888',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json());

// Cấu hình thư mục tĩnh cho các file CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(express.json());

// Cấu hình Handlebars làm template engine
app.engine('hbs', expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
        range: (start, end) => {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        },
        formatDate: function (date) {
            return format(new Date(date), ' HH:mm:ss dd/MM/yyyy');
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Đặt thư mục views

// Kiểm tra kết nối với PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Kết nối đến PostgreSQL thất bại!', err);
    }
    console.log('Kết nối đến PostgreSQL thành công!');
    release();
});

// Route init
route(app);

// Lắng nghe trên localhost
// https.createServer(options, app).listen(port, () => console.log(`Example at: ${process.env.DOMAIN_BANK}`));

if (isProduction) {
    app.listen(port, () => {
        console.log(`🚀 Server running on Render at ${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`🚀 Server bank running at http://localhost:${port}`);
    });
}
