const pool = require('../../config/database');

class OrderDetailModel {
    constructor() {
        this.pool = pool;
    }

    async create(id_order, id_book, quantity, price) {
        try {
            const query = `
            INSERT INTO "order_detail" (id_order, id_book, quantity, price)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const result = await pool.query(query, [id_order, id_book, quantity, price]);
            return result.rows[0];
        } catch (error) {
            console.error('Lỗi khi thêm vào bảng ORDER DETAIL: ', error);
            throw error;
        }
    }

    async getByIdOrder(client, id_order) {
        const result = await client.query(
            `SELECT * FROM order_detail
            WHERE id_order = $1`,
            [id_order]
        );
        return result.rows;
    }
}

module.exports = new OrderDetailModel(); 