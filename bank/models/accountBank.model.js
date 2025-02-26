const pool = require('../config/database'); // Kết nối đến cơ sở dữ liệu
const pool2 = require('../config/database_backend'); // Kết nối đến cơ sở dữ liệu ở backend

class StatisticalModel {
    async getAmount(email) {
        try {
            const result = await pool.query(
                `SELECT TRIM(TO_CHAR(balance, '999G999G999G990')) AS balance
                 FROM account_bank
                 WHERE email = $1`, [email]
            );

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error in getAmount:', error.message);
            throw new Error('Failed to fetch getAmount.');
        }
    }

    async getAccounts(page = 1, perPage = 10) {
        try {
            // Truy vấn danh sách tài khoản không phải admin
            const accountsQuery = `
                SELECT 
                    Account_ID,
                    Email,
                    TRIM(TO_CHAR(Balance, '999G999G999G990')) AS Balance
                FROM Account_Bank
                WHERE Is_Admin = FALSE
                ORDER BY Account_ID ASC
            `;
            const accountsResult = await pool.query(accountsQuery);
            const accounts = accountsResult.rows;

            // Pagination
            const totalRecords = accounts.length;
            const totalPages = Math.ceil(totalRecords / perPage);
            const offset = (page - 1) * perPage;
            const paginatedAccounts = accounts.slice(offset, offset + perPage);

            // Lấy danh sách email từ kết quả đã phân trang
            const emails = paginatedAccounts.map((row) => row.email);

            // Truy vấn thông tin người dùng từ bảng Users dựa trên email
            const usersQuery = `
                SELECT 
                    Email,
                    Name AS full_name,
                    Phone AS phone_number
                FROM Users
                WHERE Email = ANY($1)
            `;
            const usersResult = await pool2.query(usersQuery, [emails]);

            // Tạo map để ánh xạ email với thông tin người dùng
            const userMap = new Map(
                usersResult.rows.map((user) => [user.email, user])
            );

            // Kết hợp thông tin tài khoản và người dùng
            const result = paginatedAccounts.map((account) => {
                const userInfo = userMap.get(account.email) || {};
                return {
                    account_id: account.account_id,
                    email: account.email,
                    full_name: userInfo.full_name || null,
                    phone_number: userInfo.phone_number || null,
                    balance: account.balance,
                };
            });

            return {
                data: result,
                total_records: totalRecords,
                total_pages: totalPages,
                per_page: perPage,
                current_page: page,
            };
        } catch (error) {
            console.error('Error in getAccounts:', error.message);
            throw new Error('Failed to fetch account list.');
        }
    }

    async getUserTransactionHistory(email, page = 1, perPage = 10) {
        try {
            // Tính toán giới hạn và điểm bắt đầu
            const offset = (page - 1) * perPage;

            // Truy vấn chính để lấy dữ liệu
            const query = `
                SELECT 
                    uth.Transaction_ID,
                    uth.Email,
                    uth.Admin_Email,
                    uth.Transaction_Type,
                    TRIM(TO_CHAR(uth.Amount, '999G999G999G990')) AS Amount,
                    TO_CHAR(uth.Transaction_Date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'HH24:MI:SS - DD-MM-YYYY') AS Transaction_Date,
                    TRIM(TO_CHAR(uth.Balance_Before, '999G999G999G990')) AS Balance_Before,
                    TRIM(TO_CHAR(uth.Balance_After, '999G999G999G990')) AS Balance_After,
                    uth.Description
                FROM User_Transaction_History uth
                WHERE uth.Email = $1
                ORDER BY uth.Transaction_Date DESC -- Sắp xếp theo ngày giao dịch giảm dần
                LIMIT $2 OFFSET $3; -- Giới hạn số lượng bản ghi và điểm bắt đầu
            `;

            const transactionsResult = await pool.query(query, [email, perPage, offset]);

            // Truy vấn để đếm tổng số giao dịch của user
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM User_Transaction_History
                WHERE Email = $1;
            `;
            const countResult = await pool.query(countQuery, [email]);
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
                    user_email: transaction.email,
                    amount: transaction.amount,
                    transaction_date: transaction.transaction_date,
                    transaction_type: transaction.transaction_type,
                    balance_before: transaction.balance_before,
                    balance_after: transaction.balance_after,
                    description: transaction.description,
                })),
            };
        } catch (error) {
            console.error('Error in getUserTransactionHistory:', error.message);
            throw new Error('Failed to fetch user transaction history with pagination.');
        }
    }


    async updateBalance(id = 0, balance = 0) {
        balance = parseInt(balance);
        const client = await pool.connect();

        try {
            // Kiểm tra dữ liệu đầu vào
            if (id <= 0 || balance < 0) {
                throw new Error('Invalid account ID, balance or admin email.');
            }

            await client.query('BEGIN'); // Bắt đầu transaction

            // Lấy thông tin số dư hiện tại của tài khoản
            const currentBalanceQuery = `SELECT Balance FROM Account_Bank WHERE Account_ID = $1 AND Is_Admin = false`;
            const currentBalanceResult = await client.query(currentBalanceQuery, [id]);

            if (currentBalanceResult.rowCount === 0) {
                throw new Error(`Account with ID ${id} not found.`);
            }

            const currentBalance = parseInt(currentBalanceResult.rows[0].balance);

            const adminBalanceQuery = `SELECT Email FROM Account_Bank WHERE Is_Admin = TRUE`;
            const adminResult = await client.query(adminBalanceQuery);
            const adminEmail = adminResult.rows[0].email;

            // Cập nhật số dư mới cho tài khoản
            const updateQuery = `
                UPDATE Account_Bank
                SET Balance = $1
                WHERE Account_ID = $2 AND Is_Admin = false
            `;
            await client.query(updateQuery, [balance, id]);

            // Thêm vào bảng User_Transaction_History
            const insertTransactionQuery = `
                INSERT INTO User_Transaction_History (Email, Admin_Email, Transaction_Type, Amount, Balance_Before, Balance_After, Description)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;
            const accountQuery = `SELECT Email FROM Account_Bank WHERE Account_ID = $1`;
            const accountResult = await client.query(accountQuery, [id]);
            const email = accountResult.rows[0].email;

            await client.query(insertTransactionQuery, [
                email,
                adminEmail, // Email của admin thực hiện thay đổi
                'Balance Update', // Loại giao dịch
                Math.abs(balance - currentBalance), // Số tiền giao dịch (sự thay đổi giữa số dư mới và cũ)
                currentBalance, // Số dư trước khi cập nhật
                balance, // Số dư sau khi cập nhật
                'Admin cập nhật số dư mới' // Mô tả giao dịch
            ]);

            await client.query('COMMIT'); // Hoàn tất transaction
            console.log(`Balance for account ID ${id} updated to ${balance}.`);
            return { success: true, message: 'Balance updated and transaction recorded successfully.' };
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback nếu gặp lỗi
            console.error('Error in updateBalance:', error.message);
            throw new Error('Failed to update balance.');
        } finally {
            client.release(); // Giải phóng client
        }
    }


}

module.exports = new StatisticalModel;
