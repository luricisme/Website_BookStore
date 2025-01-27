const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu
const pool2 = require('../../backend/config/database'); // Kết nối đến cơ sở dữ liệu ở backend

class StatisticalModel {
    async getAmount() {
        try {
            const result = await pool.query(
                `SELECT TRIM(TO_CHAR(balance, '999G999G999G990')) AS balance
                 FROM account_bank
                 WHERE is_admin = true;`
            );

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error in getAmount:', error.message);
            throw new Error('Failed to fetch getAmount.');
        }
    }

    async getAdminTransactionHistory(page = 1, perPage = 10) {
        try {
            // Tính toán giới hạn và điểm bắt đầu
            const offset = (page - 1) * perPage;
    
            // Truy vấn chính để lấy dữ liệu
            const query = `
                SELECT 
                    ath.Transaction_ID,
                    ath.Admin_Email,
                    ath.User_Email,
                    TRIM(TO_CHAR(ath.Amount, '999G999G999G990')) AS Amount,
                    TO_CHAR(ath.Transaction_Date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'HH24:MI:SS - DD-MM-YYYY') AS Transaction_Date,
                    TRIM(TO_CHAR(ath.Balance_Before, '999G999G999G990')) AS Balance_Before,
                    TRIM(TO_CHAR(ath.Balance_After, '999G999G999G990')) AS Balance_After,
                    ath.Description
                FROM Admin_Transaction_History ath
                ORDER BY ath.Transaction_Date DESC -- Sắp xếp theo ngày giao dịch giảm dần
                LIMIT $1 OFFSET $2; -- Giới hạn số lượng bản ghi và điểm bắt đầu
            `;
    
            const transactionsResult = await pool.query(query, [perPage, offset]);
    
            // Truy vấn để đếm tổng số giao dịch
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM Admin_Transaction_History;
            `;
            const countResult = await pool.query(countQuery);
            const totalTransactions = parseInt(countResult.rows[0].total, 10);
    
            // Tính tổng số trang
            const totalPages = Math.ceil(totalTransactions / perPage);
    
            // Trả về kết quả
            return {
                current_page: page,
                per_page: perPage,
                total_pages: totalPages,
                total_records: totalTransactions,
                data: transactionsResult.rows.map((transaction) => ({
                    transaction_id: transaction.transaction_id,
                    admin_email: transaction.admin_email,
                    user_email: transaction.user_email,
                    amount: transaction.amount,
                    transaction_date: transaction.transaction_date,
                    balance_before: transaction.balance_before,
                    balance_after: transaction.balance_after,
                    description: transaction.description,
                })),
            };
        } catch (error) {
            console.error('Error in getAdminTransactionHistory:', error.message);
            throw new Error('Failed to fetch admin transaction history with pagination.');
        }
    }
    
    

    async getLatestTransactions() {
        try {
            // Lấy dữ liệu từ bảng `Payment` và liên kết với `Account_Bank`
            const depositQuery = `
                SELECT 
                    p.ID_Invoice,
                    p.ID_Payment,
                    p.Email,
                    TRIM(TO_CHAR(p.Amount, '999G999G999G990')) AS Amount,
                    TO_CHAR(p.Payment_Date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'HH24:MI:SS - DD-MM-YYYY') AS Payment_Date,
                    ab.Account_ID,
                    TRIM(TO_CHAR(ab.Balance, '999G999G999G990')) AS Balance
                FROM Payment p
                JOIN Account_Bank ab ON p.Email = ab.Email
                ORDER BY p.Payment_Date DESC
                LIMIT 7;
            `;
            const depositResult = await pool.query(depositQuery);

            // Nếu không có giao dịch nào, trả về rỗng
            if (depositResult.rows.length === 0) {
                return [];
            }

            // Lấy danh sách email từ kết quả đầu tiên
            const emails = depositResult.rows.map((row) => row.email);

            // Truy vấn thông tin người dùng từ bảng `Users` dựa trên email
            const usersQuery = `
                SELECT 
                    Email,
                    Name AS full_name,
                    Phone AS phone_number
                FROM Users
                WHERE Email = ANY($1);
            `;
            const usersResult = await pool2.query(usersQuery, [emails]);

            // Tạo một map để ánh xạ email với thông tin người dùng
            const userMap = new Map(
                usersResult.rows.map((user) => [user.email, user])
            );

            // Kết hợp dữ liệu từ bảng `Payment` và `Users`
            const result = depositResult.rows.map((transaction) => {
                const userInfo = userMap.get(transaction.email) || {};
                return {
                    id_invoice: transaction.id_invoice,
                    id_payment: transaction.id_payment,
                    email: transaction.email,
                    full_name: userInfo.full_name || null,
                    phone_number: userInfo.phone_number || null,
                    amount: transaction.amount,
                    payment_date: transaction.payment_date,
                    account_number: transaction.account_id,
                    balance: transaction.balance,
                };
            });

            return result;
        } catch (error) {
            console.error('Error in getLatestTransactions:', error.message);
            throw new Error('Failed to fetch latest transactions.');
        }
    }


}

module.exports = new StatisticalModel;
