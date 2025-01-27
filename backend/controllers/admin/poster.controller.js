const posterModel = require('../../models/admin/poster.model');

class PosterController {
    // [GET]: admin/poster?page=...&per_page=...
    async getAllPoster(req, res) {
        try {
            const { page = 1, per_page = 6 } = req.query;
            const pageNum = parseInt(page, 10);
            const perPageNum = parseInt(per_page, 10);

            const allPosters = await posterModel.getAllPosters(pageNum, perPageNum);

            const totalPosters = await posterModel.getTotalPosters();
            const totalPages = Math.ceil(totalPosters / perPageNum);
            // console.log('ALL POSTERS: ', allPosters);
            res.status(200).json({
                message: 'Thông tin toàn bộ posters được lấy thành công',
                page: pageNum,
                total_page: totalPages,
                per_page: perPageNum,
                total: totalPosters,
                posters: allPosters
            });
        } catch (err) {
            console.error('Lỗi trong quá trình lấy toàn bộ poster: ', err);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình lấy thông tin toàn bộ poster' });
        }
    }

    // [POST]: admin/poster/add
    async addPoster(req, res) {
        try {
            const { name, product_link } = req.body;
            // console.log('ADD POSTER BODY: ', req.body);

            if (!name || !product_link) {
                return res.status(400).json({ message: 'Mọi trường đều phải được nhập' });
            }

            console.log('REQ FILE: ', req.file);
            if (req.file) {
                // Lấy URL của file từ Cloudinary
                const fileUrl = req.file.path;  // Lưu URL của ảnh

                // Gọi model để thêm poster vào database với URL ảnh từ Cloudinary
                const newPoster = await posterModel.add(name, fileUrl, product_link);

                res.status(200).json({
                    message: 'Poster được thêm thành công',
                    poster: newPoster
                });
            } else {
                res.status(400).json({ message: 'Không có ảnh nào được upload' });
            }
        } catch (error) {
            console.error('Lỗi trong quá trình thêm poster: ', error);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình thêm poster' });
        }
    }

    // [DELETE]: admin/poster/delete
    async deletePoster(req, res) {
        try {
            const { id_poster } = req.body;
            console.log('REQ BODY DELETE: ', req.body);

            if (!id_poster) {
                return res.status(400).json({ message: 'Server không nhận được id_poster' });
            }

            const deletedPoster = await posterModel.delete(id_poster);

            if (!deletedPoster) {
                return res.status(404).json({ message: 'Không tìm thấy poster cần xóa' });
            }

            res.status(200).json({
                message: 'Poster được xóa thành công',
            });
        } catch (error) {
            console.error('Lỗi trong quá trình xóa poster', error);
            res.status(500).json({ message: 'Đã có lỗi trong quá trình xóa poster' });
        }
    }
}

module.exports = new PosterController();