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

CREATE TABLE "session" (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

ALTER TABLE Book
ADD COLUMN Status INT DEFAULT 1;

INSERT INTO Categories (Name)
VALUES
    ('Kinh tế'),
    ('Tâm lý'),
    ('Văn học'),
    ('Tiểu thuyết'),
    ('Giáo dục');

INSERT INTO Book (
    Book_Name, List_Price, Discounted_Price, Genre, Age_Group, Supplier, Translator, 
    Author, Publisher, Publication_Year, Language, Pages, Description, Rating_Count, 
    Cover_Type, Available_Quantity, Sold_Quantity
)
VALUES
-- Kinh tế
    ('The Psychology of Money', 300000, 250000, 1, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn A', 'Morgan Housel', 'Nhà xuất bản XYZ', 2020, 'Tiếng Việt', 200, 'Một cuốn sách về cách thức quản lý tiền bạc và tâm lý tài chính', 1500, 'Bìa mềm', 100, 50),
    ('Atomic Habits', 400000, 350000, 1, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn B', 'James Clear', 'Nhà xuất bản DEF', 2018, 'Tiếng Anh', 250, 'Sự thay đổi nhỏ trong thói quen có thể tạo ra sự khác biệt lớn', 2000, 'Bìa cứng', 120, 70),
    ('Principles: Life and Work', 500000, 450000, 1, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn C', 'Ray Dalio', 'Nhà xuất bản GHI', 2017, 'Tiếng Việt', 300, 'Cuốn sách chia sẻ về các nguyên tắc làm việc và sống của Ray Dalio', 1000, 'Bìa mềm', 80, 40),
    ('The Intelligent Investor', 350000, 300000, 1, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn D', 'Benjamin Graham', 'Nhà xuất bản ABC', 1949, 'Tiếng Anh', 400, 'Cuốn sách nổi tiếng về đầu tư của Benjamin Graham', 2500, 'Bìa cứng', 90, 30),
    ('Thinking, Fast and Slow', 450000, 400000, 1, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn E', 'Daniel Kahneman', 'Nhà xuất bản JKL', 2011, 'Tiếng Việt', 500, 'Cuốn sách khám phá hai chế độ suy nghĩ của con người: nhanh và chậm', 3000, 'Bìa mềm', 150, 80),

-- Tâm lý
    ('Quiet: The Power of Introverts in a World That Can’t Stop Talking', 350000, 300000, 2, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn F', 'Susan Cain', 'Nhà xuất bản MNO', 2012, 'Tiếng Việt', 350, 'Cuốn sách khám phá sức mạnh của người hướng nội trong một thế giới ồn ào', 1200, 'Bìa cứng', 60, 30),
    ('Daring Greatly', 400000, 350000, 2, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn G', 'Brené Brown', 'Nhà xuất bản PQR', 2012, 'Tiếng Anh', 300, 'Một cuốn sách về lòng dũng cảm và sự xấu hổ', 1000, 'Bìa mềm', 70, 40),
    ('Man’s Search for Meaning', 250000, 220000, 2, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn H', 'Viktor Frankl', 'Nhà xuất bản STU', 1946, 'Tiếng Việt', 150, 'Cuốn sách về những trải nghiệm tâm lý của một bác sĩ tâm thần trong trại tập trung', 5000, 'Bìa mềm', 120, 60),
    ('The Subtle Art of Not Giving a F*ck', 350000, 300000, 2, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn I', 'Mark Manson', 'Nhà xuất bản VWX', 2016, 'Tiếng Việt', 250, 'Cuốn sách thẳng thắn về việc tập trung vào những điều quan trọng', 1500, 'Bìa cứng', 90, 50),
    ('The Power of Now', 400000, 350000, 2, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn J', 'Eckhart Tolle', 'Nhà xuất bản YZ', 1997, 'Tiếng Việt', 200, 'Cuốn sách về sự tỉnh thức và sống trong khoảnh khắc hiện tại', 3500, 'Bìa mềm', 110, 70),

-- Văn học
    ('The Midnight Library', 380000, 330000, 3, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn K', 'Matt Haig', 'Nhà xuất bản BCD', 2020, 'Tiếng Việt', 350, 'Một cuốn sách về cuộc sống và những lựa chọn', 2000, 'Bìa cứng', 130, 60),
    ('Where the Crawdads Sing', 450000, 400000, 3, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn L', 'Delia Owens', 'Nhà xuất bản EFG', 2018, 'Tiếng Anh', 370, 'Một cuốn sách mang tính huyền bí về tình yêu và sự cô đơn', 2500, 'Bìa mềm', 80, 40),
    ('The Book Thief', 400000, 350000, 3, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn M', 'Markus Zusak', 'Nhà xuất bản HIJ', 2005, 'Tiếng Việt', 400, 'Một cuốn sách về tình người trong những thời kỳ đen tối của chiến tranh', 3000, 'Bìa cứng', 70, 35),
    ('Circe', 500000, 450000, 3, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn N', 'Madeline Miller', 'Nhà xuất bản KLM', 2018, 'Tiếng Anh', 400, 'Một cuốn sách về câu chuyện thần thoại của Circe', 1800, 'Bìa mềm', 120, 50),
    ('The Night Circus', 460000, 420000, 3, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn O', 'Erin Morgenstern', 'Nhà xuất bản PQR', 2011, 'Tiếng Việt', 450, 'Cuốn sách về một rạp xiếc kỳ bí và những bí mật của nó', 2200, 'Bìa cứng', 110, 60),

-- Tiểu thuyết
    ('The Song of Achilles', 450000, 400000, 4, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn P', 'Madeline Miller', 'Nhà xuất bản STU', 2011, 'Tiếng Việt', 350, 'Cuốn tiểu thuyết huyền thoại về mối quan hệ giữa Achilles và Patroclus', 2500, 'Bìa mềm', 130, 60),
    ('The Fault in Our Stars', 380000, 330000, 4, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn Q', 'John Green', 'Nhà xuất bản VWX', 2012, 'Tiếng Anh', 320, 'Một câu chuyện cảm động về tình yêu và sự mất mát', 4000, 'Bìa cứng', 110, 50),
    ('Pride and Prejudice', 350000, 300000, 4, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn R', 'Jane Austen', 'Nhà xuất bản XYZ', 1813, 'Tiếng Việt', 400, 'Một tác phẩm văn học cổ điển về tình yêu và xã hội', 5000, 'Bìa mềm', 90, 40),
    ('1984', 400000, 350000, 4, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn S', 'George Orwell', 'Nhà xuất bản PQR', 1949, 'Tiếng Việt', 350, 'Cuốn tiểu thuyết về một xã hội toàn trị và kiểm soát tư tưởng', 4500, 'Bìa cứng', 100, 60),
    ('The Great Gatsby', 450000, 400000, 4, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn T', 'F. Scott Fitzgerald', 'Nhà xuất bản KLM', 1925, 'Tiếng Việt', 300, 'Một câu chuyện về tình yêu và sự đổ vỡ trong xã hội Mỹ thập niên 1920', 5500, 'Bìa mềm', 130, 80),

-- Giáo dục
    ('Educated', 350000, 300000, 5, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn U', 'Tara Westover', 'Nhà xuất bản XYZ', 2018, 'Tiếng Việt', 400, 'Một cuốn hồi ký về hành trình đi tìm kiến thức của tác giả', 4000, 'Bìa cứng', 80, 40),
    ('The 7 Habits of Highly Effective People', 450000, 400000, 5, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn V', 'Stephen Covey', 'Nhà xuất bản PQR', 1989, 'Tiếng Anh', 380, 'Cuốn sách giúp cải thiện thói quen và kỹ năng sống', 3500, 'Bìa mềm', 100, 50),
    ('Grit: The Power of Passion and Perseverance', 400000, 350000, 5, 'Người lớn', 'Nhà Sách XYZ', 'Nguyễn Văn W', 'Angela Duckworth', 'Nhà xuất bản STU', 2016, 'Tiếng Việt', 300, 'Cuốn sách về sức mạnh của đam mê và sự kiên trì', 2500, 'Bìa cứng', 90, 60),
    ('Outliers', 380000, 330000, 5, 'Người lớn', 'Nhà Sách ABC', 'Nguyễn Văn X', 'Malcolm Gladwell', 'Nhà xuất bản GHI', 2008, 'Tiếng Anh', 350, 'Cuốn sách về những yếu tố tạo ra sự thành công', 4500, 'Bìa mềm', 120, 70),
    ('Mindset: The New Psychology of Success', 420000, 380000, 5, 'Người lớn', 'Nhà Sách DEF', 'Nguyễn Văn Y', 'Carol S. Dweck', 'Nhà xuất bản PQR', 2006, 'Tiếng Việt', 300, 'Cuốn sách về sức mạnh của tư duy phát triển', 3000, 'Bìa cứng', 100, 50);
