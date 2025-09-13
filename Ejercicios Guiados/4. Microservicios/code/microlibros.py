from flask import Flask, request, render_template
from flask_cors import CORS
import MySQLdb
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element, SubElement, tostring

app = Flask(__name__)
CORS(app)  # 🔥 Habilitar CORS para evitar problemas al llamar desde el HTML

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'libros_user',
    'passwd': '666',
    'db': 'Libros',
    'charset': 'utf8'
}

def get_db_connection():
    """Establece conexión con la base de datos"""
    return MySQLdb.connect(**DB_CONFIG)

def create_xml_response(books_data):
    """Crea la respuesta XML a partir de los datos de libros"""
    catalog = Element('catalog')
    
    for book in books_data:
        book_elem = SubElement(catalog, 'book')
        book_elem.set('isbn', book['isbn'])
        SubElement(book_elem, 'title').text = book['title']
        SubElement(book_elem, 'author').text = book['authors']
        SubElement(book_elem, 'year').text = str(book['year'])
        SubElement(book_elem, 'genre').text = book['genre']
        SubElement(book_elem, 'price').text = str(book['price'])
        SubElement(book_elem, 'stock').text = str(book['stock'])
        SubElement(book_elem, 'format').text = book['format']

    xml_str = '<?xml version="1.0" encoding="UTF-8"?>\n' + tostring(catalog, encoding='unicode')
    return xml_str

# 🔹 Vista principal (HTML)
@app.route('/')
def home():
    return render_template("index.html")

# 🔹 Endpoints de microservicios
@app.route('/api/books', methods=['GET'])
def get_all_books():
    """Muestra todos los libros existentes"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM book_catalog")
        books = cursor.fetchall()
        cursor.close()
        conn.close()
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/<isbn>', methods=['GET'])
def get_book_by_isbn(isbn):
    """Busca un libro por ISBN"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM book_catalog WHERE isbn = %s", (isbn,))
        book = cursor.fetchone()
        cursor.close()
        conn.close()
        if book:
            xml_response = create_xml_response([book])
            return xml_response, 200, {'Content-Type': 'application/xml'}
        else:
            return '<?xml version="1.0"?><error>Libro no encontrado</error>', 404, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/format', methods=['GET'])
def get_books_by_format():
    """Muestra libros por formato"""
    format_type = request.args.get('format')
    if not format_type:
        return '<?xml version="1.0"?><error>Parámetro format requerido</error>', 400, {'Content-Type': 'application/xml'}
    try:
        conn = get_db_connection()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM book_catalog WHERE format = %s", (format_type,))
        books = cursor.fetchall()
        cursor.close()
        conn.close()
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/author', methods=['GET'])
def get_books_by_author():
    """Busca libros por autor"""
    author = request.args.get('author')
    if not author:
        return '<?xml version="1.0"?><error>Parámetro author requerido</error>', 400, {'Content-Type': 'application/xml'}
    try:
        conn = get_db_connection()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM book_catalog WHERE authors LIKE %s", ('%' + author + '%',))
        books = cursor.fetchall()
        cursor.close()
        conn.close()
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/create', methods=['POST'])
def create_book():
    """Inserta un nuevo libro"""
    data = request.get_json()
    required_fields = ['isbn', 'title', 'authors', 'year', 'genre', 'price', 'stock', 'format']
    for field in required_fields:
        if field not in data:
            return f'<?xml version="1.0"?><error>Campo {field} requerido</error>', 400, {'Content-Type': 'application/xml'}
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO book_catalog (isbn, title, authors, year, genre, price, stock, format)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (data['isbn'], data['title'], data['authors'], data['year'], data['genre'],
              data['price'], data['stock'], data['format']))
        conn.commit()
        cursor.close()
        conn.close()
        return '<?xml version="1.0"?><success>Libro creado exitosamente</success>', 201, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/update', methods=['PUT'])
def update_book():
    """Actualiza un libro por ISBN"""
    data = request.get_json()
    if 'isbn' not in data:
        return '<?xml version="1.0"?><error>Campo isbn requerido</error>', 400, {'Content-Type': 'application/xml'}
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE book_catalog SET title=%s, authors=%s, year=%s, genre=%s, price=%s, stock=%s, format=%s WHERE isbn=%s",
                       (data.get('title'), data.get('authors'), data.get('year'), data.get('genre'),
                        data.get('price'), data.get('stock'), data.get('format'), data['isbn']))
        conn.commit()
        cursor.close()
        conn.close()
        return '<?xml version="1.0"?><success>Libro actualizado exitosamente</success>', 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

@app.route('/api/books/delete', methods=['DELETE'])
def delete_book():
    """Elimina un libro por ISBN"""
    data = request.get_json()
    if 'isbn' not in data:
        return '<?xml version="1.0"?><error>Campo isbn requerido</error>', 400, {'Content-Type': 'application/xml'}
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM book_catalog WHERE isbn = %s", (data['isbn'],))
        conn.commit()
        cursor.close()
        conn.close()
        return '<?xml version="1.0"?><success>Libro eliminado exitosamente</success>', 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return f'<?xml version="1.0"?><error>{str(e)}</error>', 500, {'Content-Type': 'application/xml'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
