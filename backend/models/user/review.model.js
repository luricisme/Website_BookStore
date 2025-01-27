const pool = require('../../config/database');

class ReviewModel {
    constructor() {
        this.pool = pool;
    }

    async addReview(id_book, email, date, rating, content, image_link) {
        const client = await this.pool.connect(); // Kết nối client để bắt đầu transaction
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            // Thêm review vào bảng Review
            const reviewResult = await client.query(
                'INSERT INTO Review (id_book, email, date, rating, content, image_link, like_count) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [id_book, email, date, rating, content, image_link, 0]
            );

            // Tăng rating_count cho sách trong bảng Book
            await client.query(
                'UPDATE Book SET Rating_Count = Rating_Count + 1 WHERE ID_Book = $1',
                [id_book]
            );

            await client.query('COMMIT'); // Commit transaction

            return reviewResult.rows[0]; // Trả về review vừa được chèn
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback nếu có lỗi
            console.error('Error adding review:', error.message);
            throw new Error('Could not add review to the database.');
        } finally {
            client.release(); // Giải phóng client
        }
    }

    async getReviews(id, page = 1, perPage = 5) {
        try {
            // Lấy tổng số đánh giá cho sách
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM Review
                WHERE ID_Book = $1
            `;
            const countResult = await pool.query(countQuery, [id]);
            const totalRecords = parseInt(countResult.rows[0].total, 10);

            // Tính toán phân trang
            const totalPages = Math.ceil(totalRecords / perPage);
            const offset = (page - 1) * perPage;

            // Lấy dữ liệu đánh giá cho trang hiện tại
            const reviewQuery = `
                SELECT r.ID_Review, r.Email, r.Date, r.Rating, r.Content, r.Image_Link, r.Like_Count, u.Name AS user_name
                FROM Review r
                LEFT JOIN Users u ON r.Email = u.Email
                WHERE r.ID_Book = $1
                ORDER BY r.ID_Review ASC
                LIMIT $2 OFFSET $3
            `;
            const reviewResult = await pool.query(reviewQuery, [id, perPage, offset]);

            return {
                reviews: reviewResult.rows,  // Các đánh giá trong trang hiện tại
                total_records: totalRecords, // Tổng số đánh giá
                total_pages: totalPages,     // Tổng số trang
                per_page: perPage,           // Số đánh giá mỗi trang
                current_page: page           // Trang hiện tại
            };
        } catch (error) {
            console.error('Error in getReview:', error.message);
            throw new Error('Failed to fetch reviews.');
        }
    }
}

module.exports = new ReviewModel();
