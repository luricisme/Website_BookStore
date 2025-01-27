const pool = require('../../config/database');

class OrderModel {
    constructor() {
        this.pool = pool;
    }

    // CRUD
    // Get total orders
    async getTotalOrders() {
        const result = await this.pool.query("SELECT COUNT(*) FROM orders");
        return parseInt(result.rows[0].count, 10);
    }
    // Get all orders - with pagination
    async getAllOrders(page, per_page) {
        const offset = (page - 1) * per_page;

        const result = await this.pool.query(
            "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            [per_page, offset]
        );
        return result.rows;
    }

    async getOrdersByStatus(status, page, per_page) {
        const offset = (page - 1) * per_page;

        const result = await this.pool.query(
            "SELECT * FROM orders WHERE status = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            [per_page, offset, status]
        );
        return result.rows;
    }
    async getTotalOrdersByStatus(status) {
        const result = await this.pool.query("SELECT COUNT(*) FROM orders WHERE status = $1",
            [status]
        );
        return parseInt(result.rows[0].count, 10);
    }

    // Get detail orders
    async getDetailOrder(id_order) {
        const query = `
            SELECT 
                o.id_order,
                o.email,
                o.total_amount,
                o.status,
                o.created_at,
                o.method,
                o.detail_address,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id_detail', d.id_detail,
                        'id_book', d.id_book,
                        'quantity', d.quantity,
                        'price', d.price,
                        'book_name', b.book_name
                    )
                ) AS books
            FROM 
                orders o
            JOIN 
                order_detail d 
            ON 
                o.id_order = d.id_order
            JOIN 
                book b
            ON 
                d.id_book = b.id_book
            WHERE 
                o.id_order = $1
            GROUP BY 
                o.id_order, o.email, o.total_amount, o.status, o.created_at, o.method
        `;
        try {
            const result = await this.pool.query(query, [id_order]);
            return result.rows;
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }

    // Update status of product
    async updateStatus(client, id_order, status) {
        const result = await client.query(
            `UPDATE orders
            SET status = $1
            WHERE id_order = $2
            RETURNING *`,
            [status, id_order]
        );
        return result.rows[0];
    }
}

module.exports = new OrderModel(); 