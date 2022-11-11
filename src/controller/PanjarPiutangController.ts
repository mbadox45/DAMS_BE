import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import * as moment from "moment";

// Authentication
import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_arus_kas } from "../entity/Arus_Kas";
import { t_pembelian } from "../entity/Pembelian";
import { t_penjualan } from "../entity/Penjualan";
import { t_jenis } from "../entity/Log";
import { t_agen } from "../entity/Agen";
import { t_panjar_piutang } from "../entity/Panjar";

// Controller Interface
import IController from '../config/interface';

class PanjarPiutangController implements IController{
    public router = Router();

    public path = '/v1/api/panjar';

    // Function Public
    constructor(){
        this.routerMethod();
    }

    // Function Router
    private routerMethod(){
        this.router
        .get(`${this.path}/transaksi/:start/:end`, [checkJwt], this.getTransaksiPanjar)
        .get(`${this.path}/all/`, [checkJwt], this.getAllPanjar)
        .get(`${this.path}/all/:id_agen`, [checkJwt], this.getPanjarByID)
        // .post(`${this.path}/all/`, [checkJwt], this.postArusKas)
    }

    // Panjar
    private getArusKas = async (req:Request, res:Response, next:NextFunction) => {
        const tgl = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT * FROM t_arus_kas 
                WHERE DATE(tgl_pelunasan) >= DATE('${tgl.start}') 
                AND DATE(tgl_pelunasan) <= DATE('${tgl.end}') ;
            `);
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private getAllPanjar = async (req:Request, res:Response, next:NextFunction) => {
        const tgl = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT * FROM t_agen;
            `);
            const datas = [];
            var load = [];
            for (let i = 0; i < data.length; i++) {
                const pengeluaran = await getConnection().manager.query(`
                    SELECT 
                        CASE WHEN SUM(jumlah) IS NULL
                        THEN 0
                        ELSE SUM(jumlah)
                        END AS total 
                    FROM t_panjar_piutang 
                    WHERE jenis_transaksi = 'panjar agen'
                    AND jenis_kas = 'pengeluaran'
                    AND id_agen = '${data[i].id_agen}' ;
                `);
                const penerimaan = await getConnection().manager.query(`
                    SELECT 
                        CASE WHEN SUM(jumlah) IS NULL
                        THEN 0
                        ELSE SUM(jumlah)
                        END AS total 
                    FROM t_panjar_piutang 
                    WHERE jenis_transaksi = 'panjar agen'
                    AND jenis_kas = 'penerimaan'
                    AND id_agen = '${data[i].id_agen}' ;
                `);
                datas[i] = {
                    nama_agen: data[i].nama_agen,
                    pengeluaran: Number(pengeluaran[0].total),
                    penerimaan: Number(penerimaan[0].total),
                }
            }
            // load = datas;
            res.send({"code":200,"data":datas});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private getPanjarByID = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.params;
        try {
            const pengeluaran = await getConnection().manager.query(`
                SELECT 
                    CASE WHEN SUM(jumlah) IS NULL
                    THEN 0
                    ELSE SUM(jumlah)
                    END AS total 
                FROM t_panjar_piutang 
                WHERE jenis_transaksi = 'panjar agen'
                AND jenis_kas = 'pengeluaran'
                AND id_agen = '${post.id_agen}' ;
            `);
            const penerimaan = await getConnection().manager.query(`
                SELECT 
                    CASE WHEN SUM(jumlah) IS NULL
                    THEN 0
                    ELSE SUM(jumlah)
                    END AS total 
                FROM t_panjar_piutang 
                WHERE jenis_transaksi = 'panjar agen'
                AND jenis_kas = 'penerimaan'
                AND id_agen = '${post.id_agen}' ;
            `);
            const datas = {
                id_agen: post.id_agen,
                pengeluaran: Number(pengeluaran[0].total),
                penerimaan: Number(penerimaan[0].total),
            }
            // load = datas;
            res.send({"code":200,"data":datas});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private getTransaksiPanjar = async (req:Request, res:Response, next:NextFunction) => {
        const tgl = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT t_agen.nama_agen, t_panjar_piutang.* FROM t_panjar_piutang
                JOIN t_agen ON t_panjar_piutang.id_agen = t_agen.id_agen 
                WHERE jenis_transaksi = 'panjar agen'
                AND DATE(tgl_transaksi) >= DATE('${tgl.start}') 
                AND DATE(tgl_transaksi) <= DATE('${tgl.end}') ;
            `);
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private postArusKas = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        const load = await getConnection().manager.query(`
        SELECT COUNT(id) FROM t_arus_kas WHERE EXTRACT(YEAR FROM tgl_transaksi) = EXTRACT(YEAR FROM DATE('${post.tgl}')) AND EXTRACT(MONTH FROM tgl_transaksi) = EXTRACT(MONTH FROM DATE('${post.tgl}'))
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
                id : 'AK-'+moment(new Date(post.tgl)).format("YYYYMM")+no,
                tgl_transaksi: post.tgl_transaksi,
                tgl_pelunasan: post.tgl,
                no_tiket: post.no_tiket,
                jenis_transaksi: post.jenis_transaksi,
                status: post.status,
                jenis_kas: post.jenis_kas,
                keterangan: 'lunas',
                nominal: post.nominal,
                jumlah: post.jumlah,
                agen: post.nama_agen,
            };
            const data2 = {
                status: 'paid',
                tgl_pelunasan: post.tgl,
            }
            const data3 = {
                user_id: post.user_id,
                no_tiket: data.id,
                keterangan: 'Transaksi '+data.id+' terbayarkan ',
                status: 'Arus Kas'
            }
            const arus_kas = await getRepository(t_arus_kas).create(data);
            const log = await getRepository(t_jenis).create(data3);
            // await getRepository(t_arus_kas).save(users);
            await getManager().transaction(async transactionalEntityManager => {
                if (post.jenis_transaksi == 'pembelian buah') {
                    await transactionalEntityManager.createQueryBuilder().update(t_pembelian).set(data2).where("no_tiket = :no_tiket",{no_tiket:post.no_tiket}).execute();
                } else {
                    await transactionalEntityManager.createQueryBuilder().update(t_penjualan).set(data2).where("no_tiket = :no_tiket",{no_tiket:post.no_tiket}).execute();
                }
                await transactionalEntityManager.save(arus_kas);
                await transactionalEntityManager.save(log);
            });
            res.send({"code":200,"data":data});
            // res.send({"code":200,"data":{"msg":"Data tidak ada!"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

}
export default PanjarPiutangController;