const AccountBank = require('../models/accountBank.model');

class DashboardController {
    async index(req, res) {
        // Render view
        res.render('accountBank', {
            title: 'Tài khoản đã duyệt'
        });
    }

    async getData(req, res) {
        const { page = 1 } = req.query;
        const perPage = 10;

        try {
            const result = await AccountBank.getAccounts(page, perPage);

            res.json({
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

    async history(req, res) {
        const { email = '', page = 1 } = req.query;
        const perPage = 3;

        try {
            const result = await AccountBank.getUserTransactionHistory(email, page, perPage);

            res.json({
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

    async change(req, res) {
        const { id = 0 } = req.query;
        const { balance = 0 } = req.body;

        console.log(id, balance)

        try {
            await AccountBank.updateBalance(Number(id), Number(balance));

            res.json({
                message: 'Thành công',
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

}

module.exports = new DashboardController;
