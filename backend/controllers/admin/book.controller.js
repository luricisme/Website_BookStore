const BookModel = require('../../models/admin/book.model');

class BookController {

    async index(req, res) {
        const { page = 1 } = req.query;
        const per_page = 8;
        try {
            const result = await BookModel.getAllBooks(page, per_page);
            const categories =  await BookModel.getCategories();
            // Trả về dữ liệu JSON bao gồm cả danh mục và số lượng bán
            res.status(200).json({
                success: true,
                message: 'Thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
                categories: categories
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async delete(req, res) {
        const { id = null } = req.query;
        try {

            if (id) {
                await BookModel.deleteBook(id);
            }
            res.status(200).json({
                success: true,
                message: 'Thành công'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async add(req, res) {
        const {
            book_name = '',
            list_price = '',
            discounted_price = '',
            genre = 1,
            age_group = '',
            supplier = '',
            translator = '',
            author = '',
            publisher = '',
            publication_year = 2004,
            language = '',
            pages = 2,
            description = '',
            rating_count = 0,
            cover_type = '',
            available_quantity = '',
            sold_quantity = 0,
            status = 1
        } = req.body;

        console.log('du lieu vao controller:',req.body);

        console.log(req.files);  // Kiểm tra file tải lên
        const fileUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : null;
        //console.log(fileUrls);  // Kiểm tra đường dẫn file

        try {
            // Gọi model.addBook và truyền bookDetails cùng với fileUrls
            const bookDetails = {
                book_name,
                list_price,
                discounted_price,
                genre,
                age_group,
                supplier,
                translator,
                author,
                publisher,
                publication_year,
                language,
                pages,
                description,
                rating_count,
                cover_type,
                available_quantity,
                sold_quantity,
                status
            };

            // Gọi phương thức addBook từ model
            const result = await BookModel.addBook(bookDetails, fileUrls);

            res.status(200).json({
                success: true,
                message: 'Thành công',
                result
            });
        } catch (error) {
            console.error('Error in add book:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sách.' });
        }
    }

    async change(req, res) {
        const { id } = req.query;
        const {
            book_name = '',
            list_price = '',
            discounted_price = '',
            genre = 1,
            age_group = '',
            supplier = '',
            translator = '',
            author = '',
            publisher = '',
            publication_year = 2004,
            language = '',
            pages = 2,
            description = '',
            rating_count = 0,
            cover_type = '',
            available_quantity = '',
            sold_quantity = 0,
            status = 1,
            images_to_delete = []
        } = req.body;
        console.log('vao controller change:',images_to_delete);

        // Parse danh sách ảnh từ form (nếu gửi qua JSON string)
        const parsedImagesToDelete = typeof images_to_delete === 'string'
            ? JSON.parse(images_to_delete)
            : images_to_delete;

        console.log('id gui den la :',id);
        console.log(parsedImagesToDelete);

        console.log(req.files);  // Kiểm tra file tải lên
        const fileUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : null;
        console.log(fileUrls);  // Kiểm tra đường dẫn file

        try {
            // Gọi model.addBook và truyền bookDetails cùng với fileUrls
            const bookDetails = {
                book_name,
                list_price,
                discounted_price,
                genre,
                age_group,
                supplier,
                translator,
                author,
                publisher,
                publication_year,
                language,
                pages,
                description,
                rating_count,
                cover_type,
                available_quantity,
                sold_quantity,
                status
            };

            // Gọi hàm updateBook từ model
            const result = await BookModel.updateBook(
                id,                // ID của sách cần cập nhật
                bookDetails,       // Thông tin sách
                fileUrls,          // Danh sách URL ảnh mới
                parsedImagesToDelete   // Danh sách URL ảnh cần xóa
            );

            res.status(200).json({
                success: true,
                message: 'Thành công',
                result
            });
        } catch (error) {
            console.error('Error in add book:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sách.' });
        }
    }
}

module.exports = new BookController;
