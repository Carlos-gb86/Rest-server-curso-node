// ===========================================
// PUERTO
// ===========================================

process.env.PORT = process.env.PORT || 3000;


// ===========================================
// ENTORNO
// ===========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================================
// Vencimiento del token
// ===========================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ===========================================
// SEED de autenticación
// ===========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ===========================================
// BASE DE DATOS
// ===========================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
};
process.env.URLDB = urlDB;


// ===========================================
// Client ID
// ===========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "1085884835189-rfsb2urbdhcplqmohgipbb0e71perp52.apps.googleusercontent.com"