const pool = require('../../config/database');

class InvoiceModel {
    constructor() {
        this.pool = pool;
    }

    async create(id_order, total_amount) {
        try {
            const query = `
            INSERT INTO "invoice" (id_order, total_amount)
            VALUES ($1, $2) RETURNING *;
            `;
            const result = await pool.query(query, [id_order, total_amount]);
            return result.rows[0];
        } catch (error) {
            console.error('Lỗi khi thêm vào bảng INVOICE: ', error);
            throw error;
        }
    }

    async getLastIdInvoice() {
        const query = 'SELECT MAX(id_invoice) AS max_id_invoice FROM invoice';
        try {
            const result = await pool.query(query);

            if (result.rows.length > 0 && result.rows[0].max_id_invoice !== null) {
                const maxInvoiceId = parseInt(result.rows[0].max_id_invoice, 10);
                console.log('Last invoice ID:', maxInvoiceId);
                return maxInvoiceId;
            } else {
                // Nếu bảng invoice không có dữ liệu
                console.log('No invoices found.');
                return null;
            }
        } catch (error) {
            console.error('Lỗi khi lấy ID lớn nhất của bảng invoice:', error);
            throw error;
        }
    }

    async getIdByIdOrder(client, id_order) {
        try {
            const query = `
                SELECT id_invoice
                FROM invoice
                WHERE id_order = $1;
            `;

            const result = await client.query(query, [id_order]);

            if (result.rows.length > 0) {
                return result.rows[0].id_invoice; 
            } else {
                throw new Error('Không tìm thấy id_order');
            }
        } catch (error) {
            console.error(`Lỗi khi lấy id_invoice bằng id_order ${id_order}:`, error);
            throw error;
        }
    }
}

module.exports = new InvoiceModel(); 