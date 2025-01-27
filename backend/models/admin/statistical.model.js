const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class StatisticalModel {
    // Lấy doanh thu hàng tháng từ các đơn hàng đã hoàn thành
    async getRevenueGrowth(year) {
        try {
            const query = `
                SELECT months.month, COALESCE(SUM(o.Total_Amount), 0) AS revenue
                FROM (
                    -- Tạo bảng tháng từ 1 đến 12
                    SELECT generate_series(1, 12) AS month
                ) months
                LEFT JOIN Orders o ON EXTRACT(MONTH FROM o.Created_At) = months.month
                WHERE o.Status = 'Completed' AND EXTRACT(YEAR FROM o.Created_At) = $1
                GROUP BY months.month
                ORDER BY months.month;
            `;

            // Truyền năm vào câu truy vấn
            const result = await pool.query(query, [year]);

            // Tạo mảng doanh thu và tháng từ kết quả truy vấn
            const revenueData = new Array(12).fill(0); // Mảng doanh thu, mặc định là 0 cho tất cả các tháng
            const revenueLabels = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            // Cập nhật doanh thu cho các tháng có dữ liệu
            result.rows.forEach(row => {
                revenueData[row.month - 1] = parseFloat(row.revenue); // Tháng bắt đầu từ 1, nên trừ 1 khi truy cập mảng
            });

            return { revenueLabels, revenueData };
        } catch (error) {
            console.error('Error in getRevenueGrowth:', error.message);
            throw new Error('Failed to fetch revenue growth.');
        }
    }


    // Lấy số lượng sản phẩm đã bán theo danh mục
    async getProductsSold() {
        try {
            const query = `
            SELECT 
                c.Name AS category_name,
                COALESCE(SUM(od.Quantity), 0) AS quantity_sold
            FROM Categories c
            LEFT JOIN Book b ON b.Genre = c.ID_Category
            LEFT JOIN Order_Detail od ON od.ID_Book = b.ID_Book
            LEFT JOIN Orders o ON od.ID_Order = o.ID_Order
            WHERE o.Status = 'Completed' OR o.Status IS NULL
            GROUP BY c.Name
            ORDER BY c.Name;
        `;

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error in getProductsSold:', error.message);
            throw new Error('Failed to fetch products sold.');
        }
    }



    // Lấy tổng số lượt người dùng, doanh thu, và sản phẩm đã bán
    async getDashboardStats() {
        try {
            const query = `
                SELECT
                    (SELECT COUNT(*) FROM Users) AS total_users,
                    (SELECT COALESCE(SUM(o.Total_Amount), 0)
                     FROM Orders o
                     WHERE o.Status = 'Completed') AS total_revenue,
                    (SELECT COALESCE(SUM(od.Quantity), 0)
                     FROM Order_Detail od
                     JOIN Orders o ON od.ID_Order = o.ID_Order
                     WHERE o.Status = 'Completed') AS total_products_sold;
            `;
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error in getDashboardStats:', error.message);
            throw new Error('Failed to fetch dashboard stats.');
        }
    }


}

module.exports = new StatisticalModel;
