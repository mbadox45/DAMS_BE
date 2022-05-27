import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from "cors";

// Router
// import AuthRoutes from './routes/auth';
import BarangRoutes from './routes/barang';
import LogRoutes from './routes/log';

// Controller
import AuthController from "./controller/AuthController";
import AgenController from "./controller/AgenController";

createConnection().then(async connection => {
    
    const app = express();
    const port:number = 3031;
    
    app.use(cors());
    app.use(BodyParser.json());

    // AUTH
    app.use(new AuthController().router);

    // API
    app.use(new AgenController().router);
    app.use('/api',BarangRoutes);
    app.use('/api',LogRoutes);

    app.listen(port, () => console.log(`App berjalan di port ${port}`));

}).catch(error => console.log(error));
