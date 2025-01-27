const home = require('./home.routes');
const transaction = require('./transaction.routes');
const accountBank = require('./accountBank.routes');
const accountReq = require('./accountReq.routes');
const handle = require('./handle.routes');

function route(app) {
    
    app.use('/request-server', handle);
    app.use('/acc-request', accountReq);
    app.use('/transaction', transaction);
    app.use('/acc-bank', accountBank);
    app.use('/', home);
}

module.exports = route;
