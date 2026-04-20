require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const routes = require('./routes/index');

const app = express();

const limiter = rateLimiter({
    windowMs: 30 * 60 * 1000, // 30 minutos
    max: 1000, // 1000 solicitudes por ventana
    message: { success: false, error: { code: 'LIMITE_EXCEDIDO', message: 'Has excedido el límite de solicitudes. Por favor, inténtalo de nuevo más tarde.' } }
});

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/v1', limiter);
app.use('/api/v1', routes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'API v1 en línea. Accede a los endpoints en /api/v1.' });
});

// Rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'RUTA_NO_ENCONTRADA', message: `La ruta ${req.originalUrl} no existe.` } });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: { code: 'ERROR_INTERNO', message: 'Ha ocurrido un error interno en el servidor.' } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
});
