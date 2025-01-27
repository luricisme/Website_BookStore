const pool = require('../../config/database'); // Kết nối cơ sở dữ liệu

class BookModel {

    async getCategories() {
        const result = await pool.query(
            `SELECT * 
             FROM Categories
             ORDER BY Categories.ID_Category ASC`
        );

        return {
            data: result.rows,
        };
    }

    async getAllBooks(page = 1, perPage = 8) {
        // Lấy tất cả sách có Status = 1
        const allBooksResult = await pool.query(
            `SELECT b.*, c.Name AS genre_name
             FROM Book b
             LEFT JOIN Categories c ON b.Genre = c.ID_Category
             WHERE b.Status = 1
             ORDER BY b.id_book  --Thêm cái này để dễ thêm ảnh.
             `
        );

        // Tất cả sách phù hợp
        const allBooks = allBooksResult.rows;

        // Tính toán phân trang
        const totalRecords = allBooks.length;
        const totalPages = Math.ceil(totalRecords / perPage);
        const offset = (page - 1) * perPage;

        // Lấy sách cho trang hiện tại
        const paginatedBooks = allBooks.slice(offset, offset + perPage);

        // Lấy ảnh cho từng sách trong trang hiện tại
        for (let book of paginatedBooks) {
            const imgQuery = `SELECT Image_Link FROM Img_Book WHERE ID_Book = $1`;
            const imgResult = await pool.query(imgQuery, [book.id_book]);
            book.images = imgResult.rows.map(img => img.image_link);
        }

        return {
            data: paginatedBooks,      // Dữ liệu sách của trang hiện tại
            total_records: totalRecords, // Tổng số sách
            total_pages: totalPages,    // Tổng số trang
            per_page: perPage,          // Số sách mỗi trang
            current_page: page,         // Trang hiện tại
        };
    }


    async addBook(bookDetails, imageUrls) {
        const {
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
            rating_count = 0,
            cover_type,
            available_quantity,
            sold_quantity = 0,
            status = 1
        } = bookDetails;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Thêm sách vào bảng Book
            const bookQuery = `
                INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity, Status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
                RETURNING ID_Book
            `;
            const bookResult = await client.query(bookQuery, [
                book_name, list_price, discounted_price, genre, age_group, supplier, translator, author, publisher, publication_year, language, pages, description, rating_count, cover_type, available_quantity, sold_quantity, status
            ]);
            const bookId = bookResult.rows[0].id_book;

            // Thêm URL ảnh vào bảng Img_Book
            if (imageUrls && imageUrls.length > 0) {
                const imgQuery = `
                    INSERT INTO Img_Book (ID_Book, Image_Link) 
                    VALUES ($1, unnest($2::text[]))
                `;
                await client.query(imgQuery, [bookId, imageUrls]);
            }

            await client.query('COMMIT');
            return bookId;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in addBook:', error.message);
            throw new Error('Failed to add book.');
        } finally {
            client.release();
        }
    }

    async deleteBook(bookId) {
        try {
            const query = `UPDATE Book SET Status = 0 WHERE ID_Book = $1`;
            await pool.query(query, [bookId]);
            return true;
        } catch (error) {
            console.error('Error in deleteBook:', error.message);
            throw new Error('Failed to delete book.');
        }
    }

    async updateBook(bookId, bookDetails, imageUrlsToAdd, imageUrlsToRemove) {
        const {
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
        } = bookDetails;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Cập nhật thông tin sách
            const updateQuery = `
                UPDATE Book
                SET
                    book_name = $1,
                    list_price = $2,
                    discounted_price = $3,
                    genre = $4,
                    age_group = $5,
                    supplier = $6,
                    translator = $7,
                    author = $8,
                    publisher = $9,
                    publication_year = $10,
                    language = $11,
                    pages = $12,
                    description = $13,
                    rating_count = $14,
                    cover_type = $15,
                    available_quantity = $16,
                    sold_quantity = $17,
                    status = $18
                WHERE id_book = $19
            `;
            await client.query(updateQuery, [
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
                status,
                bookId
            ]);

            // Xóa URL ảnh theo danh sách
            if (imageUrlsToRemove && imageUrlsToRemove.length > 0) {
                const deleteQuery = `
                    DELETE FROM Img_Book
                    WHERE id_book = $1 AND image_link = ANY($2::text[])
                `;
                await client.query(deleteQuery, [bookId, imageUrlsToRemove]);
            }

            // Thêm URL ảnh mới
            if (imageUrlsToAdd && imageUrlsToAdd.length > 0) {
                const addImgQuery = `
                    INSERT INTO Img_Book (id_book, image_link)
                    VALUES ($1, unnest($2::text[]))
                `;
                await client.query(addImgQuery, [bookId, imageUrlsToAdd]);
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in updateBook:', error.message);
            throw new Error('Cập nhật sách thất bại.');
        } finally {
            client.release();
        }
    }


}

module.exports = new BookModel();
