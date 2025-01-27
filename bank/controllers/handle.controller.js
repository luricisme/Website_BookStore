const HandleModel = require('../models/handle.model');
const AccountBank = require('../models/accountBank.model');

class DashboardController {
    async register(req, res) {
        const { email } = req.body;

        console.log(email)

        try {
            await HandleModel.createRequest(email);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
            });
        }
    }

    async pay(req, res) {
        const { email, id_invoice, amount } = req.body;

        console.log(email, id_invoice, amount)

        const numericAmount = Number(amount);

        // Kiểm tra tính hợp lệ của amount
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền không hợp lệ',
            });
        }

        try {
            await HandleModel.processPayment(email, id_invoice, numericAmount);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
            });
        }
    }

    async refund(req, res) {
        const { email, id_invoice } = req.body;

        console.log(email, id_invoice)

        try {
            await HandleModel.refundPayment(email, id_invoice);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
            });
        }
    }

    async get(req, res) {
        const { email = '', page = 1 } = req.body;
        const perPage = 7;

        try {
            const balance = await AccountBank.getAmount(email);
            const result = await AccountBank.getUserTransactionHistory(email, page, perPage);

            res.json({
                balance: balance,
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new DashboardController;
