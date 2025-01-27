const pool = require('../../config/database');

class CartModel {
    constructor() {
        this.pool = pool;
    }

    // 1. Get product in cart by ID Book
    async getBookByIDBook(email, id_book) {
        const result = await this.pool.query('SELECT * FROM cart WHERE email = $1 and id_book = $2',
            [email, id_book]
        );
        return result.rows[0];
    }

    // 2. Add product into cart 
    async addBookIntoCart(email, id_book, quantity) {
        const result = await this.pool.query(
            'INSERT INTO Cart (email, id_book, quantity) VALUES ($1, $2, $3)', [email, id_book, quantity]
        );
        return result.rows[0];
    }

    // 3. Update quantity - Này là cộng thêm số lượng vào (Ở ngoài trang chi tiết)
    async updateQuantity(email, id_book, quantity) {
        const result = await this.pool.query(
            'UPDATE cart SET quantity = quantity + $1 WHERE email = $2 AND id_book = $3', [quantity, email, id_book]
        );
        return result.rows[0];
    }

    // 4. Update new quantity - Này là thay thế số lượng hiện tại bằng số lượng mới (Ở trong giỏ hàng)
    async updateNewQuantity(email, id_book, newQuantity) {
        const result = await this.pool.query(
            'UPDATE cart SET quantity = $1 WHERE email = $2 AND id_book = $3', [newQuantity, email, id_book]
        );
        return result.rows[0];
    }

    // 5. Delete product
    async deleteProductFromCart(email, id_book) {
        const result = await this.pool.query(
            'DELETE FROM cart WHERE email = $1 AND id_book = $2 RETURNING *',
            [email, id_book]
        );
        return result;
    }

    // 6. Get all product
    async getAllProductInCart(email){
        const result = await this.pool.query('SELECT * FROM cart WHERE email = $1',
            [email]
        );
        return result.rows;
    }
}

module.exports = new CartModel(); 