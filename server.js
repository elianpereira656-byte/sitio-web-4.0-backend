const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de CORS usando la variable de entorno
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Base de datos temporal en memoria (para pruebas)
let productos = [
    { id: 1, nombre: "Producto Ejemplo 1", precio: 100.00, stock: 10 },
    { id: 2, nombre: "Producto Ejemplo 2", precio: 250.50, stock: 5 }
];

// Endpoint GET: Obtener todos los productos
app.get('/api/productos', (req, res) => {
    try {
        res.json(productos);
    } catch (error) {
        res.status(500).json({ status: "Error", mensaje: "Error interno del servidor" });
    }
});

// Endpoint POST: Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        if (!nombre || !precio || stock === undefined) {
            return res.status(400).json({ status: "Error", mensaje: "Faltan datos requeridos" });
        }

        const nuevoProducto = {
            id: productos.length + 1,
            nombre,
            precio: parseFloat(precio),
            stock: parseInt(stock)
        };

        productos.push(nuevoProducto);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ status: "Error", mensaje: "Error al guardar el producto" });
    }
});

// Puerto dinámico que exige Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});