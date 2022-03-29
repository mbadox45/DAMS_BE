import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, Not } from "typeorm";
import { randomBytes } from 'crypto'
import { t_kendaraan } from "../entity/Kendaraan";
import { t_angkutan } from "../entity/Angkutan";
import { v_kendaraan } from "../entity/VKendaraan";
import { t_jenis } from "../entity/Log";
import { v_truckin } from "../entity/TruckIn";

class KendaraanController{

    // Kendaraan
    static getAllKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const kendaraan = await getRepository(t_kendaraan).find();
            res.send({"code":200,"data":kendaraan});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static getViewKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const kendaraan = await getRepository(v_kendaraan).find();
            res.send({"code":200,"data":kendaraan});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static getByIdKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.params.id;
        try {
            const kendaraan = await getRepository(t_kendaraan).findOne({no_kendaraan:id});
            res.send({"code":200,"data":kendaraan});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const id_kendaraan = randomBytes(16).toString('hex');
        try {
            const kendaraan = await getRepository(t_kendaraan).create({
                id_kendaraan: id_kendaraan,
                no_kendaraan: data.no_kendaraan,
                kode_angkutan: data.kode_angkutan,
                tarra: 0
            });
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Kendaraan',
                keterangan: `Penambahan No.Kendaraan ${data.no_kendaraan}`
            });
            await getRepository(t_kendaraan).save(kendaraan);
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Data tidak ada!"}});
        }
    }

    static editKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Kendaraan',
                keterangan: `Update data kendaraan ${data.no_kendaraan}`
            });
            const angkutan = await getConnection().createQueryBuilder().update(t_kendaraan).set({
                no_kendaraan: data.no_kendaraan,
                tarra: data.tarra,
                kode_angkutan: data.kode_angkutan,
            }).where("id_kendaraan = :id",{id:data.id_kendaraan}).execute();
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static deleteKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.body;
        try {
            const kendaraan = await getRepository(t_kendaraan).findOne({no_kendaraan:id.no_kendaraan});
            const result = await getRepository(t_kendaraan).delete(kendaraan.id_kendaraan);
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: id.user_id,
                created_at: new Date(),
                status: 'Master Kendaraan',
                keterangan: `No. kendaraan ${id.no_kendaraan} telah dihapus`
            });
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    // Angkutan
    static getAllAngkutan = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const angkutan = await getRepository(t_angkutan).find();
            res.send({"code":200,"data":angkutan});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postAngkutan = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const hitung = await getRepository(t_angkutan).count();
        var value;
        if (hitung > 99999) {
            value = `0${Number(hitung)}`;
        }else if (hitung > 999 && hitung < 10000) {
            value = `00${Number(hitung)}`;
        }else if (hitung < 100 && hitung > 9) {
            value = `000${Number(hitung)}`;
        }else if (hitung < 10 && hitung > 0) {
            value = `0000${Number(hitung)}`;
        }else {
            value = (Number(hitung)+1).toString();
        }
        const kode_angkutan = 'Z'+value;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Angkutan',
                keterangan: `Penambahan angkutan ${data.nama_angkutan}`
            });
            const angkutan = await getRepository(t_angkutan).create({
                kode_angkutan: kode_angkutan,
                nama_angkutan: data.nama_angkutan.toUpperCase(),
            });
            await getRepository(t_jenis).save(logs);
            await getRepository(t_angkutan).save(angkutan);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Data tidak ada!"}});
        }
    }

    static editAngkutan = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: data.user_id,
                created_at: new Date(),
                status: 'Master Angkutan',
                keterangan: `Mengubah nama angkutan menjadi ${data.nama_angkutan}`
            });
            const angkutan = await getConnection().createQueryBuilder().update(t_angkutan).set({
                nama_angkutan: data.nama_angkutan.toUpperCase(),
            }).where("kode_angkutan = :id",{id:data.kode_angkutan}).execute();
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static deleteAngkutan = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.body;
        try {
            const result = await getRepository(t_angkutan).delete(id.kode_angkutan);
            const logs = await getRepository(t_jenis).create({
                no_tiket: '-',
                user_id: id.user_id,
                created_at: new Date(),
                status: 'Master Angkutan',
                keterangan: `Angkutan ${id.nama_angkutan} telah dihapus`
            });
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static getByIdAngkutan = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params.id_kendaraan;
        try {
            const kendaraan = await getRepository(t_kendaraan).findOne({id_kendaraan:data});
            const angkutan = await getRepository(t_angkutan).findOne({kode_angkutan:kendaraan.kode_angkutan});
            res.send({"code":200,"data":angkutan});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
}

export default KendaraanController;