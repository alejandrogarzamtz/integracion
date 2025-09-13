<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Plantilla raíz -->
    <xsl:template match="/">
        <html lang="es">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Biblioteca - Inventario</title>
                <!-- Aquí enlazamos el CSS externo -->
                <link rel="stylesheet" href="catalogo_libros.css"/>
            </head>
            <body>
                <h1>Inventario de Libros</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Género</th>
                            <th>Año</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Formato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:apply-templates select="catalog/book"/>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>

    <!-- Plantilla para cada libro -->
    <xsl:template match="book">
        <tr>
            <td><xsl:value-of select="@isbn"/></td>
            <td><xsl:value-of select="title"/></td>
            <td><xsl:value-of select="author"/></td>
            <td><xsl:value-of select="genre"/></td>
            <td><xsl:value-of select="year"/></td>
            <td>$<xsl:value-of select="price"/></td>
            <td>
                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="number(stock) &lt;= 10">low</xsl:when>
                        <xsl:when test="number(stock) &lt;= 30">medium</xsl:when>
                        <xsl:otherwise>high</xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
                <xsl:value-of select="stock"/>
            </td>
            <td>
                <xsl:value-of select="format"/>
            </td>
        </tr>
    </xsl:template>

</xsl:stylesheet>
