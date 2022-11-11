import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import config from "../config/config";

import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_transaksi } from "../entity/M_Transaksi";
import { t_pks } from "../entity/PKS";
import { t_harga } from "../entity/Harga";
import { t_pajak } from '../entity/Pajak';
import { t_ongkos } from '../entity/Ongkos';

// Controller Interface
import IController from '../config/interface';
import { deflateRaw } from 'zlib';
import moment = require('moment');

class MasterController implements IController{
    public router = Router();

    // PATH
    public path = '/v1/api/m_transaksi';
    public path2 = '/v1/api/pks';
    public path3 = '/v1/api/harga';
    public path4 = '/v1/api/pajak';
    public path5 = '/v1/api/ongkos';

    constructor(){
        this.routerMethod();
    }

    private routerMethod(){
        this.router
        // Transaksi
        .get(`${this.path}/all`, [checkJwt], this.getAllTransaksi)
        .get(`${this.path}/all/:jenis`, this.getTransaksiByKas)
        .post(`${this.path}/all`, this.postTransaksi)

        // PKS
        .get(`${this.path2}/all`, [checkJwt], this.getAllPKS)
        .post(`${this.path2}/all`, this.postPKS)

        // PKS
        .get(`${this.path3}/all`, [checkJwt],this.getAllHarga)
        .post(`${this.path3}/tgl_beli`, [checkJwt], this.getHargaByTglPembelian)
        .post(`${this.path3}/tgl_jual`, [checkJwt], this.getHargaByTglPenjualanPKS)
        .post(`${this.path3}/all`, [checkJwt], this.postHarga)

        // Pajak
        .get(`${this.path4}/all`, [checkJwt],this.getAllPajak)
        .get(`${this.path4}/desc`, [checkJwt],this.getPajakByDesc)
        .post(`${this.path4}/all`, [checkJwt], this.postPajak)

        // Ongkos
        .get(`${this.path5}/all`, [checkJwt],this.getAllOngkos)
        .get(`${this.path5}/all/:nopol/:pks/:ongkos/:jenis`, [checkJwt],this.getOngkosByKendPKS)
        .get(`${this.path5}/upah/:nopol/:pks/:ongkos/:jenis`, [checkJwt],this.getUpahByKendPKS)
        .post(`${this.path5}/all`, [checkJwt], this.postOngkos)
    }

