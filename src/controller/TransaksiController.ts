import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import * as moment from "moment";

// Authentication
import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_pembelian } from "../entity/Pembelian";
import { t_penjualan } from "../entity/Penjualan";
import { t_stok } from "../entity/Stok";

// Controller Interface
import IController from '../config/interface';

class TransactionController implements IController{
    public router = Router();

    public path = '/v1/api/pembelian';
    public path2 = '/v1/api/stok';
    public path3 = '/v1/api/penjualan';

    // Function Public
    constructor(){
        this.routerMethod();
    }

    // Function Router
    private routerMethod(){
        this.router
        // Pembelian
        .get(`${this.path}/all`, [checkJwt], this.getPembelian)
        .get(`${this.path}/by/:id`, [checkJwt], this.getPembelianByID)
        .get(`${this.path}/all/:status`, [checkJwt], this.getPembelianByStatus)
        .post(`${this.path}/start`,[checkJwt], this.postStartTransaction)
        .post(`${this.path}/second`, [checkJwt],this.postSecondTransaction)

        // Stock
        .get(`${this.path2}/all`, this.getStock)
        .get(`${this.path2}/jum`, this.getJumlahStok)

        // Penjualan
        .get(`${this.path3}/all`, [checkJwt], this.getPenjualan)
        .get(`${this.path3}/all/:id`, [checkJwt], this.getPenjualanByID)
        .post(`${this.path3}/start`,[checkJwt], this.postStartPenjualan)
        .post(`${this.path3}/pending`,[checkJwt], this.postPendingPenjualan)
        .post(`${this.path3}/payment`,[checkJwt], this.postPksPenjualan)
    }

