-- Create Poster table
CREATE TABLE Poster (
    ID_Poster SERIAL PRIMARY KEY,
    Name VARCHAR(255),
    Image_Link TEXT,
    Product_Link TEXT
);

-- Create Categories table
CREATE TABLE Categories (
    ID_Category SERIAL PRIMARY KEY,
    Name VARCHAR(255)
);

-- Create User table
CREATE TABLE Users (
    ID_User SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL, 
    Name VARCHAR(255),
    Phone VARCHAR(15),
    Gender VARCHAR(10),
    Birth_Date DATE,
    Type VARCHAR(50),
    Role VARCHAR(50),
    PasswordOrGoogleID VARCHAR(255),
    refresh_token VARCHAR(200)
);

-- Create Address table
CREATE TABLE Address_Booking (
    ID_Address SERIAL PRIMARY KEY,
    Name VARCHAR(50),
    Phone VARCHAR(15),
    Country VARCHAR(50),
    City VARCHAR(50),
    District VARCHAR(50),
    Ward VARCHAR(50),
    Address VARCHAR(100),
    Email VARCHAR(255) NOT NULL,
    CONSTRAINT fk_email FOREIGN KEY (Email) REFERENCES Users (Email)
);

-- Create Book table
CREATE TABLE Book (
    ID_Book SERIAL PRIMARY KEY,
    Book_Name VARCHAR(255),
    List_Price NUMERIC(15, 2),
    Discounted_Price NUMERIC(15, 2),
    Genre INT,
    Age_Group VARCHAR(50),
    Supplier VARCHAR(255),
    Translator VARCHAR(255),
    Author VARCHAR(255),
    Publisher VARCHAR(255),
    Publication_Year INT,
    Language VARCHAR(50),
    Pages INT,
    Description TEXT,
    Rating_Count INT,
    Cover_Type VARCHAR(50),
    Available_Quantity INT,
    Sold_Quantity INT,
    CONSTRAINT fk_genre FOREIGN KEY (Genre) REFERENCES Categories (ID_Category)
);

-- Create Img_Book table
CREATE TABLE Img_Book (
    ID SERIAL PRIMARY KEY,
    ID_Book INT NOT NULL,
    Image_Link TEXT,
    CONSTRAINT fk_book FOREIGN KEY (ID_Book) REFERENCES Book (ID_Book)
);

-- Create Review table
CREATE TABLE Review (
    ID_Review SERIAL PRIMARY KEY,
    ID_Book INT,
    Email VARCHAR(255),
    Date DATE,
    Rating NUMERIC(3, 2),
    Content TEXT,
    Image_Link TEXT,
    Like_Count INT,
    CONSTRAINT fk_book FOREIGN KEY (ID_Book) REFERENCES Book (ID_Book),
    CONSTRAINT fk_email FOREIGN KEY (Email) REFERENCES Users (Email)
);

-- Create Cart table
CREATE TABLE Cart (
    ID_Cart SERIAL PRIMARY KEY, 
    Email VARCHAR(100) NOT NULL, 
    ID_Book INT NOT NULL, 
    Quantity INT NOT NULL CHECK (Quantity > 0), 
    Added_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (ID_Book) REFERENCES Book(ID_Book) ON DELETE CASCADE
);

-- Create Orders table
CREATE TABLE Orders (
    ID_Order SERIAL PRIMARY KEY,
    Email VARCHAR(100) NOT NULL,
    Total_Amount NUMERIC(15, 2) NOT NULL CHECK (Total_Amount >= 0), 
    Status VARCHAR(50) DEFAULT 'Pending', -- pending, paid, cancelled and completed 
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(50),
    FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE
);

-- Create Order_Detail table
CREATE TABLE Order_Detail (
    ID_Detail SERIAL PRIMARY KEY, 
    ID_Order INT NOT NULL,
    ID_Book INT NOT NULL, 
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price NUMERIC(15, 2) NOT NULL CHECK (Price >= 0), 
    FOREIGN KEY (ID_Order) REFERENCES Orders(ID_Order) ON DELETE CASCADE, 
    FOREIGN KEY (ID_Book) REFERENCES Book(ID_Book) ON DELETE CASCADE 
);

-- Create Invoice table: Hóa đơn
CREATE TABLE Invoice (
    ID_Invoice SERIAL PRIMARY KEY,
    ID_Order INT NOT NULL,
    Invoice_Date DATE,
    Total_Amount NUMERIC(15, 2),
    CONSTRAINT fk_order FOREIGN KEY (ID_Order) REFERENCES Orders (ID_Order)
); 

ALTER TABLE Book
ADD COLUMN Status INT DEFAULT 1;

INSERT INTO Categories (Name) 
VALUES 
    ('Tiểu thuyết'),
    ('Truyện tranh'),
    ('Kinh doanh'),
    ('Tâm lý học'),
    ('Khoa học viễn tưởng');

