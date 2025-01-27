const AccReqModel = require('../models/accountReq.model');

class DashboardController {
    async index(req, res) {
        // Render view
        res.render('accountReq', {
            title: 'Tài khoản chờ duyệt'
        });
    }

    async getData(req, res) {
        const { page = 1 } = req.query;
        const perPage = 10;

        try {
            const result = await AccReqModel.getAccounts(page, perPage);

            console.log(result)
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


    async valid(req, res) {
        const { email = '', initial_balance = 0 } = req.body;

        console.log(email, initial_balance)

        try {
            const result = await AccReqModel.approveRequest(email, initial_balance)

            console.log(result)

            res.json({
                message: 'Thành công'
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

}

module.exports = new DashboardController;
