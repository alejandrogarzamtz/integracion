
CREATE DATABASE IF NOT EXISTS bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore;


CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE formats (
    format_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);


CREATE TABLE books (
    isbn VARCHAR(17) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    genre_id INT NOT NULL,
    format_id INT NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id),
    FOREIGN KEY (format_id) REFERENCES formats(format_id)
);


CREATE TABLE book_authors (
    book_isbn VARCHAR(17),
    author_id INT,
    PRIMARY KEY (book_isbn, author_id),
    FOREIGN KEY (book_isbn) REFERENCES books(isbn) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);


INSERT INTO formats (name) VALUES
('Paperback'),
('Hardcover');


INSERT INTO genres (name) VALUES
('Dystopian'),
('Classic'),
('Romance'),
('Young Adult'),
('Fantasy'),
('Historical Fiction'),
('Post-Apocalyptic'),
('Magical Realism'),
('Fiction'),
('Horror'),
('Political Satire');


INSERT INTO authors (name) VALUES
('George Orwell'),
('Harper Lee'),
('Jane Austen'),
('Suzanne Collins'),
('J.R.R. Tolkien'),
('F. Scott Fitzgerald'),
('Toni Morrison'),
('Cormac McCarthy'),
('J.D. Salinger'),
('Chinua Achebe'),
('Gabriel García Márquez'),
('Paulo Coelho'),
('Stephen King'),
('Charlotte Brontë'),
('Aldous Huxley'),
('Ralph Ellison'),
('Fyodor Dostoevsky'),
('Neil Gaiman'),
('Terry Pratchett');


INSERT INTO books (isbn, title, year, price, stock, genre_id, format_id) VALUES
('978-0451524935', '1984', 1949, 9.99, 25, 1, 1),
('978-0061120084', 'To Kill a Mockingbird', 1960, 12.50, 18, 2, 2),
('978-0141439518', 'Pride and Prejudice', 1813, 8.75, 32, 3, 1),
('978-0439023481', 'The Hunger Games', 2008, 10.99, 45, 4, 1),
('978-0544003415', 'The Hobbit', 1937, 14.95, 22, 5, 2),
('978-0743273565', 'The Great Gatsby', 1925, 9.25, 15, 2, 1),
('978-1400033416', 'Beloved', 1987, 13.75, 12, 6, 1),
('978-0307277671', 'The Road', 2006, 11.50, 8, 7, 1),
('978-0316769174', 'The Catcher in the Rye', 1951, 10.25, 20, 2, 1),
('978-0385472579', 'Things Fall Apart', 1958, 12.99, 14, 6, 1),
('978-0547928227', 'The Lord of the Rings', 1954, 24.95, 10, 5, 2),
('978-0140283334', 'One Hundred Years of Solitude', 1967, 14.50, 16, 8, 1),
('978-0062315007', 'The Alchemist', 1988, 11.95, 35, 9, 1),
('978-0451169525', 'The Shining', 1977, 9.99, 28, 10, 1),
('978-0141439600', 'Jane Eyre', 1847, 8.50, 19, 2, 1),
('978-0143105428', 'Brave New World', 1932, 10.75, 23, 1, 1),
('978-0679733730', 'Invisible Man', 1952, 12.25, 11, 2, 1),
('978-0141187761', 'Animal Farm', 1945, 7.99, 40, 11, 1),
('978-0140449266', 'Crime and Punishment', 1866, 13.25, 9, 2, 1),
('978-0060850524', 'Good Omens', 1990, 11.99, 30, 5, 1);


INSERT INTO book_authors (book_isbn, author_id) VALUES
('978-0451524935', 1),
('978-0061120084', 2),
('978-0141439518', 3),
('978-0439023481', 4),
('978-0544003415', 5),
('978-0743273565', 6),
('978-1400033416', 7),
('978-0307277671', 8),
('978-0316769174', 9),
('978-0385472579', 10),
('978-0547928227', 5),
('978-0140283334', 11),
('978-0062315007', 12),
('978-0451169525', 13),
('978-0141439600', 14),
('978-0143105428', 15),
('978-0679733730', 16),
('978-0141187761', 1),
('978-0140449266', 17),
('978-0060850524', 18),
('978-0060850524', 19);


CREATE VIEW book_catalog AS
SELECT
    b.isbn,
    b.title,
    GROUP_CONCAT(a.name SEPARATOR ', ') AS authors,
    b.year,
    g.name AS genre,
    b.price,
    b.stock,
    f.name AS format
FROM books b
JOIN genres g ON b.genre_id = g.genre_id
JOIN formats f ON b.format_id = f.format_id
JOIN book_authors ba ON b.isbn = ba.book_isbn
JOIN authors a ON ba.author_id = a.author_id
GROUP BY b.isbn, b.title, b.year, g.name, b.price, b.stock, f.name
ORDER BY b.title;


SELECT * FROM book_catalog;
