const axios = require('axios');
const https = require('https');

const orderModel = require('../../models/admin/order.model');
const uOrderModel = require('../../models/user/order.model');
const order_detailModel = require('../../models/user/order_detail.model');
const bookModel = require('../../models/user/book.model');
const invoiceModel = require('../../models/user/invoice.model');
const pool = require('../../config/database');

const agent =
    process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;


class OrderController {
    // [GET]: admin/order?page=...&per_page=...
    async getAllOrders(req, res) {
        try {
            const { page = 1, per_page = 12 } = req.query;

            const pageNum = parseInt(page, 10);
            const perPageNum = parseInt(per_page, 10);

            const allOrders = await orderModel.getAllOrders(pageNum, perPageNum);

            const totalOrders = await orderModel.getTotalOrders();
            const totalPages = Math.ceil(totalOrders / perPageNum);
            // console.log('ALL ORDERS: ', allOrders);
            res.status(200).json({
                message: 'Thông tin toàn bộ đơn hàng được lấy thành công',
                page: pageNum,
                total_page: totalPages,
                per_page: perPageNum,
                total: totalOrders,
                orders: allOrders
            });
        } catch (err) {
            console.error('Lỗi trong quá trình lấy thông tin toàn bộ đơn hàng: ', err);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình lấy thông tin toàn bộ đơn hàng' });
        }
    }

    // [GET]: admin/order/detail/:id_order
    async getDetailOrder(req, res) {
        try {
            const id_order = req.params.id_order;
            const detailOrder = await orderModel.getDetailOrder(id_order);
            // console.log('DETAIL ORDER: ', detailOrder);
            res.status(200).json({
                message: 'Chi tiết đơn hàng được lấy thành công',
                detail: detailOrder
            });
        } catch (err) {
            console.error('Lỗi trong quá trình lấy chi tiết đơn hàng: ', err);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình lấy chi tiết đơn hàng' });
        }
    }

    // [GET]: admin/order/status?status=...&page=...&per_page=...
    async getOrdersByStatus(req, res) {
        try {
            const { status, page = 1, per_page = 12 } = req.query;

            const pageNum = parseInt(page, 10);
            const perPageNum = parseInt(per_page, 10);

            const allOrders = await orderModel.getOrdersByStatus(status, pageNum, perPageNum);

            const totalOrders = await orderModel.getTotalOrdersByStatus(status);
            const totalPages = Math.ceil(totalOrders / perPageNum);
            // console.log('ALL ORDERS: ', allOrders);
            res.status(200).json({
                message: 'Thông tin toàn bộ đơn hàng được lấy thành công',
                page: pageNum,
                total_page: totalPages,
                per_page: perPageNum,
                total: totalOrders,
                orders: allOrders
            });
        } catch (err) {
            console.error('Lỗi trong quá trình lấy thông tin toàn bộ đơn hàng: ', err);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình lấy thông tin toàn bộ đơn hàng' });
        }
    }

    // [PATCH]: admin/order/update-status
    async updateStatusOfOrder(req, res) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { id_order, status, email } = req.body;
            console.log('REQ BODY UPDATE STATUS: ', req.body);

            if (!id_order || !status) {
                return res.status(400).json({ message: 'Không nhận được id và status' });
            }

            const updatedOrder = await orderModel.updateStatus(client, id_order, status);

            if (status === 'Refused') {
                const order = await uOrderModel.getOrderById(client, id_order);
                const method = order.method;

                const updatedOrder = await uOrderModel.cancelOrder(client, id_order);
                console.log('UPDATED ORDER: ', updatedOrder);

                const orderDetails = await order_detailModel.getByIdOrder(client, id_order);
                console.log('ORDER DETAILS: ', orderDetails);

                const bookQuantities = orderDetails.map(detail => ({
                    id_book: detail.id_book,
                    quantity: detail.quantity
                }));
                console.log('BOOK QUANTITIES: ', bookQuantities);

                for (const { id_book, quantity } of bookQuantities) {
                    try {
                        const updatedCount = await bookModel.reverseQuantity(client, id_book, quantity);
                        if (updatedCount > 0) {
                            console.log(`Số lượng cho sách ID ${id_book} đã được cập nhật thành công`);
                        } else {
                            console.log(`Không có thay đổi cho sách ID ${id_book}`);
                        }
                    } catch (error) {
                        console.error(`Lỗi khi cập nhật số lượng cho sách ID ${id_book}:`, error);
                    }
                }

                if (method === 'online') {
                    const id_invoice = await invoiceModel.getIdByIdOrder(client, id_order);
                    console.log('ID Invoice:', id_invoice);
                    try {
                        const tokenResponse = await axios.post(`${process.env.DOMAIN_BANK}/request-server/generate-token`,
                            { email },
                            {
                                headers:
                                    { 'Content-Type': 'application/json' },
                                httpsAgent: agent
                            }
                        );
                        const token = tokenResponse.data.token;

                        const data = { email, id_invoice };

                        await axios.post(`${process.env.DOMAIN_BANK}/request-server/refund`,
                            data,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                httpsAgent: agent
                            });

                        console.log('Hoàn tiền thành công');
                    } catch (error) {
                        console.error('Lỗi khi gửi yêu cầu hoàn tiền:', error);
                        throw new Error('Gửi yêu cầu hoàn tiền thất bại');
                    }
                }
            }
            await client.query('COMMIT');
            res.status(200).json({
                message: 'Trạng thái đơn hàng được cập nhật thành công',
                updatedOrder: updatedOrder
            });
        } catch (error) {
            await client.query('ROLLBACK');
            console.log('ROLLBACK HERE');
            console.error('Lỗi khi cập nhật trạng thái đơn hàng: ', error);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình cập nhật trạng thái đơn hàng' });
        } finally {
            client.release();
        }
    }
}

module.exports = new OrderController();