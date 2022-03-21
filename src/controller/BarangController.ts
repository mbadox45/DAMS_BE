import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { randomBytes } from 'crypto';
import { t_barang } from "../entity/Barang";
import { t_jenis } from "../entity/Log";

class BarangController{

    static getAllBarang = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const barang = await getRepository(t_barang).find()
            res.send({"code":200,"data":barang});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static createBarang = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        try {
            const kendaraan = await getRepository(t_barang).create({
                kode_barang: randomBytes(16).toString('hex'),
                nama_barang: data.nama_barang.toUpperCase()
            });
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Barang',
                keterangan: `Nama barang ${data.nama_barang} telah ditambahkan oleh ${data.user_id}`
            });
            await getRepository(t_barang).save(kendaraan);
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Data tidak ada!"}});
        }
    }

    static updateBarang = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Barang',
                keterangan: `Kode barang ${data.kode_barang} telah diupdate oleh ${data.user_id}`
            });
            const barang = await getConnection().createQueryBuilder().update(t_barang).set({
                nama_barang: data.nama_barang.toUpperCase(),
            }).where("kode_barang = :id",{id:data.kode_barang}).execute();
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static deleteBarang = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.body;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: id.user_id,
                created_at: new Date(),
                status: 'Master Barang',
                keterangan: `Kode barang ${id.no_kendaraan} telah dihapus oleh ${id.user_id}`
            });
            const result = await getRepository(t_barang).delete(id.kode_barang);
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }
}

export default BarangController;