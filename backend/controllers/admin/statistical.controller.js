const StatisticalModel = require('../../models/admin/statistical.model');

class StatisticalController {

    async index(req, res) {
        const { year } = req.query;
        try {
            const stats = await StatisticalModel.getDashboardStats();
            const { revenueLabels, revenueData } = await StatisticalModel.getRevenueGrowth(parseInt(year));
            const productsSold = await StatisticalModel.getProductsSold();

            // Trả về dữ liệu JSON bao gồm cả danh mục và số lượng bán
            res.status(200).json({
                stats,
                revenueLabels,
                revenueData,
                productsSold, // Bao gồm danh sách danh mục và số lượng bán
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = new StatisticalController;
