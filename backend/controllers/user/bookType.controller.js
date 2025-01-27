const BookModel = require('../../models/user/book.model');

class BookTypeController {

    // [GET] /get-list
    async index(req, res) {
        const { genre = '', page = 1 } = req.query;
        const per_page = 8;

        console.log('Query params:', req.query);

        try {
            const result = await BookModel.findBookTypesByGenre(
                parseInt(genre),
                parseInt(page, 8),
                per_page
            );

            return res.json({
                success: true,
                message: 'Tìm kiếm thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi lấy sách theo thể loại' });
        }
    }

    // [GET] /get-list/filter
    async filter(req, res) {
        const {
            genre = null,
            page = 1,
            startPrice = null,
            endPrice = null,
            age = null,
            discounted_price = null, // Mặc định là sắp xếp theo giá từ thấp đến cao
            sold_quantity = null,     // Sắp xếp theo số lượng bán nếu có
            rating_count = null       // Sắp xếp theo đánh giá nếu có
        } = req.query;

        const per_page = 8;

        // Kiểm tra thông tin truy vấn
        console.log(`Genre: ${genre}, Page: ${page}, Age: ${age}`);

        try {
            // Gọi hàm tìm kiếm với các tham số
            const result = await BookModel.findBookTypesByFilters({
                genreId: parseInt(genre),
                page: parseInt(page, 8),
                perPage: per_page,
                startPrice: startPrice ? parseFloat(startPrice) : undefined,
                endPrice: endPrice ? parseFloat(endPrice) : undefined,
                age,
                discounted_price,      // Sắp xếp theo giá (mặc định là 'ASC')
                sold_quantity,         // Sắp xếp theo số lượng bán (nếu có)
                rating_count           // Sắp xếp theo đánh giá (nếu có)
            });

            // Trả về kết quả tìm kiếm
            return res.json({
                success: true,
                message: 'Tìm kiếm thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi lấy sách theo thể loại' });
        }
    }
}

module.exports = new BookTypeController();