-- Tiểu thuyết (Giả sử ID_Category = 1)
INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity)
VALUES
('Chuyện Người Con Gái Nam Xương', 120000, 100000, 1, 'Trên 16 tuổi', 'NXB Văn Học', NULL, 'Nguyễn Dữ', 'NXB Văn Học', 2020, 'Tiếng Việt', 200, 'Một trong những tác phẩm cổ điển nổi bật của văn học Việt Nam.', 500, 'Bìa mềm', 100, 50),
('Nỗi Buồn Chiến Tranh', 150000, 130000, 1, 'Trên 18 tuổi', 'NXB Trẻ', NULL, 'Bảo Ninh', 'NXB Trẻ', 2019, 'Tiếng Việt', 250, 'Một góc nhìn khác về chiến tranh Việt Nam.', 800, 'Bìa cứng', 70, 40),
('Đất Rừng Phương Nam', 100000, 90000, 1, 'Thiếu nhi', 'NXB Kim Đồng', NULL, 'Đoàn Giỏi', 'NXB Kim Đồng', 2018, 'Tiếng Việt', 180, 'Tác phẩm dành cho thiếu nhi về thiên nhiên Nam Bộ.', 600, 'Bìa mềm', 150, 60),
('Tắt Đèn', 90000, 80000, 1, 'Trên 16 tuổi', 'NXB Văn Học', NULL, 'Ngô Tất Tố', 'NXB Văn Học', 2017, 'Tiếng Việt', 190, 'Cuộc sống của người nông dân Việt Nam trước cách mạng.', 750, 'Bìa mềm', 120, 80),
('Số Đỏ', 110000, 95000, 1, 'Trên 16 tuổi', 'NXB Hội Nhà Văn', NULL, 'Vũ Trọng Phụng', 'NXB Hội Nhà Văn', 2015, 'Tiếng Việt', 220, 'Truyện châm biếm sâu sắc về xã hội Việt Nam thời Pháp thuộc.', 900, 'Bìa mềm', 90, 30);

-- Truyện tranh (Giả sử ID_Category = 2)
INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity)
VALUES
('Doraemon', 30000, 25000, 2, 'Thiếu nhi', 'NXB Kim Đồng', NULL, 'Fujiko F. Fujio', 'NXB Kim Đồng', 2021, 'Tiếng Việt', 100, 'Truyện tranh hài hước và giáo dục dành cho thiếu nhi.', 1500, 'Bìa mềm', 200, 150),
('One Piece', 35000, 30000, 2, 'Thiếu niên', 'NXB Kim Đồng', NULL, 'Eiichiro Oda', 'NXB Kim Đồng', 2022, 'Tiếng Việt', 120, 'Cuộc hành trình của những hải tặc truy tìm kho báu.', 2000, 'Bìa mềm', 250, 200),
('Naruto', 35000, 30000, 2, 'Thiếu niên', 'NXB Kim Đồng', NULL, 'Masashi Kishimoto', 'NXB Kim Đồng', 2020, 'Tiếng Việt', 110, 'Câu chuyện về cậu bé ninja với ước mơ trở thành Hokage.', 1700, 'Bìa mềm', 180, 140),
('Conan', 32000, 28000, 2, 'Thiếu niên', 'NXB Kim Đồng', NULL, 'Gosho Aoyama', 'NXB Kim Đồng', 2021, 'Tiếng Việt', 100, 'Thám tử học đường phá giải các vụ án phức tạp.', 1900, 'Bìa mềm', 220, 180),
('Attack on Titan', 40000, 35000, 2, 'Trên 16 tuổi', 'NXB Kim Đồng', NULL, 'Hajime Isayama', 'NXB Kim Đồng', 2023, 'Tiếng Việt', 130, 'Cuộc chiến sinh tồn giữa con người và Titan.', 2100, 'Bìa mềm', 200, 170);

