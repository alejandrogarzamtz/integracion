from flask import Flask, request, jsonify
import MySQLdb
import xml.etree.ElementTree as ET
from xml.dom import minidom

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'Libros_user',
    'passwd': '666',
    'db': 'librería',
    'charset': 'utf8'
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = MySQLdb.connect(**DB_CONFIG)
        return connection
    except MySQLdb.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def create_xml_response(data, root_name="catalog"):
    """Create XML response from data"""
    root = ET.Element(root_name)
    
    if isinstance(data, list):
        for item in data:
            book = ET.SubElement(root, "book")
            book.set("isbn", str(item.get('isbn', '')))
            
            # Add all book fields
            for field in ['título', 'autores', 'año', 'género', 'precio', 'stock', 'formato']:
                element = ET.SubElement(book, field)
                element.text = str(item.get(field, ''))
    elif isinstance(data, dict):
        book = ET.SubElement(root, "book")
        book.set("isbn", str(data.get('isbn', '')))
        
        for field in ['título', 'autores', 'año', 'género', 'precio', 'stock', 'formato']:
            element = ET.SubElement(book, field)
            element.text = str(data.get(field, ''))
    
    # Format XML nicely
    rough_string = ET.tostring(root, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="    ")

@app.route('/api/books', methods=['GET'])
def get_all_books():
    """Display all existing books in XML"""
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros")
        books = cursor.fetchall()
        
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/<isbn>', methods=['GET'])
def get_book_by_isbn(isbn):
    """Search for a book by ISBN"""
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros WHERE isbn = %s", (isbn,))
        book = cursor.fetchone()
        
        if book:
            xml_response = create_xml_response(book)
            return xml_response, 200, {'Content-Type': 'application/xml'}
        else:
            return create_xml_response([]), 404, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/format', methods=['GET'])
def get_books_by_format():
    """Display all books in a given format"""
    format_type = request.args.get('format')
    if not format_type:
        return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
    
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros WHERE formato = %s", (format_type,))
        books = cursor.fetchall()
        
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/author', methods=['GET'])
def get_books_by_author():
    """Search for books by a given author"""
    author = request.args.get('author')
    if not author:
        return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
    
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros WHERE autores LIKE %s", (f"%{author}%",))
        books = cursor.fetchall()
        
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/create', methods=['POST'])
def create_book():
    """Insert a new book"""
    data = request.get_json()
    
    required_fields = ['isbn', 'título', 'año', 'precio', 'stock', 'género', 'formato', 'autores']
    if not all(field in data for field in required_fields):
        return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
    
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor()
        
        # Get genre_id
        cursor.execute("SELECT genre_id FROM géneros WHERE nombre = %s", (data['género'],))
        genre_result = cursor.fetchone()
        if not genre_result:
            return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
        genre_id = genre_result[0]
        
        # Get format_id
        cursor.execute("SELECT format_id FROM formatos WHERE nombre = %s", (data['formato'],))
        format_result = cursor.fetchone()
        if not format_result:
            return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
        format_id = format_result[0]
        
        # Insert book
        cursor.execute("""
            INSERT INTO libros (isbn, título, año, precio, stock, genre_id, format_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (data['isbn'], data['título'], data['año'], data['precio'], 
              data['stock'], genre_id, format_id))
        
        # Insert authors
        autores = data['autores'].split(',')
        for autor in autores:
            autor = autor.strip()
            # Get or create author
            cursor.execute("SELECT autor_id FROM autores WHERE nombre = %s", (autor,))
            autor_result = cursor.fetchone()
            if autor_result:
                autor_id = autor_result[0]
            else:
                cursor.execute("INSERT INTO autores (nombre) VALUES (%s)", (autor,))
                autor_id = cursor.lastrowid
            
            # Link book to author
            cursor.execute("INSERT INTO book_authors (libro_isbn, autor_id) VALUES (%s, %s)", 
                         (data['isbn'], autor_id))
        
        connection.commit()
        
        # Return the created book
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros WHERE isbn = %s", (data['isbn'],))
        book = cursor.fetchone()
        
        xml_response = create_xml_response(book)
        return xml_response, 201, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        connection.rollback()
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/update', methods=['PUT'])
def update_book():
    """Update a book based on its ISBN"""
    data = request.get_json()
    
    if 'isbn' not in data:
        return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
    
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor()
        
        # Build dynamic update query for libros table
        update_fields = []
        values = []
        
        # Handle genre update
        if 'género' in data:
            cursor.execute("SELECT genre_id FROM géneros WHERE nombre = %s", (data['género'],))
            genre_result = cursor.fetchone()
            if not genre_result:
                return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
            update_fields.append("genre_id = %s")
            values.append(genre_result[0])
        
        # Handle format update
        if 'formato' in data:
            cursor.execute("SELECT format_id FROM formatos WHERE nombre = %s", (data['formato'],))
            format_result = cursor.fetchone()
            if not format_result:
                return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
            update_fields.append("format_id = %s")
            values.append(format_result[0])
        
        # Handle other fields
        for field in ['título', 'año', 'precio', 'stock']:
            if field in data:
                update_fields.append(f"{field} = %s")
                values.append(data[field])
        
        if not update_fields:
            return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
        
        values.append(data['isbn'])
        query = f"UPDATE libros SET {', '.join(update_fields)} WHERE isbn = %s"
        
        cursor.execute(query, values)
        
        # Update authors if provided
        if 'autores' in data:
            # Remove existing author relationships
            cursor.execute("DELETE FROM book_authors WHERE libro_isbn = %s", (data['isbn'],))
            
            # Add new author relationships
            autores = data['autores'].split(',')
            for autor in autores:
                autor = autor.strip()
                cursor.execute("SELECT autor_id FROM autores WHERE nombre = %s", (autor,))
                autor_result = cursor.fetchone()
                if autor_result:
                    autor_id = autor_result[0]
                else:
                    cursor.execute("INSERT INTO autores (nombre) VALUES (%s)", (autor,))
                    autor_id = cursor.lastrowid
                
                cursor.execute("INSERT INTO book_authors (libro_isbn, autor_id) VALUES (%s, %s)", 
                             (data['isbn'], autor_id))
        
        connection.commit()
        
        # Return the updated book
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros WHERE isbn = %s", (data['isbn'],))
        book = cursor.fetchone()
        
        if book:
            xml_response = create_xml_response(book)
            return xml_response, 200, {'Content-Type': 'application/xml'}
        else:
            return create_xml_response([]), 404, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        connection.rollback()
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

@app.route('/api/books/delete', methods=['DELETE'])
def delete_book():
    """Delete a book based on its ISBN"""
    data = request.get_json()
    
    if 'isbn' not in data:
        return create_xml_response([]), 400, {'Content-Type': 'application/xml'}
    
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM libros WHERE isbn = %s", (data['isbn'],))
        
        if cursor.rowcount > 0:
            connection.commit()
            return create_xml_response([]), 200, {'Content-Type': 'application/xml'}
        else:
            return create_xml_response([]), 404, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        connection.rollback()
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
