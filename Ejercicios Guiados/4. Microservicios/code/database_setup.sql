-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS librería CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE librería;

-- Tabla de autores
CREATE TABLE autores (
autor_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de géneros
CREATE TABLE géneros (
genre_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de formatos
CREATE TABLE formatos (
format_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla principal de libros
CREATE TABLE libros (
isbn VARCHAR(17) PRIMARY KEY,
título VARCHAR(255) NOT NULL,
año INT NOT NULL,
precio DECIMAL(10, 2) NOT NULL,
stock INT NOT NULL DEFAULT 0,
genre_id INT NOT NULL,
format_id INT NOT NULL,
FOREIGN KEY (genre_id) REFERENCES géneros(genre_id),
FOREIGN KEY (format_id) REFERENCES formatos(format_id)
);

-- Tabla de relación entre libros y autores (muchos a muchos)
CREATE TABLE book_authors (
libro_isbn VARCHAR(17),
autor_id INT,
PRIMARY KEY (libro_isbn, autor_id),
FOREIGN KEY (libro_isbn) REFERENCES libros(isbn) ON DELETE CASCADE,
FOREIGN KEY (autor_id) REFERENCES autores(autor_id) ON DELETE CASCADE
);

-- Insertar datos de formatos
INSERT INTO formatos (nombre) VALUES
('Libro de bolsillo'),
('De tapa dura');

-- Insertar datos de géneros
INSERT INTO géneros (nombre) VALUES
('Distópico'),
('Clásico'),
('Romance'),
('Adultos jóvenes'),
('Fantasía'),
('Ficción histórica'),
('Post-apocalíptico'),
('Realismo mágico'),
('Ficción'),
('Horror'),
('Sátira política');

-- Insertar autores
INSERT INTO autores (nombre) VALUES
('George Orwell'),
('Harper Lee'),
('Jane Austen'),
('Suzanne Collins'),
('J. R. R. Tolkien'),
('F. Scott Fitzgerald'),
('Toni Morrison'),
('Cormac McCarthy'),
('J. D. Salinger'),
('Chinua Achebe'),
('Gabriel García Márquez'),
('Paulo Coelho'),
('Stephen King'),
('Charlotte Brontë'),
('Aldous Huxley'),
('Ralph Ellison'),
('Fiódor Dostoievski'),
('Neil Gaiman'),
('Terry Pratchett');

-- Insertar libros
INSERT INTO libros (isbn, título, año, precio, stock, genre_id, format_id) VALUES
('978-0451524935', '1984', 1949, 9.99, 25, 1, 1),
('978-0061120084', 'Matar a un ruiseñor', 1960, 12.50, 18, 2, 2),
('978-0141439518', 'Orgullo y prejuicio', 1813, 8.75, 32, 3, 1),
('978-0439023481', 'Los juegos del hambre', 2008, 10.99, 45, 4, 1),
('978-0544003415', 'El Hobbit', 1937, 14.95, 22, 5, 2),
('978-0743273565', 'El gran Gatsby', 1925, 9.25, 15, 2, 1),
('978-1400033416', 'Amado', 1987, 13.75, 12, 6, 1),
('978-0307277671', 'El camino', 2006, 11.50, 8, 7, 1),
('978-0316769174', 'El guardián entre el centeno', 1951, 10.25, 20, 2, 1),
('978-0385472579', 'Todo se desmorona', 1958, 12.99, 14, 6, 1),
('978-0547928227', 'El Señor de los Anillos', 1954, 24.95, 10, 5, 2),
('978-0140283334', 'Cien años de soledad', 1967, 14.50, 16, 8, 1),
('978-0062315007', 'El Alquimista', 1988, 11.95, 35, 9, 1),
('978-0451169525', 'El resplandor', 1977, 9.99, 28, 10, 1),
('978-0141439600', 'Jane Eyre', 1847, 8.50, 19, 2, 1),
('978-0143105428', 'Un mundo feliz', 1932, 10.75, 23, 1, 1),
('978-0679733730', 'El hombre invisible', 1952, 12.25, 11, 2, 1),
('978-0141187761', 'Rebelión en la granja', 1945, 7.99, 40, 11, 1),
('978-0140449266', 'Crimen y castigo', 1866, 13.25, 9, 2, 1),
('978-0060850524', 'Buenos presagios', 1990, 11.99, 30, 5, 1);

-- Establecer relaciones entre libros y autores
INSERT INTO book_authors (libro_isbn, autor_id) VALUES
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

-- Vista para consultar libros con información completa
CREATE VIEW catálogo_de_libros AS
SELECT
b.isbn,
b.título,
GROUP_CONCAT(a.nombre SEPARATOR ', ') AS autores,
b.año,
g.nombre AS género,
b.precio,
b.stock,
f.nombre AS formato
FROM libros b
JOIN géneros g ON b.genre_id = g.genre_id
JOIN formatos f ON b.format_id = f.format_id
JOIN book_authors ba ON b.isbn = ba.libro_isbn
JOIN autores a ON ba.autor_id = a.autor_id
GROUP BY b.isbn, b.título, b.año, g.nombre, b.precio, b.stock, f.nombre
ORDER BY b.título;