    // Pembelian
    private getPembelian = async (req: Request, res: Response, next: NextFunction) => {
        // const post = req.body;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_pembelian.*, t_kendaraan.no_kendaraan, t_agen.nama_agen FROM t_pembelian 
                JOIN t_kendaraan ON t_pembelian.id_kendaraan = t_kendaraan.id 
                JOIN t_agen ON t_pembelian.id_agen = t_agen.id_agen
            `);
            // const data = await getRepository(t_pembelian).find();
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private getPembelianByStatus = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_pembelian.*, t_kendaraan.no_kendaraan, t_agen.nama_agen FROM t_pembelian
                JOIN t_kendaraan ON t_pembelian.id_kendaraan = t_kendaraan.id 
                JOIN t_agen ON t_pembelian.id_agen = t_agen.id_agen
                WHERE t_pembelian.status = '${post.status}' 
            `);
            // const data = await getRepository(t_pembelian).find();
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private getPembelianByID = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_pembelian.*, t_kendaraan.no_kendaraan, t_agen.nama_agen FROM t_pembelian
                JOIN t_kendaraan ON t_pembelian.id_kendaraan = t_kendaraan.id 
                JOIN t_agen ON t_pembelian.id_agen = t_agen.id_agen
                WHERE t_pembelian.no_tiket = '${post.id}' 
            `);
            // const data = await getRepository(t_pembelian).find();
            res.send({"code":200,"data":data[0]});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private postStartTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.body;
        const load = await getConnection().manager.query(`
        SELECT COUNT(no_tiket) FROM t_pembelian WHERE EXTRACT(YEAR FROM tgl_transaksi) = EXTRACT(YEAR FROM DATE('${post.tgl_transaksi}')) AND EXTRACT(MONTH FROM tgl_transaksi) = EXTRACT(MONTH FROM DATE('${post.tgl_transaksi}'))
        `);
        try {
            const counts = Number(load[0].count);
            let no;
            if (counts >= 0 && counts <10) {
                no = '000'+(Number(load[0].count)+1).toString();
            } else if (counts >= 10 && counts <100) {
                no = '00'+(Number(load[0].count)+1).toString();
            } else if (counts >= 100 && counts <1000) {
                no = '0'+(Number(load[0].count)+1).toString();
            } else{
                no = (Number(load[0].count)+1).toString();
            }
            const data = {
                no_tiket:moment(new Date(post.tgl_transaksi)).format("YYYYMM")+no,
                id_agen: post.nama_agen,
                jenis_buah: post.jenis_buah,
                id_kendaraan: post.no_kendaraan,
                tgl_transaksi: post.tgl_transaksi,
                harga: post.harga,
                bruto: post.bruto,
                status: 'draft',
                // tarra: post.tarra,
                // netto: post.netto,
                // pot: post.potongan,
                pot_kg: post.pot_kg,
                // tgl_pelunasan: post.tgl_pelunasan,
                usr_timbang1: post.user,
            }
            const users = await getRepository(t_pembelian).create(data);
            await getRepository(t_pembelian).save(users);
            res.send({"code":200,"msg":"Success","status":true, "data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    private postSecondTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.body;
        try {
            const data = {
                status: 'pending',
                tarra: post.tarra,
                netto: post.netto,
                pot: post.pot,
                harga: post.harga,
                pot_kg: post.pot_kg,
                jml_pembelian: post.jml_pembelian,
                // tgl_pelunasan: post.tgl_pelunasan,
                usr_timbang2: post.user,
            }

            const data_stok = {
                no_tiket: post.id,
                tonase: post.netto_bersih,
                tgl_transaksi: post.tgl_transaksi,
                jenis: post.jenis_buah,
                transaksi: 'pembelian',
                harga: post.harga,
                jumlah: post.jml_pembelian
            }

            const stoks = await getRepository(t_stok).create(data_stok);
            await getRepository(t_stok).save(stoks);
            const users = await getConnection().createQueryBuilder().update(t_pembelian).set(data)
            .where("no_tiket = :id",{id:post.id}).execute();
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    // Stock
    private getStock = async (req: Request, res: Response, next: NextFunction) => {
        // const post = req.body;
        try {
            const data = await getRepository(t_stok).find();
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private getJumlahStok = async (req: Request, res: Response, next: NextFunction) => {
        // const post = req.body;
        try {
            const pb_tbs = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'tbs' AND transaksi = 'pembelian'
            `);
            const pj_tbs = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'tbs' AND transaksi = 'penjualan'
            `);
            const pb_b1 = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'buah1' AND transaksi = 'pembelian'
            `);
            const pj_b1 = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'buah1' AND transaksi = 'penjualan'
            `);
            const pb_b2 = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'buah2' AND transaksi = 'pembelian'
            `);
            const pj_b2 = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'buah2' AND transaksi = 'penjualan'
            `);
            const pb_br = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'berondolan' AND transaksi = 'pembelian'
            `);
            const pj_br = await getConnection().manager.query(`
                SELECT SUM(tonase::int) from t_stok WHERE jenis = 'berondolan' AND transaksi = 'penjualan'
            `);
            const data = {
                tbs: Number(pb_tbs[0].sum) - Number(pj_tbs[0].sum),
                b1: Number(pb_b1[0].sum) - Number(pj_b1[0].sum),
                b2: Number(pb_b2[0].sum) - Number(pj_b2[0].sum),
                bro: Number(pb_br[0].sum) - Number(pj_br[0].sum)
            };
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    // Arus Kas
    private getArusKas = async(req: Request, res: Response, next: NextFunction) => {
        const post = req.body;

        try {
            const data = {
                status: post.status,
                tgl_pelunasan: post.tgl,
                no_tiket: post.no_tiket
            };
            const data2 = {
                tgl_transaksi: post.tgl,
                status: post.status,
                jumlah:post.jumlah
            }
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    // Penjualan
    private getPenjualan = async (req: Request, res: Response, next: NextFunction) => {
        // const post = req.body;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_penjualan.*, t_kendaraan.no_kendaraan, t_pks.nama_pks FROM t_penjualan 
                JOIN t_kendaraan ON t_penjualan.id_kendaraan = t_kendaraan.id 
                JOIN t_pks ON t_penjualan.id_pks = t_pks.id
            `);
            // const data = await getRepository(t_pembelian).find();
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private getPenjualanByID = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_penjualan.*, t_kendaraan.no_kendaraan, t_pks.nama_pks FROM t_penjualan 
                JOIN t_kendaraan ON t_penjualan.id_kendaraan = t_kendaraan.id 
                JOIN t_pks ON t_penjualan.id_pks = t_pks.id
                WHERE t_penjualan.no_tiket = '${post.id}'
            `);
            // const data = await getRepository(t_pembelian).find();
            res.send({"code":200,"data":data[0]});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private postStartPenjualan = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.body;
        const load = await getConnection().manager.query(`
        SELECT COUNT(no_tiket) FROM t_penjualan WHERE EXTRACT(YEAR FROM tgl_transaksi) = EXTRACT(YEAR FROM DATE('${post.tgl_transaksi}')) AND EXTRACT(MONTH FROM tgl_transaksi) = EXTRACT(MONTH FROM DATE('${post.tgl_transaksi}'))
        `);
        try {
            const counts = Number(load[0].count);
            let no;
            if (counts >= 0 && counts <10) {
                no = '000'+(Number(load[0].count)+1).toString();
            } else if (counts >= 10 && counts <100) {
                no = '00'+(Number(load[0].count)+1).toString();
            } else if (counts >= 100 && counts <1000) {
                no = '0'+(Number(load[0].count)+1).toString();
            } else{
                no = (Number(load[0].count)+1).toString();
            }
            const data = {
                no_tiket:'PJ-'+moment(new Date(post.tgl_transaksi)).format("YYYYMM")+no,
                id_pks: post.nama_pks,
                jenis_buah: post.jenis_buah,
                id_kendaraan: post.no_kendaraan,
                tgl_transaksi: post.tgl_transaksi,
                ongkos_motor:post.ongkos_motor,
                ongkos_bongkar:post.ongkos_bongkar,
                nilai_pajak:post.nilai_pajak,
                harga: post.harga,
                tarra: post.tarra,
                status: 'draft',
                usr_timbang1: post.user,
            }
            const users = await getRepository(t_penjualan).create(data);
            await getRepository(t_penjualan).save(users);
            res.send({"code":200,"msg":"Success","status":true, "data":data});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private postPendingPenjualan = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.body;
        try {
            const data = {
                netto: post.netto,
                bruto: post.bruto,
                status: 'pending',
                usr_timbang2: post.user,
            }
            const users = await getConnection().createQueryBuilder().update(t_penjualan).set(data)
            .where("no_tiket = :id",{id:post.no_tiket}).execute();
            // const users = await getRepository(t_penjualan).create(data);
            // await getRepository(t_penjualan).save(users);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private postPksPenjualan = async (req: Request, res: Response, next: NextFunction) => {
        const post = req.body;
        try {
            const data = {
                netto_pks: post.netto_pks,
                bruto_pks: post.bruto_pks,
                tarra_pks: post.tarra_pks,
                buah_pulang: post.buah_pulang,
                jml_pembayaran: post.jml_pembayaran,
                jml_penjualan: post.jml_penjualan,
                kenaikan_tonase: post.kenaikan_tonase,
                status: 'payment',
                usr_timbang3: post.user,
            }
            const users = await getConnection().createQueryBuilder().update(t_penjualan).set(data)
            .where("no_tiket = :id",{id:post.no_tiket}).execute();
            // const users = await getRepository(t_penjualan).create(data);
            // await getRepository(t_penjualan).save(users);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
}
export default TransactionController;