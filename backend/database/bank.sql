-- Tạo bảng account_bank
CREATE TABLE account_bank (
    account_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    balance NUMERIC(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Tạo bảng admin_transaction_history
CREATE TABLE admin_transaction_history (
    transaction_id SERIAL PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance_before NUMERIC(15, 2) NOT NULL CHECK (balance_before >= 0),
    balance_after NUMERIC(15, 2) NOT NULL CHECK (balance_after >= 0),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description TEXT DEFAULT 'Nhận tiền thanh toán',
    CONSTRAINT fk_admin_email FOREIGN KEY (admin_email) REFERENCES account_bank(email) ON DELETE CASCADE,
    CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES account_bank(email) ON DELETE CASCADE
);

-- Tạo bảng payment
CREATE TABLE payment (
    id_payment SERIAL PRIMARY KEY,
    id_invoice INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'Completed',
    CONSTRAINT fk_payment_email FOREIGN KEY (email) REFERENCES account_bank(email) ON DELETE CASCADE
);

-- Tạo bảng request
CREATE TABLE request (
    id_request SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tạo bảng user_transaction_history
CREATE TABLE user_transaction_history (
    transaction_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255),
    transaction_type VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance_before NUMERIC(15, 2) NOT NULL CHECK (balance_before >= 0),
    balance_after NUMERIC(15, 2) NOT NULL CHECK (balance_after >= 0),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description TEXT DEFAULT 'Thanh toán đơn hàng',
    CONSTRAINT fk_user_email FOREIGN KEY (email) REFERENCES account_bank(email) ON DELETE CASCADE,
    CONSTRAINT fk_admin_email FOREIGN KEY (admin_email) REFERENCES account_bank(email) ON DELETE CASCADE
);
