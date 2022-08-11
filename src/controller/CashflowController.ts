import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import * as moment from "moment";

// Authentication
import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_arus_kas } from "../entity/Arus_Kas";
import { t_pembelian } from "../entity/Pembelian";
import { t_jenis } from "../entity/Log";

// Controller Interface
import IController from '../config/interface';

class CashflowController implements IController{
    public router = Router();

    public path = '/v1/api/arus_kas';

    // Function Public
    constructor(){
        this.routerMethod();
    }

    // Function Router
    private routerMethod(){
        this.router
        .get(`${this.path}/by_date/:start/:end`, [checkJwt], this.getArusKas)
        .post(`${this.path}/all/`, [checkJwt], this.postArusKas)
    }

    private getArusKas = async (req:Request, res:Response, next:NextFunction) => {
        const tgl = req.params;
        try {
            const data = await getConnection().manager.query(`
                SELECT * FROM t_arus_kas 
                WHERE DATE(tgl_transaksi) >= DATE('${tgl.start}') 
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
                tgl_transaksi: post.tgl,
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
                status: 'paid'
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
                await transactionalEntityManager.createQueryBuilder().update(t_pembelian).set(data2).where("no_tiket = :no_tiket",{no_tiket:post.no_tiket}).execute();
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
export default CashflowController;