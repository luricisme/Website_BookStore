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
    refresh_token VARCHAR(100)
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
    ('Fiction'),
    ('Non-Fiction'),
    ('Science Fiction'),
    ('Fantasy'),
    ('Biography'),
    ('History'),
    ('Mystery'),
    ('Romance');

INSERT INTO Book (
    Book_Name, 
    List_Price, 
    Discounted_Price, 
    Genre, 
    Age_Group, 
    Supplier, 
    Translator, 
    Author, 
    Publisher, 
    Publication_Year, 
    Language, 
    Pages, 
    Description, 
    Rating_Count, 
    Cover_Type, 
    Available_Quantity, 
    Sold_Quantity, 
    Status
)
VALUES
    ('The Great Adventure', 19.99, 14.99, 1, 'Teen', 'GlobalBooks Ltd.', NULL, 'John Doe', 'Epic Publishers', 2020, 'English', 320, 'An exciting tale of bravery and friendship.', 250, 'Paperback', 100, 30, 1),
    ('The Mystery of the Lost City', 25.99, 20.99, 7, 'Adult', 'MysteryBooks Co.', NULL, 'Jane Smith', 'Detective Press', 2018, 'English', 400, 'A thrilling mystery set in ancient ruins.', 180, 'Hardcover', 50, 20, 1),
    ('Biography of a Legend', 30.00, 25.00, 5, 'Adult', 'HistoryDepot', NULL, 'Michael Brown', 'LifeStory Inc.', 2015, 'English', 550, 'The inspiring story of a world-renowned leader.', 300, 'Paperback', 60, 40, 1),
    ('Galaxy Wars', 22.50, 18.00, 3, 'Teen', 'SciFiWorld', NULL, 'Emily Clark', 'Futuristic Books', 2022, 'English', 280, 'An intergalactic battle for survival.', 400, 'Paperback', 120, 50, 1),
    ('Romantic Escapades', 18.99, 15.49, 8, 'Young Adult', 'RomanceHouse', 'Anna White', 'Sophia Johnson', 'LovePress', 2019, 'English', 350, 'A heartwarming love story.', 200, 'Hardcover', 80, 60, 1),
    ('Fantasy Kingdom', 24.99, 19.99, 4, 'Teen', 'FantasyWorld Ltd.', NULL, 'Arthur Green', 'Kingdom Publishers', 2021, 'English', 450, 'A magical journey through an enchanted realm.', 350, 'Paperback', 90, 45, 1),
    ('History of Ancient Civilizations', 35.00, 30.00, 6, 'Adult', 'KnowledgePress', NULL, 'Henry Lee', 'Academic Publishing', 2010, 'English', 600, 'A comprehensive guide to ancient cultures.', 100, 'Hardcover', 30, 10, 1);