    private getAllTransaksi = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_transaksi).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private getTransaksiByKas = async (req:Request, res:Response, next:NextFunction) => {
        const jenis = req.params.jenis;
        try {
            const users = await getRepository(t_transaksi).find({jenis_kas:jenis});
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private postTransaksi = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            let jml, id;
            if (post.jenis_kas == 'pengeluaran') {
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_transaksi WHERE jenis_kas = 'pengeluaran'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'PL-'+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'PL-0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'PL-00'+jumlah.toString();
                } else {
                    id = 'PL-000'+jumlah.toString();
                }
            } else {
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_transaksi WHERE jenis_kas = 'penerimaan'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'PN-'+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'PN-0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'PN-00'+jumlah.toString();
                } else {
                    id = 'PN-000'+jumlah.toString();
                }
            }
            const data = {
                id: id,
                jenis_kas: post.jenis_kas,
                jenis_transaksi: post.j_transaksi.toLowerCase(),
            }
            const users = await getRepository(t_transaksi).create(data);
            await getRepository(t_transaksi).save(users);
            // console.log(id);
            res.send({"code":200,"data":id});
            // res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    // PKS
    private getAllPKS = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_pks).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private postPKS = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            let jml, id;
            jml = await getConnection().manager.query(
                `SELECT COUNT(id) FROM t_pks`
            );
            const jumlah = Number(jml[0].count)+1
            if (jumlah >=1000 && jumlah < 9999) {
                id = 'PKS-'+jumlah.toString();
            } else if (jumlah >=100 && jumlah < 999) {
                id = 'PKS-0'+jumlah.toString();
            } else if (jumlah >=10 && jumlah < 99) {
                id = 'PKS-00'+jumlah.toString();
            } else {
                id = 'PKS-000'+jumlah.toString();
            }
            const data = {
                id:id,
                nama_pks: post.nama_pks,
                alamat: post.alamat,
                notelp: post.notelp,
            }
            const users = await getRepository(t_pks).create(data);
            await getRepository(t_pks).save(users);
            // console.log(id);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    // Harga
    private getAllHarga = async (req:Request, res:Response, next:NextFunction) => {
        try {
            // const harga = await getConnection().manager.query(
            //     `SELECT * FROM t_harga  WHERE jenis_transaksi = 'pembelian'`
            // );
            const users = await getRepository(t_harga).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private getHargaByTglPembelian = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_harga).findOne({tgl:req.body.tgl, jenis_transaksi:'pembelian'});
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private getHargaByTglPenjualanPKS = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            const users = await getRepository(t_harga).findOne({tgl:post.tgl, jenis_transaksi:'penjualan', id_pks:post.id_pks, jenis_buah:post.jenis_buah});
            var data;
            if (users == null) {
                data = {
                    harga:'0'
                }
            } else {
                data = {
                    harga: users.harga
                }
            }
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    private postHarga = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            let jml, id, pks, buah;
            if (post.jenis_transaksi == 'pembelian') {
                pks = '-';
                buah= 'all';
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_harga WHERE jenis_transaksi = 'pembelian'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'HPM-'+moment(new Date(post.tgl)).format("YYYYMM")+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'HPM-'+moment(new Date(post.tgl)).format("YYYYMM")+'0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'HPM-'+moment(new Date(post.tgl)).format("YYYYMM")+'00'+jumlah.toString();
                } else {
                    id = 'HPM-'+moment(new Date(post.tgl)).format("YYYYMM")+'000'+jumlah.toString();
                }
            } else {
                pks = post.id_pks;
                buah = post.jenis_buah;
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_harga WHERE jenis_transaksi = 'penjualan'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'HPJ-'+moment(new Date(post.tgl)).format("YYYYMM")+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'HPJ-'+moment(new Date(post.tgl)).format("YYYYMM")+'0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'HPJ-'+moment(new Date(post.tgl)).format("YYYYMM")+'00'+jumlah.toString();
                } else {
                    id = 'HPJ-'+moment(new Date(post.tgl)).format("YYYYMM")+'000'+jumlah.toString();
                }
            }
            const data = {
                id:id,
                tgl:new Date(post.tgl),
                harga: Number(post.harga),
                jenis_transaksi: post.jenis_transaksi,
                id_pks: pks,
                jenis_buah: buah
            }
            const users = await getRepository(t_harga).create(data);
            await getRepository(t_harga).save(users);
            // console.log(id);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    // Pajak
    private postPajak = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            const data = {
                tgl: moment(new Date).format('YYYY-MM-DD'),
                nilai_pajak: post.nilai_pajak
            };
            const users = await getRepository(t_pajak).create(data);
            await getRepository(t_pajak).save(users);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
    private getAllPajak = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const pajak = await getRepository(t_pajak).find();
            res.send({"code":200,"data":pajak});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
    private getPajakByDesc = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const pajak = await getConnection().createQueryBuilder(t_pajak,'t_pajak').orderBy('tgl','DESC').getOne();
            var data;
            if (pajak == null) {
                data = {
                    tgl:'',
                    nilai_pajak:0
                }
            } else {
                data = {
                    tgl:pajak.tgl,
                    nilai_pajak: pajak.nilai_pajak
                }
            }
            res.send({"code":200,"data":data});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    // Ongkos
    private postOngkos = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        var jml, id;
        try {
            if (post.jenis_transaksi == 'transport') {
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_ongkos WHERE jenis_transaksi = 'transport'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'TR-'+moment(new Date()).format("YYYYMM")+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'TR-'+moment(new Date()).format("YYYYMM")+'0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'TR-'+moment(new Date()).format("YYYYMM")+'00'+jumlah.toString();
                } else {
                    id = 'TR-'+moment(new Date()).format("YYYYMM")+'000'+jumlah.toString();
                }
            } else {
                jml = await getConnection().manager.query(
                    `SELECT COUNT(id) FROM t_ongkos WHERE jenis_transaksi = 'upah'`
                );
                const jumlah = Number(jml[0].count)+1
                if (jumlah >=1000 && jumlah < 9999) {
                    id = 'UP-'+moment(new Date()).format("YYYYMM")+jumlah.toString();
                } else if (jumlah >=100 && jumlah < 999) {
                    id = 'UP-'+moment(new Date()).format("YYYYMM")+'0'+jumlah.toString();
                } else if (jumlah >=10 && jumlah < 99) {
                    id = 'UP-'+moment(new Date()).format("YYYYMM")+'00'+jumlah.toString();
                } else {
                    id = 'UP-'+moment(new Date()).format("YYYYMM")+'000'+jumlah.toString();
                }
            }
            const data = {
                id: id,
                id_pks: post.id_pks,
                id_kendaraan: post.id_kendaraan,
                jenis_transaksi: post.jenis_transaksi,
                jenis_upah: post.jenis_upah,
                nominal: post.nominal,
            };
            const ongkos = await getRepository(t_ongkos).create(data);
            await getRepository(t_ongkos).save(ongkos);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
    private getAllOngkos = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const ongkos = await getRepository(t_ongkos).find();
            res.send({"code":200,"data":ongkos});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
    private getOngkosByKendPKS = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.params;
        try {
            const ongkos = await getRepository(t_ongkos).findOne({id_kendaraan:post.nopol, id_pks:post.pks, jenis_upah:post.ongkos, jenis_transaksi:post.jenis});
            const data = {'nominal':ongkos.nominal};
            res.send({"code":200,"data":data});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
    private getUpahByKendPKS = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.params;
        try {
            const ongkos = await getRepository(t_ongkos).findOne({id_kendaraan:post.nopol, id_pks:post.pks, jenis_upah:post.ongkos, jenis_transaksi:post.jenis});
            var nominal;
            if (ongkos == null) {
                nominal = 0;
            } else {
                nominal = ongkos.nominal;
            }
            const data = {'nominal':nominal};
            res.send({"code":200,"data":data});
        } catch (error) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }
}

export default MasterController;