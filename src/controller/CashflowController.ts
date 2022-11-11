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
import { t_panjar_piutang } from "../entity/Panjar";
import { t_agen } from "../entity/Agen";
import { t_kendaraan } from "../entity/Kendaraan";
import { t_pks } from "../entity/PKS";
import { t_akun } from "../entity/User";

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
        .get(`${this.path}/all/:id`, [checkJwt], this.getArusKasByID)
        .post(`${this.path}/all/`, [checkJwt], this.postArusKas)
    }

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
    
    private getArusKasByID = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.params;
        try {
            const data = await getRepository(t_arus_kas).findOne({id:post.id});
            // const data = await getConnection().manager.query(`
            //     SELECT ak.* FROM t_arus_kas ak
            //     WHERE ak.id = '${tgl.start}';
            // `);
            var load = {};
            if (data.jenis_transaksi == 'panjar agen') {
                const load_panjar = await getRepository(t_panjar_piutang).findOne({id_panjar:data.no_tiket});
                const load_agen = await getRepository(t_agen).findOne({id_agen:load_panjar.id_agen});
                load = {
                    id: data.id,
                    no_tiket: load_panjar.id_panjar,
                    tgl_transaksi: load_panjar.tgl_transaksi,
                    jenis_transaksi : load_panjar.jenis_transaksi,
                    jenis_kas : load_panjar.jenis_kas,
                    nominal: load_panjar.jumlah,
                    keterangan: load_panjar.keterangan,
                    nama_agen: load_agen.nama_agen
                }
            } else if (data.jenis_transaksi == 'pembelian buah') {
                const load_tiket = await getRepository(t_pembelian).findOne({no_tiket:data.no_tiket});
                const load_agen = await getRepository(t_agen).findOne({id_agen:load_tiket.id_agen});
                const load_kendaraan = await getRepository(t_kendaraan).findOne({id:load_tiket.id_kendaraan});
                let user1 = '';
                if (load_tiket.usr_timbang1 == null) {
                    user1 = '-';
                } else {
                    user1 = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_timbang1)})).name;
                }
                let user2 = '-';
                if (load_tiket.usr_timbang2 == null) {
                    user2 = '-';
                } else {
                    user2 = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_timbang2)})).name;
                }
                let kasir = '-';
                if (load_tiket.usr_kasir == null) {
                    kasir = '-';
                } else {
                    kasir = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_kasir)})).name;
                }
                load = {
                    id: data.id,
                    no_tiket: load_tiket.no_tiket,
                    jenis_buah : load_tiket.jenis_buah,
                    tgl_transaksi : load_tiket.tgl_transaksi,
                    tgl_pelunasan : load_tiket.tgl_pelunasan,
                    harga: load_tiket.harga,
                    bruto: load_tiket.bruto,
                    tarra: load_tiket.tarra,
                    netto: load_tiket.netto,
                    status: load_tiket.status,
                    nama_agen: load_agen.nama_agen,
                    jml_pembelian: load_tiket.jml_pembelian,
                    nilai_potongan: load_tiket.nilai_potongan,
                    pot_kg: load_tiket.pot_kg,
                    no_kendaraan: load_kendaraan.no_kendaraan,
                    user1:user1,
                    user2:user2,
                    user3:kasir,
                }
            } else if (data.jenis_transaksi == 'penjualan buah') {
                const load_tiket = await getRepository(t_penjualan).findOne({no_tiket:data.no_tiket});
                const load_pks = await getRepository(t_pks).findOne({id:load_tiket.id_pks});
                const load_kendaraan = await getRepository(t_kendaraan).findOne({id:load_tiket.id_kendaraan});
                let user1 = '';
                if (load_tiket.usr_timbang1 == null) {
                    user1 = '-';
                } else {
                    user1 = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_timbang1)})).name;
                }
                let user2 = '-';
                if (load_tiket.usr_timbang2 == null) {
                    user2 = '-';
                } else {
                    user2 = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_timbang2)})).name;
                }
                let kasir = '-';
                if (load_tiket.usr_kasir == null) {
                    kasir = '-';
                } else {
                    kasir = (await getRepository(t_akun).findOne({id:Number(load_tiket.usr_kasir)})).name;
                }
                load = {
                    id: data.id,
                    no_tiket: load_tiket.no_tiket,
                    jenis_buah : load_tiket.jenis_buah,
                    tgl_transaksi : load_tiket.tgl_transaksi,
                    tgl_pelunasan : load_tiket.tgl_pelunasan,
                    harga: load_tiket.harga,
                    buah_pulang: load_tiket.buah_pulang,
                    bruto: load_tiket.bruto,
                    tarra: load_tiket.tarra,
                    netto: load_tiket.netto,
                    bruto_pks: load_tiket.bruto_pks,
                    tarra_pks: load_tiket.tarra_pks,
                    netto_pks: load_tiket.netto_pks,
                    status: load_tiket.status,
                    nama_pks: load_pks.nama_pks,
                    nilai_pajak: load_tiket.nilai_pajak,
                    ongkos_motor: load_tiket.ongkos_motor,
                    ongkos_bongkar: load_tiket.ongkos_bongkar,
                    jml_pembayaran: load_tiket.jml_pembayaran,
                    jml_penjualan: load_tiket.jml_penjualan,
                    no_kendaraan: load_kendaraan.no_kendaraan,
                    user1:user1,
                    user2:user2,
                    user3:kasir,
                }
            } else {
                load = {
                    id: data.id,
                    no_tiket: '',
                    jenis_transaksi : '',
                    jenis_kas : '',
                    nominal: '',
                    keterangan: '',
                    nama_agen: ''
                }
            }
            // res.send({"code":200,"data":data});
            res.send({"code":200,"data":load});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private postArusKas = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        const load = await getConnection().manager.query(`
        SELECT COUNT(id) FROM t_arus_kas WHERE EXTRACT(YEAR FROM tgl_pelunasan) = EXTRACT(YEAR FROM DATE('${post.tgl}')) AND EXTRACT(MONTH FROM tgl_pelunasan) = EXTRACT(MONTH FROM DATE('${post.tgl}'))
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

            if (post.jenis_transaksi == 'panjar agen') {
                const load_count_panjar = await getConnection().manager.query(`
                SELECT COUNT(id_panjar) FROM t_panjar_piutang WHERE EXTRACT(YEAR FROM tgl_transaksi) = EXTRACT(YEAR FROM DATE('${post.tgl}')) AND EXTRACT(MONTH FROM tgl_transaksi) = EXTRACT(MONTH FROM DATE('${post.tgl}'))
                `);
                const count = Number(load_count_panjar[0].count);
                let nos;
                if (count >= 0 && count <10) {
                    nos = '000'+(Number(load_count_panjar[0].count)+1).toString();
                } else if (count >= 10 && count <100) {
                    nos = '00'+(Number(load_count_panjar[0].count)+1).toString();
                } else if (count >= 100 && count <1000) {
                    nos = '0'+(Number(load_count_panjar[0].count)+1).toString();
                } else{
                    nos = (Number(load_count_panjar[0].count)+1).toString();
                }
                const data4 = {
                    id_panjar: 'PP-'+moment(new Date(post.tgl)).format("YYYYMM")+nos,
                    tgl_transaksi : post.tgl,
                    jenis_transaksi: post.jenis_transaksi,
                    jenis_kas: post.jenis_kas,
                    jumlah: Math.abs(post.nominal),
                    id_agen: post.no_tiket,
                    keterangan: post.ket
                }
                const data = {
                    id : 'AK-'+moment(new Date(post.tgl)).format("YYYYMM")+no,
                    tgl_transaksi: post.tgl,
                    tgl_pelunasan: post.tgl,
                    no_tiket: data4.id_panjar,
                    jenis_transaksi: post.jenis_transaksi,
                    status: post.status,
                    jenis_kas: post.jenis_kas,
                    keterangan: 'lunas',
                    nominal: post.nominal,
                    jumlah: post.nominal,
                    agen: post.no_tiket,
                };
                const data3 = {
                    user_id: post.user_id,
                    no_tiket: data.id,
                    keterangan: 'Transaksi '+data.id+' terbayarkan ',
                    status: 'Arus Kas'
                }
                const piutang_panjar = await getRepository(t_panjar_piutang).create(data4);
                const arus_kas = await getRepository(t_arus_kas).create(data);
                const log = await getRepository(t_jenis).create(data3);
                await getManager().transaction(async transactionalEntityManager => {
                    await transactionalEntityManager.save(piutang_panjar);
                    await transactionalEntityManager.save(arus_kas);
                    await transactionalEntityManager.save(log);
                });
                res.send({"code":200,"message":"success"});
            } else {
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
                    usr_kasir: post.user_id,
                }
                const data3 = {
                    user_id: post.user_id,
                    no_tiket: data.id,
                    keterangan: 'Transaksi '+data.id+' terbayarkan ',
                    status: 'Arus Kas'
                }
    
                let data4, piutang_panjar;
                const load_count_panjar = await getConnection().manager.query(`
                SELECT COUNT(id_panjar) FROM t_panjar_piutang WHERE EXTRACT(YEAR FROM tgl_transaksi) = EXTRACT(YEAR FROM DATE('${post.tgl}')) AND EXTRACT(MONTH FROM tgl_transaksi) = EXTRACT(MONTH FROM DATE('${post.tgl}'))
                `);
                const count = Number(load_count_panjar[0].count);
                let nos;
                if (count >= 0 && count <10) {
                    nos = '000'+(Number(load_count_panjar[0].count)+1).toString();
                } else if (count >= 10 && count <100) {
                    nos = '00'+(Number(load_count_panjar[0].count)+1).toString();
                } else if (count >= 100 && count <1000) {
                    nos = '0'+(Number(load_count_panjar[0].count)+1).toString();
                } else{
                    nos = (Number(load_count_panjar[0].count)+1).toString();
                }
                if (post.status != 'Lunas' && post.status != 'Tidak Ada') {
                    if (post.status == 'Lebih') {
                        data4 = {
                            id_panjar: 'PP-'+moment(new Date(post.tgl)).format("YYYYMM")+nos,
                            tgl_transaksi : post.tgl,
                            jenis_transaksi: post.keterangan,
                            jenis_kas: 'pengeluaran',
                            jumlah: Math.abs(post.sisa),
                            id_agen: post.id_agen,
                            keterangan: post.ket
                        }
                    } else {
                        data4 = {
                            id_panjar: 'PP-'+moment(new Date(post.tgl)).format("YYYYMM")+nos,
                            tgl_transaksi : post.tgl,
                            jenis_transaksi: post.keterangan,
                            jenis_kas: 'penerimaan',
                            jumlah: Math.abs(post.sisa),
                            id_agen: post.id_agen,
                            keterangan: post.ket
                        }
                    }
                    piutang_panjar = await getRepository(t_panjar_piutang).create(data4);
                } 
                // const piutang_panjar = await getRepository(t_panjar_piutang).create(data4);
                const arus_kas = await getRepository(t_arus_kas).create(data);
                const log = await getRepository(t_jenis).create(data3);
                await getManager().transaction(async transactionalEntityManager => {
                    if (post.jenis_transaksi == 'pembelian buah') {
                        await transactionalEntityManager.createQueryBuilder().update(t_pembelian).set(data2).where("no_tiket = :no_tiket",{no_tiket:post.no_tiket}).execute();
                    } else {
                        await transactionalEntityManager.createQueryBuilder().update(t_penjualan).set(data2).where("no_tiket = :no_tiket",{no_tiket:post.no_tiket}).execute();
                    }
                    if (post.status != 'Lunas') {
                        await transactionalEntityManager.save(piutang_panjar);
                    }
                    await transactionalEntityManager.save(arus_kas);
                    await transactionalEntityManager.save(log);
                });
                // res.send({"code":200,"message":"success","data":[data,data2,data3,data4]});
                res.send({"code":200,"message":"success"});
            }
            // res.send({"code":200,"data":{"msg":"Data tidak ada!"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

}
export default CashflowController;