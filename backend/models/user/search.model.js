const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class SearchModel {
    /**
     * Tìm kiếm sách dựa trên từ khóa tìm kiếm
     */
    static async findBookByKeyword(keyword, page = 1, perPage = 10) {
        const searchKeyword = `%${keyword}%`;
        const offset = (page - 1) * perPage;

        // Đếm tổng số bản ghi phù hợp (chỉ lấy sách có Status = 1)
        const countResult = await pool.query(
            `SELECT COUNT(*) AS total 
             FROM Book b 
             LEFT JOIN Categories c ON b.Genre = c.ID_Category 
             WHERE (b.Book_Name ILIKE $1 OR b.Author ILIKE $1 OR c.Name ILIKE $1) 
               AND b.Status = 1`,
            [searchKeyword]
        );
        const totalRecords = parseInt(countResult.rows[0].total, 10);

        // Lấy dữ liệu phân trang
        const result = await pool.query(
            `SELECT b.*, c.Name AS Genre_Name 
             FROM Book b 
             LEFT JOIN Categories c ON b.Genre = c.ID_Category 
             WHERE (b.Book_Name ILIKE $1 OR b.Author ILIKE $1 OR c.Name ILIKE $1) 
               AND b.Status = 1
             LIMIT $2 OFFSET $3`,
            [searchKeyword, perPage, offset]
        );

        // Lặp qua các sách và lấy ảnh cho mỗi sách
        for (let book of result.rows) {
            const imgQuery = `SELECT Image_Link FROM Img_Book WHERE ID_Book = $1`;
            const imgResult = await pool.query(imgQuery, [book.id_book]);
            book.images = imgResult.rows.map(img => img.image_link); // Gán ảnh vào sách
        }

        return {
            data: result.rows,
            total_records: totalRecords,
            total_pages: Math.ceil(totalRecords / perPage),
            per_page: perPage,
            current_page: page,
        };
    }


    /**
     * Tìm kiếm sách dựa trên từ khóa tìm kiếm + filter theo hạng mục
     */
    static async findBooksByFilters({
        keyword,
        page = 1,
        perPage = 10,
        genre,
        startPrice,
        endPrice,
        age,
        discounted_price = null,
        sold_quantity = null,
        rating_count = null
    }) {
        const searchKeyword = `%${keyword}%`;
        const searchAge = `%${age}%`;
        const offset = (page - 1) * perPage;

        const conditions = ['b.Status = 1']; // Luôn lọc các sách có Status = 1
        const values = [];

        // Xây dựng các điều kiện lọc
        if (keyword) {
            conditions.push('(b.Book_Name ILIKE $1 OR b.Author ILIKE $1 OR c.Name ILIKE $1)');
            values.push(searchKeyword);
        }
        if (genre) {
            conditions.push('b.Genre = $' + (values.length + 1));
            values.push(genre);
        }
        if (startPrice !== undefined) {
            conditions.push('b.Discounted_Price >= $' + (values.length + 1));
            values.push(startPrice);
        }
        if (endPrice !== undefined) {
            conditions.push('b.Discounted_Price <= $' + (values.length + 1));
            values.push(endPrice);
        }
        if (age) {
            conditions.push('b.Age_Group ILIKE $' + (values.length + 1));
            values.push(searchAge);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        // Đếm tổng số bản ghi
        const countQuery = `SELECT COUNT(*) AS total 
                            FROM Book b 
                            LEFT JOIN Categories c ON b.Genre = c.ID_Category 
                            ${whereClause}`;
        const countResult = await pool.query(countQuery, values);
        const totalRecords = parseInt(countResult.rows[0].total, 10);

        // Kiểm tra điều kiện sắp xếp
        let orderConditions = [];
        if (discounted_price !== null) {
            orderConditions.push(`b.Discounted_Price ${discounted_price}`);
        } else if (sold_quantity !== null) {
            orderConditions.push(`b.Sold_Quantity ${sold_quantity}`);
        } else if (rating_count !== null) {
            orderConditions.push(`b.Rating_Count ${rating_count}`);
        }

        const orderBy = orderConditions.length ? `ORDER BY ${orderConditions.join(', ')}` : '';

        // Lấy dữ liệu phân trang
        const dataQuery = `
            SELECT b.*, c.Name AS Genre_Name 
            FROM Book b 
            LEFT JOIN Categories c ON b.Genre = c.ID_Category 
            ${whereClause} 
            ${orderBy}
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(perPage, offset);

        const result = await pool.query(dataQuery, values);

        // Lặp qua các sách và lấy ảnh cho mỗi sách
        for (let book of result.rows) {
            const imgQuery = `SELECT Image_Link FROM Img_Book WHERE ID_Book = $1`;
            const imgResult = await pool.query(imgQuery, [book.id_book]);
            book.images = imgResult.rows.map(img => img.image_link); // Gán ảnh vào sách
        }

        return {
            data: result.rows,
            total_records: totalRecords,
            total_pages: Math.ceil(totalRecords / perPage),
            per_page: perPage,
            current_page: page,
        };
    }

}

module.exports = SearchModel;