-- Kinh doanh (Giả sử ID_Category = 3)
INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity)
VALUES
('Dạy Con Làm Giàu', 200000, 180000, 3, 'Trên 18 tuổi', 'NXB Trẻ', 'Nguyễn Văn A', 'Robert T. Kiyosaki', 'NXB Trẻ', 2021, 'Tiếng Việt', 300, 'Bí quyết tài chính cá nhân và đầu tư.', 2500, 'Bìa cứng', 100, 80),
('7 Thói Quen Hiệu Quả', 220000, 200000, 3, 'Trên 18 tuổi', 'NXB Lao Động', 'Nguyễn Văn B', 'Stephen R. Covey', 'NXB Lao Động', 2020, 'Tiếng Việt', 350, 'Phát triển bản thân và kỹ năng quản lý thời gian.', 2300, 'Bìa cứng', 90, 70),
('Tư Duy Nhanh Và Chậm', 250000, 230000, 3, 'Trên 18 tuổi', 'NXB Trẻ', 'Nguyễn Văn C', 'Daniel Kahneman', 'NXB Trẻ', 2019, 'Tiếng Việt', 400, 'Khám phá cách bộ não xử lý thông tin.', 2000, 'Bìa cứng', 80, 60),
('Khởi Nghiệp Tinh Gọn', 210000, 190000, 3, 'Trên 18 tuổi', 'NXB Lao Động', 'Nguyễn Văn D', 'Eric Ries', 'NXB Lao Động', 2021, 'Tiếng Việt', 320, 'Chiến lược khởi nghiệp hiện đại.', 1800, 'Bìa cứng', 110, 85),
('Tỷ Phú Bán Giày', 180000, 160000, 3, 'Trên 18 tuổi', 'NXB Trẻ', 'Nguyễn Văn E', 'Tony Hsieh', 'NXB Trẻ', 2018, 'Tiếng Việt', 280, 'Câu chuyện thành công từ Zappos.', 1700, 'Bìa mềm', 120, 90);

-- Tâm lý học (Giả sử ID_Category = 4)
INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity)
VALUES
('Đừng Bao Giờ Từ Bỏ Giấc Mơ', 150000, 130000, 4, 'Trên 18 tuổi', 'NXB Văn Học', NULL, 'John C. Maxwell', 'NXB Văn Học', 2019, 'Tiếng Việt', 250, 'Khuyến khích phát triển tư duy tích cực.', 900, 'Bìa mềm', 80, 50),
('Sức Mạnh Của Thói Quen', 200000, 180000, 4, 'Trên 18 tuổi', 'NXB Lao Động', 'Nguyễn Văn F', 'Charles Duhigg', 'NXB Lao Động', 2020, 'Tiếng Việt', 310, 'Khám phá sức mạnh của thói quen trong cuộc sống.', 1300, 'Bìa cứng', 100, 70),
('Trí Tuệ Xúc Cảm', 220000, 200000, 4, 'Trên 18 tuổi', 'NXB Trẻ', 'Nguyễn Văn G', 'Daniel Goleman', 'NXB Trẻ', 2018, 'Tiếng Việt', 280, 'Khám phá và phát triển trí tuệ cảm xúc.', 1100, 'Bìa cứng', 90, 65),
('Tâm Lý Học Đám Đông', 180000, 160000, 4, 'Trên 18 tuổi', 'NXB Văn Học', NULL, 'Gustave Le Bon', 'NXB Văn Học', 2017, 'Tiếng Việt', 240, 'Nghiên cứu hành vi đám đông.', 950, 'Bìa mềm', 75, 55),
('Người Dám Cho Đi', 200000, 180000, 4, 'Trên 18 tuổi', 'NXB Trẻ', NULL, 'Bob Burg & John David Mann', 'NXB Trẻ', 2019, 'Tiếng Việt', 290, 'Chia sẻ sức mạnh của sự hào phóng.', 1050, 'Bìa mềm', 85, 60);

-- Khoa học viễn tưởng (Giả sử ID_Category = 5)
INSERT INTO Book (Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, Cover_Type, Available_Quantity, Sold_Quantity)
VALUES
('Dune', 250000, 230000, 5, 'Trên 16 tuổi', 'NXB Trẻ', 'Nguyễn Văn H', 'Frank Herbert', 'NXB Trẻ', 2021, 'Tiếng Việt', 600, 'Một kiệt tác về thế giới sa mạc Arrakis.', 1600, 'Bìa cứng', 100, 80),
('1984', 180000, 160000, 5, 'Trên 16 tuổi', 'NXB Văn Học', NULL, 'George Orwell', 'NXB Văn Học', 2019, 'Tiếng Việt', 350, 'Thế giới tương lai đầy u ám và kiểm soát.', 1400, 'Bìa mềm', 90, 70),
('Fahrenheit 451', 190000, 170000, 5, 'Trên 16 tuổi', 'NXB Văn Học', NULL, 'Ray Bradbury', 'NXB Văn Học', 2018, 'Tiếng Việt', 300, 'Một xã hội cấm sách và tự do tri thức.', 1200, 'Bìa mềm', 85, 60),
('Neuromancer', 210000, 190000, 5, 'Trên 18 tuổi', 'NXB Trẻ', 'Nguyễn Văn I', 'William Gibson', 'NXB Trẻ', 2020, 'Tiếng Việt', 400, 'Tác phẩm khởi nguồn cho thể loại cyberpunk.', 1150, 'Bìa cứng', 95, 65),
('The Martian', 220000, 200000, 5, 'Trên 16 tuổi', 'NXB Trẻ', 'Nguyễn Văn J', 'Andy Weir', 'NXB Trẻ', 2019, 'Tiếng Việt', 320, 'Cuộc sinh tồn đầy cảm hứng trên sao Hỏa.', 1250, 'Bìa mềm', 100, 75);
