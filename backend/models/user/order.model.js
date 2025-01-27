const pool = require('../../config/database');

class OrderModel {
    constructor() {
        this.pool = pool;
    }

    // Get total orders
    async getTotalOrdersByEmail(email) {
        const result = await this.pool.query(
            "SELECT COUNT(*) FROM orders WHERE email = $1",
            [email]
        );
        return parseInt(result.rows[0].count, 10);
    }
    // Get all orders
    async getAllOrdersByEmail(email, page, per_page) {
        const offset = (page - 1) * per_page;

        const result = await this.pool.query(
            "SELECT * FROM orders WHERE email = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
            [email, per_page, offset]
        );
        return result.rows;
    }
    // Get detail items of order
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
            console.error("Lỗi khi lấy dữ liệu bảng DETAIL_ORDER:", error);
            throw error;
        }
    }

    // Cancel order with status "Pending"
    async cancelOrder(client, id_order) {
        const result = await client.query(
            `UPDATE orders
            SET status = $1
            WHERE id_order = $2
            RETURNING *`,
            ['Cancelled', id_order]
        );
        return result.rows[0];
    }

    async getLastIdOrder() {
        const query = 'SELECT MAX(ID_Order) AS max_id_order FROM Orders';
        try {
            const result = await pool.query(query);

            if (result.rows.length > 0 && result.rows[0].max_id_order !== null) {
                const lastOrderId = parseInt(result.rows[0].max_id_order, 10);
                console.log('Max order ID:', lastOrderId);
                return lastOrderId;
            } else {
                // console.log('No orders found or table is empty.');
                return null; // Không có dữ liệu trong bảng
            }
        } catch (error) {
            console.error('Lỗi khi lấy ID lớn nhất của bảng order:', error);
            throw error;
        }
    }

    async create(id_order, email, total_amount, status, method, detail_address) {
        try {
            const query = `
            INSERT INTO "orders" (id_order, email, total_amount, status, method, detail_address)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `;
            const result = await pool.query(query, [id_order, email, total_amount, status, method, detail_address]);
            return result.rows[0];
        } catch (error) {
            console.error('Lỗi khi thêm vào bảng ORDER: ', error);
            throw error;
        }
    }

    async getOrderById(client, id_order) {
        try {
            const query = `
                SELECT *
                FROM orders
                WHERE id_order = $1;
            `;

            const result = await client.query(query, [id_order]);

            if (result.rows.length > 0) {
                return result.rows[0]; // Return the first matching order
            } else {
                return null; // No order found with the given id
            }
        } catch (error) {
            console.error(`Lỗi khi lấy đơn hàng có ID ${id_order}:`, error);
            throw new Error('Không thể lấy đơn hàng');
        }
    }
}

module.exports = new OrderModel(); 