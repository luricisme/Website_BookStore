-- Xóa các bảng nếu đã tồn tại
DROP TABLE IF EXISTS User_Transaction_History CASCADE;
DROP TABLE IF EXISTS Admin_Transaction_History CASCADE;
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS Request CASCADE;
DROP TABLE IF EXISTS Account_Bank CASCADE;

-- Thiết lập múi giờ
SET timezone = 'Asia/Ho_Chi_Minh';

-- Tạo bảng Account_Bank
CREATE TABLE Account_Bank (
    Account_ID SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Balance NUMERIC(15, 2) DEFAULT 0.00,
    Is_Admin BOOLEAN DEFAULT FALSE -- Đánh dấu tài khoản admin
);

-- Tạo bảng Payment
CREATE TABLE Payment (
    ID_Payment SERIAL PRIMARY KEY,
    ID_Invoice INT NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Payment_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Amount NUMERIC(15, 2) NOT NULL,
    Status VARCHAR(20) DEFAULT 'Completed',
    FOREIGN KEY (Email) REFERENCES Account_Bank (Email) ON DELETE CASCADE
);

-- Tạo bảng Request
CREATE TABLE Request (
    ID_Request SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Request_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng User_Transaction_History
CREATE TABLE User_Transaction_History (
    Transaction_ID SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Admin_Email VARCHAR(255), -- Email của admin liên quan đến giao dịch
    Transaction_Type VARCHAR(50) NOT NULL, -- Loại giao dịch: "Payment", "Refund", v.v.
    Amount NUMERIC(15, 2) NOT NULL, -- Số tiền giao dịch
    Balance_Before NUMERIC(15, 2) NOT NULL, -- Số dư trước giao dịch
    Balance_After NUMERIC(15, 2) NOT NULL, -- Số dư sau giao dịch
    Transaction_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Ngày thực hiện giao dịch
    Description TEXT DEFAULT 'Thanh toán đơn hàng', -- Mô tả giao dịch
    FOREIGN KEY (Email) REFERENCES Account_Bank (Email) ON DELETE CASCADE
);

-- Tạo bảng Admin_Transaction_History
CREATE TABLE Admin_Transaction_History (
    Transaction_ID SERIAL PRIMARY KEY,
    Admin_Email VARCHAR(255) NOT NULL,
    User_Email VARCHAR(255), -- Email của người dùng liên quan đến giao dịch
    Amount NUMERIC(15, 2) NOT NULL, -- Số tiền giao dịch
    Balance_Before NUMERIC(15, 2) NOT NULL, -- Số dư trước giao dịch
    Balance_After NUMERIC(15, 2) NOT NULL, -- Số dư sau giao dịch
    Transaction_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Ngày thực hiện giao dịch
    Description TEXT DEFAULT 'Nhận tiền thanh toán', -- Mô tả giao dịch
    FOREIGN KEY (Admin_Email) REFERENCES Account_Bank (Email) ON DELETE CASCADE,
    FOREIGN KEY (User_Email) REFERENCES Account_Bank (Email) ON DELETE CASCADE
);

-- Dữ liệu mẫu cho Account_Bank
INSERT INTO Account_Bank (Email, Balance, Is_Admin) VALUES
('admin@gmail.com', 13000000.00, TRUE), -- Tài khoản admin
('user1@example.com', 3500000.00, FALSE),
('user2@example.com', 1500000.00, FALSE);

-- Dữ liệu mẫu cho Payment
INSERT INTO Payment (ID_Invoice, Email, Payment_Date, Amount) VALUES
(1, 'user1@example.com', '2025-01-01 12:00:00', 1000000.00),
(2, 'user2@example.com', '2025-01-02 15:30:00', 1500000.00),
(3, 'user1@example.com', '2025-01-03 09:45:00', 500000.00);

-- Dữ liệu mẫu cho Request
INSERT INTO Request (Email, Request_Date) VALUES
('user3@example.com', '2025-01-05 10:00:00'),
('user4@example.com', '2025-01-06 14:30:00');

-- Dữ liệu mẫu cho User_Transaction_History
INSERT INTO User_Transaction_History (Email, Admin_Email, Transaction_Type, Amount, Balance_Before, Balance_After, Transaction_Date, Description) VALUES
('user1@example.com', 'admin@gmail.com', 'Payment', 1000000.00, 5000000.00, 4000000.00, '2025-01-01 12:00:00', 'Thanh toán hóa đơn #1'),
('user1@example.com', 'admin@gmail.com', 'Payment', 500000.00, 4000000.00, 3500000.00, '2025-01-03 09:45:00', 'Thanh toán hóa đơn #3'),
('user2@example.com', 'admin@gmail.com', 'Payment', 1500000.00, 3000000.00, 1500000.00, '2025-01-02 15:30:00', 'Thanh toán hóa đơn #2');

-- Dữ liệu mẫu cho Admin_Transaction_History
INSERT INTO Admin_Transaction_History (Admin_Email, User_Email, Amount, Balance_Before, Balance_After, Transaction_Date, Description) VALUES
('admin@gmail.com', 'user1@example.com', 1000000.00, 10000000.00, 11000000.00, '2025-01-01 12:00:00', 'Nhận thanh toán từ user1@example.com'),
('admin@gmail.com', 'user2@example.com', 1500000.00, 11000000.00, 12500000.00, '2025-01-02 15:30:00', 'Nhận thanh toán từ user2@example.com'),
('admin@gmail.com', 'user1@example.com', 500000.00, 12500000.00, 13000000.00, '2025-01-03 09:45:00', 'Nhận thanh toán từ user1@example.com');
