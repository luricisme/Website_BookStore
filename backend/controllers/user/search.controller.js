const SearchModel = require('../../models/user/search.model');
const HomeModel = require('../../models/user/home.model');

class SearchController {

    // [GET] /
    async index(req, res) {
        const { keyword = '', page = 1 } = req.query;
        const per_page = 8;

        console.log('Query params:', req.query);

        try {
            const result = await SearchModel.findBookByKeyword(
                keyword,
                parseInt(page, 8),
                per_page
            );
            const genres = await HomeModel.getCategories();

            return res.json({
                success: true,
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                message: 'Tìm kiếm thành công',
                genres : genres.data,                   // categories
                data: result.data,
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi tìm kiếm' });
        }
    }

    // [GET] /
    async filter(req, res) {
        const {
            keyword = '',
            page = 1,
            genre = null,
            startPrice = null,
            endPrice = null,
            age = null,
            discounted_price = null, // Mặc định là sắp xếp theo giá từ thấp đến cao
            sold_quantity = null,     // Sắp xếp theo số lượng bán nếu có
            rating_count = null       // Sắp xếp theo đánh giá nếu có
        } = req.query;

        const per_page = 8;

        // Kiểm tra thông tin truy vấn
        console.log(`Keyword: ${keyword}, Page: ${page}, Genre: ${genre}, Age: ${age}`);

        try {
            // Gọi hàm tìm kiếm với các tham số
            const result = await SearchModel.findBooksByFilters({
                keyword,
                page: parseInt(page, 8),
                perPage: per_page,
                genre: parseInt(genre),
                startPrice: startPrice ? parseFloat(startPrice) : undefined,
                endPrice: endPrice ? parseFloat(endPrice) : undefined,
                age,
                discounted_price,      // Sắp xếp theo giá (mặc định là 'ASC')
                sold_quantity,         // Sắp xếp theo số lượng bán (nếu có)
                rating_count           // Sắp xếp theo đánh giá (nếu có)
            });
            const genres = await HomeModel.getCategories();

            // Trả về kết quả tìm kiếm
            return res.json({
                success: true,
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                message: 'Tìm kiếm thành công',
                genres : genres.data,                   // categories
                data: result.data,
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi tìm kiếm' });
        }
    }


}

module.exports = new SearchController;