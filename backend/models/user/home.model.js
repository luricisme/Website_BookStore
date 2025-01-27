const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class HomeModel {
    /**
     * Lấy danh sách poster
     */
    static async getPosters() {
        const result = await pool.query(
            `SELECT * 
             FROM Poster`
        );

        return {
            data: result.rows,
        };
    }

    /**
     * Lấy danh sách Category
     */
    static async getCategories() {
        const result = await pool.query(
            `SELECT * 
             FROM Categories
             ORDER BY Categories.ID_Category ASC`
        );

        return {
            data: result.rows,
        };
    }

    /**
     * Lấy top 4 sách bán chạy nhất
     */
    static async getTopSellingBooks() {
        const result = await pool.query(
            `SELECT b.*, c.Name AS Genre_Name 
             FROM Book b
             LEFT JOIN Categories c ON b.Genre = c.ID_Category
             ORDER BY b.Sold_Quantity DESC 
             LIMIT 4`
        );

        // Lặp qua các sách và lấy ảnh cho mỗi sách
        for (let book of result.rows) {
            const imgQuery = `SELECT Image_Link FROM Img_Book WHERE ID_Book = $1`;
            const imgResult = await pool.query(imgQuery, [book.id_book]);
            book.images = imgResult.rows.map(img => img.image_link); // Gán ảnh vào sách
        }

        return {
            data: result.rows,
        };
    }

    /**
     * Lấy 4 sách ngẫu nhiên từ một thể loại
     */
    static async getRandomBooksByGenre(genreId) {
        const result = await pool.query(
            `SELECT b.*, c.Name AS Genre_Name 
             FROM Book b
             LEFT JOIN Categories c ON b.Genre = c.ID_Category
             WHERE b.Genre = $1
             ORDER BY RANDOM() 
             LIMIT 4`,
            [genreId]
        );

        // Lặp qua các sách và lấy ảnh cho mỗi sách
        for (let book of result.rows) {
            const imgQuery = `SELECT Image_Link FROM Img_Book WHERE ID_Book = $1`;
            const imgResult = await pool.query(imgQuery, [book.id_book]);
            book.images = imgResult.rows.map(img => img.image_link); // Gán ảnh vào sách
        }

        return {
            data: result.rows,
        };
    }
}

module.exports = HomeModel;
