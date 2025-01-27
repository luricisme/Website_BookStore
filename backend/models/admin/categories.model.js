const pool = require('../../config/database'); // Kết nối cơ sở dữ liệu

class CategoryModel {
    // Lấy thông tin tất cả các danh mục
    async getAllCategories(page = 1, perPage = 10) {
        try {
            // Lấy tổng số danh mục
            const countQuery = `SELECT COUNT(*) AS total FROM Categories`;
            const countResult = await pool.query(countQuery);
            const totalRecords = parseInt(countResult.rows[0].total, 10);

            // Tính toán phân trang
            const totalPages = Math.ceil(totalRecords / perPage);
            const offset = (page - 1) * perPage;

            // Lấy dữ liệu các danh mục cho trang hiện tại
            const query = `
                SELECT * 
                FROM Categories 
                ORDER BY ID_Category 
                LIMIT $1 OFFSET $2
            `;
            const result = await pool.query(query, [perPage, offset]);

            return {
                data: result.rows,       // Danh mục trong trang hiện tại
                total_records: totalRecords, // Tổng số danh mục
                total_pages: totalPages,    // Tổng số trang
                per_page: perPage,          // Số danh mục mỗi trang
                current_page: page          // Trang hiện tại
            };
        } catch (error) {
            console.error('Error in getAllCategories:', error.message);
            throw new Error('Failed to fetch categories.');
        }
    }

    // Thêm danh mục mới
    async addCategory(categoryName) {
        try {
            // Kiểm tra tên mới không trùng với các mục khác
            const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM Categories WHERE LOWER(Name) = LOWER($1)`;
            const duplicateResult = await pool.query(checkDuplicateQuery, [categoryName]);

            if (parseInt(duplicateResult.rows[0].count) > 0) {
                return null;
            }

            const query = `INSERT INTO Categories (Name) VALUES ($1) RETURNING *`;
            const result = await pool.query(query, [categoryName]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in addCategory:', error.message);
            throw new Error('Failed to add category.');
        }
    }

    // Xóa danh mục
    async deleteCategory(categoryId) {
        try {
            await pool.query('BEGIN');

            const updateBooksQuery = `UPDATE Book SET Genre = NULL WHERE Genre = $1`;
            await pool.query(updateBooksQuery, [categoryId]);

            const deleteCategoryQuery = `DELETE FROM Categories WHERE ID_Category = $1 RETURNING *`;
            const result = await pool.query(deleteCategoryQuery, [categoryId]);

            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error in deleteCategory:', error.message);
            throw new Error('Failed to delete category.');
        }
    }

    // Sửa tên danh mục
    async updateCategoryName(categoryId, newName) {
        try {
            // Kiểm tra tên mới không trùng với các mục khác
            const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM Categories WHERE LOWER(Name) = LOWER($1) AND ID_Category != $2`;
            const duplicateResult = await pool.query(checkDuplicateQuery, [newName, categoryId]);

            if (parseInt(duplicateResult.rows[0].count) > 0) {
                return null;
            }
            const query = `UPDATE Categories SET Name = $1 WHERE ID_Category = $2 RETURNING *`;
            const result = await pool.query(query, [newName, categoryId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in updateCategoryName:', error.message);
            throw new Error('Failed to update category name.');
        }
    }
}

module.exports = new CategoryModel();
