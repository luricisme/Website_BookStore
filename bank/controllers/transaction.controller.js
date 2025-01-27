const TransactionModel = require('../models/transaction.model');

class DashboardController {
    async index(req, res) {
        // Render view
        res.render('transaction', {
            title: 'Lịch sử giao dịch'
        });
    }

    async getData(req, res) {
        const { page = 1, fromDate = 'null', toDate = 'null'} = req.query;
        const perPage = 10;

        console.log(fromDate, toDate)

        try {
            let result;

            //result = await TransactionModel.getPaginatedTransactions(page, perPage);
            // if (fromDate && toDate) {
                result = await TransactionModel.getFilteredPaginatedTransactions(page, perPage, fromDate, toDate);
            // } else {
            // }

            console.log(result)

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
