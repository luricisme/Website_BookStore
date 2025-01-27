const pool = require('../../config/database');

class PaymentModel {
    constructor() {
        this.pool = pool;
    }

    
}

module.exports = new PaymentModel(); 