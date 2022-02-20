const express = require('express'); //minimalist web framework for Node.js applications
const cors = require('cors'); //CORS-> Cross-origin resource sharing (CORS) 
// const fileUpload = require('express-fileupload');
const { createServer } = require('http');


const { validarJSON } = require('../middlewares/validar-json');
const { dbConnection } = require('../db/config');
const path = require('path');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);

        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            // search: '/api/search',
            // categories: '/api/categories',
            // products: '/api/products',
            // orders: '/api/orders',
        }

        //Conectar a DB
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de app
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS-> Cross-origin Resource sharing
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Validacion de JSON valid request
        this.app.use(validarJSON);

        //Directorio Público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));

        this.app.get("*" , (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
        });

    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server PROSAS-BACKEND running in port ', this.port);
        });
    }
}

module.exports = {
    Server
}