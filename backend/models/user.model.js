const pool = require('../config/database');

class UserModel {
    constructor() {
        this.pool = pool;
    }

    // Create User - REGISTER 
    async createUser(email, name, phone, role, passwordorgoogleid) {
        const result = await this.pool.query(
            `INSERT INTO users (email, name, phone, role, passwordorgoogleid) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [email, name, phone, role, passwordorgoogleid]
        );
        return result.rows[0];
    }

    // Create usser with google strategy
    async createUserWithGoogle(email, name, role, passwordorgoogleid){
        const result = await this.pool.query(
            `INSERT INTO users (email, name, role, passwordorgoogleid) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [email, name, role, passwordorgoogleid]
        );
        return result.rows[0];
    }

    // Get user by Email - FIND CONFLICT
    async getUserByEmail(email) {
        const result = await this.pool.query(
            'SELECT * FROM Users WHERE Email = $1',
            [email]
        );
        return result.rows[0];
    }

    // Update User - Profile
    async updateUser(email, { name, phone, gender, birthday }) {
        const result = await this.pool.query(
            `UPDATE users 
            SET name = $1, phone = $2, gender = $3, birth_date = $4
            WHERE email = $5
            RETURNING *`,
            [name, phone, gender, birthday, email]
        );
        return result.rows[0];
    }

    // Delete User
    async deleteUser(email) {
        const result = await this.pool.query(
            'DELETE FROM users WHERE email = $1 RETURNING *',
            [email]
        );
        return result.rows[0];
    }

    // Get total users
    async getTotalUsers() {
        const result = await this.pool.query("SELECT COUNT(*) FROM users WHERE role = '1'");
        return parseInt(result.rows[0].count, 10);
    }

    // Get All Users
    async getAllUsers(page, per_page) {
        const offset = (page - 1) * per_page;

        const result = await this.pool.query(
            "SELECT * FROM users WHERE role = '1' LIMIT $1 OFFSET $2",
            [per_page, offset]
        );
        return result.rows;
    }

    // Get User by Refreshtoken
    async getUserByRefreshToken(refreshToken) {
        const result = await this.pool.query(
            'SELECT * FROM users WHERE refresh_token = $1',
            [refreshToken]
        );
        return result.rows[0];
    }

    // Update user - refreshtoken
    async updateRefreshToken(email, refreshToken) {
        const result = await this.pool.query(
            `UPDATE users 
            SET refresh_token = $1
            WHERE email = $2
            RETURNING *`,
            [refreshToken, email]
        );
        return result.rows[0];
    }

    // Get profile user 
    async getProfileByEmail(email) {
        const result = await this.pool.query(
            'SELECT name, phone, email, gender, birth_date, role FROM Users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    // Change password
    async changePassword(newPassword, email) {
        const result = await this.pool.query(
            `UPDATE users 
            SET passwordorgoogleid = $1
            WHERE email = $2
            RETURNING *`,
            [newPassword, email]
        );
        return result.rows[0];
    }
}

module.exports = new UserModel(); 