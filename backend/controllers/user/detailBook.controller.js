const BookModel = require('../../models/user/book.model');
const ReviewModel = require('../../models/user/review.model');

class DetailBookController {

    // [GET] /
    async index(req, res) {
        const { id } = req.query;

        console.log(id)

        console.log('Query params:', req.query);

        try {
            const result = await BookModel.getBook(
                parseInt(id)
            );

            const relatedBooks = await BookModel.getRandomBooksByGenre(result.data.genre, result.data.id_book);

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                data: result.data,
                relatedBooks: relatedBooks.data      // 4 book liên quan
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi tìm kiếm' });
        }
    }

    async review(req, res) {
        // Kiểm tra nếu có file đã upload
        const fileUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : null;

        // Lấy các trường bổ sung từ req.body
        const { id_book, content, date, rating, like_count = 0 } = req.body;

        console.log(req.email)

        // Xử lý dữ liệu (ví dụ lưu vào database)
        console.log('Dữ liệu nhận được:', {
            id_book,
            date,
            rating,
            like_count,
            fileUrls
        });

        try {
            await ReviewModel.addReview(
                parseInt(id_book),
                req.email,
                date,
                parseInt(rating),
                content,
                fileUrls ? fileUrls[0] : null // Nếu có ảnh thì lấy ảnh đầu tiên, không có ảnh thì là null
            );

            res.status(200).json({ success: true, message: 'Review đã được thêm thành công' });
        } catch (err) {
            console.error('Lỗi khi thêm review:', err);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm review', details: err.message });
        }
    }

    async getReviews(req, res) {
        const { id, page = 1 } = req.query;
        const per_page = 5;
        try {
            const result = await ReviewModel.getReviews(id, page, per_page);
            // Trả về dữ liệu JSON bao gồm cả danh mục và số lượng bán
            res.json({
                success: true,
                message: 'Thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                reviews: result.reviews
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }


}

module.exports = new DetailBookController;