const HomeModel = require('../../models/user/home.model');

class HomeController {

    // [GET] /
    async getPosters(req, res) {
        try {
            const posters = await HomeModel.getPosters();

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                posters: posters.data,                  // poster
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /
    async getTopSellingBooks(req, res) {
        try {
            const topBooks = await HomeModel.getTopSellingBooks();

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                topBooks: topBooks.data,                // Top 4 sách bán chạy
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /
    async getRandomBooksByEconomy(req, res) {
        try {
            const economyBooks = await HomeModel.getRandomBooksByGenre(1);

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                economyBooks: economyBooks.data,        // 4 sách thuộc Kinh tế
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /
    async getRandomBooksByPsychology(req, res) {
        try {
            const psychologyBooks = await HomeModel.getRandomBooksByGenre(2);

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                psychologyBooks: psychologyBooks.data,  // 4 sách thuộc Tâm lý
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /
    async getRandomBooksByLiterary(req, res) {
        try {
            const literaryBooks = await HomeModel.getRandomBooksByGenre(3);

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                literaryBooks: literaryBooks.data,      // 4 sách thuộc Văn học
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /
    async getRandomBooksByNovel(req, res) {
        try {
            const novelBooks = await HomeModel.getRandomBooksByGenre(4);

            return res.json({
                success: true,
                message: 'Lấy thông tin sách thành công',
                novelBooks: novelBooks.data,            // 4 sách thuộc Tiểu thuyết
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi load web' });
        }
    }

    // [GET] /genres
    async getCategories(req, res) {
        try {
            const genres = await HomeModel.getCategories();

            return res.json({
                success: true,
                message: 'Lấy thông tin danh mục thành công',
                genres : genres.data,                   // categories
            });
        } catch (err) {
            console.error('Lỗi truy vấn!', err);
            return res.status(500).json({ error: 'Có lỗi xảy ra khi lấy thông tin danh mục thành công' });
        }
    }
}

module.exports = new HomeController;