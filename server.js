const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Conexión a la base de datos física
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir un Esquema y un Modelo para los productos
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true }
});

const Producto = mongoose.model('Producto', productoSchema);

// Endpoint GET: Obtener productos desde la base de datos real
app.api = {}; // solo sintaxis de soporte
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ status: "Error", mensaje: "Error al obtener los productos" });
    }
});

// Endpoint POST: Guardar producto en la base de datos real
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        if (!nombre || !precio || stock === undefined) {
            return res.status(400).json({ status: "Error", mensaje: "Faltan datos requeridos" });
        }

        const nuevoProducto = new Producto({
            nombre,
            precio: parseFloat(precio),
            stock: parseInt(stock)
        });

        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ status: "Error", mensaje: "Error al guardar el producto" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});