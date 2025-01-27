const userModel = require('../../models/user.model');

class AccountController {
    // [GET]: admin/account?page=...&per_page=...
    async getAllAccount(req, res) {
        try {
            const { page = 1, per_page = 12 } = req.query;

            const pageNum = parseInt(page, 10);
            const perPageNum = parseInt(per_page, 10);

            const allAccounts = await userModel.getAllUsers(pageNum, perPageNum);
            // console.log('ALL ACCOUNT: ', allAccounts);

            const totalUsers = await userModel.getTotalUsers();
            const totalPages = Math.ceil(totalUsers / perPageNum);
            // console.log('ALL ACCOUNT: ', allAccount);
            res.status(200).json({
                message: 'Thông tin toàn bộ tài khoản được lấy thành công',
                page: pageNum,
                total_page: totalPages,
                per_page: perPageNum,
                total: totalUsers,
                users: allAccounts
            });
        } catch (err) {
            console.error('Lỗi trong quá trình lấy thông tin toàn bộ tài khoản: ', err);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình lấy thông tin toàn bộ tài khoản' });
        }
    }

    // [DELETE]: account/delete
    async deleteAccount(req, res) {
        try {
            const { email } = req.body;
            console.log('DELTE BODY: ', req.body);

            if (!email) {
                return res.status(400).json({ message: 'Server không nhận được email' });
            }

            const deletedAddress = await userModel.deleteUser(email);

            if (!deletedAddress) {
                return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa' });
            }

            res.status(200).json({
                message: 'Tài khoản được xóa thành công',
            });
        } catch (error) {
            console.error('Lỗi trong quá trình xóa tài khoản', error);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình xóa tài khoản' });
        }
    }
}

module.exports = new AccountController();