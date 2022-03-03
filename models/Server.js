const express = require('express'); //minimalist web framework for Node.js applications
const cors = require('cors'); //CORS-> Cross-origin resource sharing (CORS) 
const fileupload = require('express-fileupload');
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
            users: '/api/user',
            categories: '/api/category',
            products: '/api/product',
            orders: '/api/order',
            search: '/api/search',
            upload: '/api/upload'
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

        //Fileupload -- carga de archivos
        this.app.use(fileupload({ useTempFiles : true }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.categories, require('../routes/category'));
        this.app.use(this.paths.products, require('../routes/product'));
        this.app.use(this.paths.orders, require('../routes/order'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.upload, require('../routes/upload'));

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