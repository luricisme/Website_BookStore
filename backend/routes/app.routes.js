const authRoutes = require('./auth/auth.routes');
const googleRoutes = require('./auth/google.routes');
const userRoutes = require('./user/index.routes');
const adminRoutes = require('./admin/index.routes');

const verifyJWT = require('../middlewares/auth/verifyJWT');
const verifyRole = require('../middlewares/auth/verifyRole');

function route(app) {
    app.use('/', authRoutes); 
    app.use('/', googleRoutes);
    app.use('/', userRoutes); 
    app.use('/admin', verifyJWT, verifyRole('admin'), adminRoutes); 
}

module.exports = route;
