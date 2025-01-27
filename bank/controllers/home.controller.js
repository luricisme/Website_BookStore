const HomeModel = require('../models/home.model');

class DashboardController {
    async index(req, res) {
        try {
            const balance = await HomeModel.getAmount();
            // Render view
            res.render('home', {
                title: 'Trang chủ',
                balance: balance
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    async getData(req, res) {
        const { page = 1 } = req.query;
        const perPage = 6;


        try {
            const result = await HomeModel.getAdminTransactionHistory(page, perPage);

            console.log(result);
            res.json({
                title: 'Lịch sử giao dịch',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                transaction: result.data
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new DashboardController;
