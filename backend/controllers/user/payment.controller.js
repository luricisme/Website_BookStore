const orderModel = require('../../models/user/order.model');
const orderDetailModel = require('../../models/user/order_detail.model');
const invoiceModel = require('../../models/user/invoice.model');
const cartModel = require('../../models/user/cart.model');
const bookModel = require('../../models/user/book.model');

const axios = require('axios');
const pool = require('../../config/database');

const https = require('https');

// Public thì bỏ đi
const agent =
    process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false }) 
        : undefined;


class PaymentController {
    async addProductToPayment(req, res) {
        try {
            // Lấy danh sách {id_book, quantity}
            const cartItems = req.body.cart;

            if (!Array.isArray(cartItems)) {
                return res
                    .status(400)
                    .json({ MessageChannel: 'Dữ liệu nhận không phải là mảng' });
            }
            const newIdOrder = await orderModel.getLastIdOrder() + 1;

            // Lưu danh sách giỏ hàng vào session
            req.session.id_order = newIdOrder;
            req.session.selectedItem = cartItems;

            // console.log('SAVED CART ITEM INTO SESSION: ', req.session.selectedItem);
            // console.log('SESSION HERE: ', req.session);

            return res.status(200).json({
                message: 'Sản phẩm được lưu vào session thành công',
                id_order: req.session.id_order,
                selectedItem: req.session.selectedItem
            });
        } catch (error) {
            console.error('Lỗi trong quá trình lưu sản phẩm vào session', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async getPaymentForm(req, res) {
        try {
            const id_order = req.session.id_order;
            const selectedItems = req.session.selectedItem;

            if (!selectedItems || selectedItems.length === 0) {
                return res.status(400).json({ message: 'Chưa chọn sản phẩm nào' });
            }

            const bookDetails = [];
            for (const item of selectedItems) {
                const { id_book, quantity } = item;

                // Truy vấn chi tiết sách từ database
                const book = await bookModel.getBookByID(id_book);

                bookDetails.push({
                    id_book: book.id_book,
                    book_name: book.book_name,
                    list_price: book.list_price,
                    discounted_price: book.discounted_price,
                    quantity: quantity,
                    image_links: book.image_links
                });
            }

            return res.status(200).json({
                id_order: id_order,
                books: bookDetails
            });
        } catch (error) {
            console.error('Lỗi trong quá trình lấy thông tin hiện ra payment', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async finishPayment(req, res) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Chuẩn bị dữ liệu cần thiết để lưu vào bảng: orders, order_detail
            const { detail_address, method, total_amount } = req.body;
            const id_order = req.session.id_order;
            const selectedItems = req.session.selectedItem;
            const email = req.email;
            const status = 'Pending';

            if (!selectedItems || selectedItems.length === 0) {
                return res.status(400).json({ message: 'Chưa chọn sản phẩm nào' });
            }

            const bookDetails = [];
            for (const item of selectedItems) {
                const { id_book, quantity } = item;
                // Truy vấn chi tiết sách từ database
                const book = await bookModel.getBookByID(id_book);

                bookDetails.push({
                    id_book: book.id_book,
                    list_price: book.list_price,
                    discounted_price: book.discounted_price,
                    available_quantity: book.available_quantity,
                    sold_quantity: book.sold_quantity,
                    quantity: quantity,
                });
            }

            // XỬ LÝ LỰA CHỌN THANH TOÁN CỦA NGƯỜI DÙNG
            // Thanh toán khi nhận hàng 
            if (method === 'cod') {
                const newOrder = await orderModel.create(id_order, email, total_amount, status, method, detail_address);
                saveIntoOrderDetail(id_order, bookDetails);
                const newInvoice = await invoiceModel.create(id_order, total_amount);
                updateQuantityOfBook(bookDetails);
            } else if (method === 'online') {
                const tokenResponse = await axios.post(
                    `${process.env.DOMAIN_BANK}/request-server/generate-token`,
                    { email }, // Dữ liệu gửi đi
                    {
                        headers: { 'Content-Type': 'application/json' },
                        httpsAgent: agent
                    },

                );
                const token = tokenResponse.data.token;
                const id_invoice = await invoiceModel.getLastIdInvoice() + 1;

                const amount = total_amount;
                const data = { email, id_invoice, amount };
                console.log('DATE SEND: ', data);
                const paymentResponse = await axios.post(
                    `${process.env.DOMAIN_BANK}/request-server/pay`,
                    data, // Dữ liệu thanh toán
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        httpsAgent: agent
                    },
                );
                console.log('PAYMENT RESPONSE: ', paymentResponse.data);
                if (paymentResponse.data.success) {
                    const newOrder = await orderModel.create(id_order, email, total_amount, status, method, detail_address);
                    saveIntoOrderDetail(id_order, bookDetails);
                    const newInvoice = await invoiceModel.create(id_order, total_amount);
                    updateQuantityOfBook(bookDetails);
                } else {
                    console.error('Thanh toán không thành công');
                    return res.status(400).json({ message: 'Thanh toán không thành công' });
                }
            }
            await deleteFromCart(email, bookDetails);
            await client.query('COMMIT');
            return res.status(200).json({
                message: 'Đã lưu các dữ liệu vào các bảng order, order_detail và invoice'
            });
        } catch (error) {
            console.error('Lỗi trong quá trình lấy thông tin hiện ra payment', error);
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'Lỗi server' });
        }
        finally {
            client.release();
        }
    }
}

async function saveIntoOrderDetail(id_order, bookDetails) {
    try {
        for (const item of bookDetails) {
            const { id_book, quantity, discounted_price } = item;

            await orderDetailModel.create(id_order, id_book, quantity, discounted_price);
        }

        console.log(`Toàn bộ đơn hàng chi tiết của đơn hàng ${id_order} đã được lưu. `);
    } catch (error) {
        console.error('Lỗi khi lưu chi tiết đơn hàng:', error);
        throw error;
    }
}

async function updateQuantityOfBook(bookDetails) {
    try {
        for (const book of bookDetails) {
            const { id_book, quantity } = book;

            await bookModel.updateQuantity(id_book, quantity);
        }

        console.log('Toàn bộ sách được cập nhật số lượng');
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sách: ', error);
        throw error;
    }
}

async function deleteFromCart(email, bookDetails){
    try {
        for (const book of bookDetails) {
            const { id_book } = book;

            await cartModel.deleteProductFromCart(email, id_book);
        }

        console.log('Sách đã được mua đã bị xóa khỏi giỏ hàng');
    } catch (error) {
        console.error('Lỗi khi xóa sách: ', error);
        throw error;
    }
}

module.exports = new PaymentController();