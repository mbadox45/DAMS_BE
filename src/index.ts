import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from "cors";
// import postRoutes from './routes/postRoutes';
import AuthRoutes from './routes/auth';
import ContractRoutes from './routes/contract';
// import fileRoutes from './routes/files';
import BarangRoutes from './routes/barang';
import KendaraanRoutes from './routes/kendaraan';
import WBRoutes from './routes/averyweight';
import LogRoutes from './routes/log';

createConnection().then(async connection => {
    
    const app = express();
    const port:number = 3031;
    
    app.use(cors());
    app.use(BodyParser.json());

    // AUTH
    app.use('/auth',AuthRoutes);

    // API
    app.use('/api',ContractRoutes);
    app.use('/api',BarangRoutes);
    app.use('/api',KendaraanRoutes);
    app.use('/api',WBRoutes);
    app.use('/api',LogRoutes);

    app.listen(port, () => console.log(`App berjalan di port ${port}`));

}).catch(error => console.log(error));
