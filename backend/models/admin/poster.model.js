const pool = require('../../config/database');

class PosterModel {
    constructor() {
        this.pool = pool;
    }

    // CRUD
    // Get total posters
    async getTotalPosters() {
        const result = await this.pool.query("SELECT COUNT(*) FROM poster");
        return parseInt(result.rows[0].count, 10);
    }

    // Get all poster
    async getAllPosters(page, per_page) {
        const offset = (page - 1) * per_page;

        const result = await this.pool.query(
            "SELECT * FROM poster LIMIT $1 OFFSET $2",
            [per_page, offset]
        );
        return result.rows;
    }

    // Add poster
    async add(name, image_link, product_link) {
        const result = await this.pool.query(
            `INSERT INTO poster (name, image_link, product_link) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [name, image_link, product_link]
        );
        return result.rows[0];
    }

    async delete(id_poster) {
        const result = await this.pool.query(
            'DELETE FROM poster WHERE id_poster = $1 RETURNING *',
            [id_poster]
        );
        return result.rows[0];
    }
}

module.exports = new PosterModel(); 