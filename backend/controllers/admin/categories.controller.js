const CategoriesModel = require('../../models/admin/categories.model');

class CategoriesController {

    async index(req, res) {
        const { page = 1 } = req.query;
        const per_page = 8;
        try {
            const result = await CategoriesModel.getAllCategories(page, per_page);

            res.status(200).json({
                success: true,
                message: 'Thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async add(req, res) {
        const { name } = req.body;
        console.log(name);

        try {
            const result = await CategoriesModel.addCategory(name);

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Thành công',
                    result
                });
            }
            console.log('fail')
            return res.status(400).json({
                success: false,
                message: 'Thất bại'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async change(req, res) {
        const { id, name } = req.body;
        console.log(id, name);

        console.log('fail')
        try {
            const result = await CategoriesModel.updateCategoryName(id, name);

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Thành công',
                    result
                });
            }
            console.log('fail')
            return res.status(400).json({
                success: false,
                message: 'Thất bại'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async delete(req, res) {
        const { id } = req.body;
        console.log(id);

        try {
            const result = await CategoriesModel.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: 'Thành công',
                result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = new CategoriesController;
