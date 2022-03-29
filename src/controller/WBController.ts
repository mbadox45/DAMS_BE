import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { t_averyweight } from "../entity/Averyweight";
import { v_truckin } from "../entity/TruckIn";
import { t_jenis } from "../entity/Log";
import { v_counttikets } from "../entity/CountWB";
import { t_kendaraan } from "../entity/Kendaraan";
import { t_angkutan } from "../entity/Angkutan";
import { t_barang } from "../entity/Barang";
import { v_tiketmax } from "../entity/VMaxTicket";
import { t_contract } from "../entity/Contract";
import { t_truksecurity } from "../entity/TruckSecurity";
import { v_reportsecurity } from "../entity/VReportAdmin";

class WBController{

    static getAllByStatusTruck = async (req:Request, res:Response, next:NextFunction) => {
        
        try {
            const truck = await getRepository(v_truckin).createQueryBuilder()
            .where("status_truck IS NOT NULL")
            .andWhere("status_truck != :id1 AND status_truck != :id2",{id1:4, id2:2})
            .orderBy("no_tiket", "DESC")
            .getMany();
            res.send({"code":200,"data":truck});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    
    static getAllTruck = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const truck = await getRepository(v_truckin).createQueryBuilder().where("user_delete IS NULL").orderBy("no_tiket", "DESC").getMany();
            res.send({"code":200,"data":truck});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
    
    static getLoadByNotiket = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.params.id;
        try {
            const truck = await getRepository(t_averyweight).findOne({no_tiket:id});
            const kendaraan = await getRepository(t_kendaraan).findOne({id_kendaraan:truck.id_kendaraan});
            const contract = await getRepository(t_contract).findOne({id_contract:truck.id_contract});
            const angkutan = await getRepository(t_angkutan).findOne({kode_angkutan:truck.kode_angkutan});
            const barang = await getRepository(t_barang).findOne({kode_barang:truck.kode_barang});
            const data = {
                no_tiket: truck.no_tiket,
                id_contract: truck.id_contract,
                contract_no: contract.contract_no,
                pengirim: contract.pengirim,
                penerima: contract.penerima,
                id_kendaraan: truck.id_kendaraan,
                no_kendaraan: kendaraan.no_kendaraan,
                kode_barang: truck.kode_barang,
                nama_barang: barang.nama_barang,
                kode_angkutan: truck.kode_angkutan,
                nama_angkutan: angkutan.nama_angkutan,
                from_to: truck.from_to,
                quantity: truck.quantity,
                delivery_note: truck.delivery_note,
                nama_supir: truck.nama_supir,
                delivery_order: truck.delivery_order,
                no_aju: truck.no_aju,
                no_container: truck.no_container,
                asal_pks: truck.asal_pks,
                bruto_from: truck.bruto_from,
                netto_from: truck.netto_from,
                tarra_from: truck.tarra_from,
                timbang_1: truck.timbang_1,
                timbang_2: truck.timbang_2,
                timbang_selisih: truck.timbang_selisih,
                tarra_kendaraan: truck.tarra_kendaraan,
                tarra_sekarang: truck.tarra_sekarang,
                tarra_rendah: truck.tarra_rendah,
                tarra_tinggi: truck.tarra_tinggi,
                operator: truck.user_id,
                waktu_timbang_1: truck.tgl_masuk+'  '+truck.waktu_masuk,
                waktu_timbang_2: truck.tgl_keluar+'  '+truck.waktu_keluar,
            };
            // truck.nama_angkutan = angkutan.nama_angkutan;
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static updateTruckIn = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const date = new Date();
        const tgl = date.getDate();
        const b = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        const bln = b[date.getMonth()];
        const thn = date.getFullYear();
        const jam = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const waktu = tgl+'/'+bln+'/'+thn+' '+jam+':'+min+':'+sec;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: data.no_tiket,
                user_id: data.user_id,
                status: 'Tiket Update',
                keterangan: `Tiket di update oleh ${data.user_id}`,
            });

            await getConnection().createQueryBuilder().update(t_averyweight)
            .set({
                id_kendaraan: data.id_kendaraan,
                kode_barang: data.kode_barang,
                nama_supir: data.nama_supir.toUpperCase(),
                from_to: data.from_to,
                quantity: data.quantity,
                id_contract: data.id_contract,
                delivery_note: data.delivery_note,
                delivery_order: data.delivery_order,
                kode_angkutan: data.kode_angkutan,
                no_aju: data.no_aju,
                asal_pks: data.asal_pks,
                bruto_from: data.bruto_from,
                tarra_from: data.tarra_from,
                netto_from: data.netto_from,
                status_truck: 3,
                status: '0',
                waktu_edit: waktu, 
                user_edit: data.user_id
            }).where("no_tiket = :no_tiket",{no_tiket:data.no_tiket}).execute();
            
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static postTimbangan = async(req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const tahun = new Date().getFullYear();
        const thn = tahun.toString().slice(2,4);
        const bulan =  new Date().getMonth()+1;
        var bln;
        if (bulan >=10) {
            bln = bulan.toString();
        } else {
            bln = "0"+bulan.toString();
        }
        var value;
        const count = await getRepository(v_tiketmax).findOne();
        const c_thn = count.ticket_max.slice(0,2);
        const c_bln = count.ticket_max.slice(2,4);
        var no_tiket;
        if (c_thn == thn) {
            if (c_bln == bln) {
                no_tiket = (Number(count.ticket_max)+1).toString();
            } else {
                no_tiket = thn+bln+'0001';
            }
        } else {
            no_tiket = thn+bln+'0001';
        }

        const datatimbangan = {
            no_tiket: no_tiket,
            id_kendaraan: data.id_kendaraan,
            kode_barang: data.kode_barang,
            nama_supir: data.nama_supir,
            from_to: data.from_to,
            quantity: data.quantity,
            id_contract: data.id_contract,
            delivery_note: data.delivery_note,
            delivery_order: data.delivery_order,
            kode_angkutan: data.kode_angkutan,
            no_aju: data.no_aju,
            asal_pks: data.asal_pks,
            bruto_from: data.bruto_from,
            tarra_from: data.tarra_from,
            netto_from: data.netto_from,
            status_truck: 1,
            status: '0',
            created_at: new Date(),
            user_id:'-',
            timbang_1:0,
            timbang_2:0,
            timbang_selisih:0,
            tarra_rendah:0,
            tarra_tinggi:0,
            tarra_sekarang:'0',
            tgl_keluar: new Date('0001-01-01'),
            tgl_masuk: new Date('0001-01-01'),
            tgl_keluar_from: '2022-01-01 00:00:00',
            waktu_masuk: '00:00:00',
        };
        try {
            await getRepository(t_averyweight).save((await getRepository(t_averyweight).create(datatimbangan)));
            res.send({"code":200,"data":{"status":true,"msg":"Success !"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postTruck = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const no_tiket = await getRepository(t_averyweight).findOne();
        const datatruckmasuk = {
            no_tiket: no_tiket.no_tiket,
            petugas_checkin: data.user_id,
            no_urut:0,
            waktu_masuktruk: new Date()
        };
        try {
            await getRepository(t_truksecurity).save((await getRepository(t_truksecurity).create(datatruckmasuk)));
            res.send({"code":200,"data":{"status":true,"msg":"Success !"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postLog = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const no_tiket = await getRepository(t_averyweight).findOne();
        const kendaraan = await getRepository(t_kendaraan).findOne({id_kendaraan:data.id_kendaraan});
        const datalog = {
            no_tiket: no_tiket.no_tiket,
            user_id: data.user_id,
            created_at: new Date(),
            status: 'Truck Masuk',
            keterangan: `Truck masuk ${kendaraan.no_kendaraan} di input oleh ${data.user_id}`,
        }
        try {
            await getRepository(t_jenis).save((await getRepository(t_jenis).create(datalog)));
            res.send({"code":200,"data":{"status":true,"msg":"Success !"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postTruckIn = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const tahun = new Date().getFullYear();
        const thn = tahun.toString().slice(2,4);
        const bulan =  new Date().getMonth()+1;
        var bln;
        if (bulan >=10) {
            bln = bulan.toString();
        } else {
            bln = "0"+bulan.toString();
        }
        var value;
        const count = await getRepository(v_tiketmax).findOne();
        const c_thn = count.ticket_max.slice(0,2);
        const c_bln = count.ticket_max.slice(2,4);
        var no_tiket;
        if (c_thn == thn) {
            if (c_bln == bln) {
                no_tiket = (Number(count.ticket_max)+1).toString();
            } else {
                no_tiket = thn+bln+'0001';
            }
        } else {
            no_tiket = thn+bln+'0001';
        }
        const datatruckmasuk = {
            no_tiket: no_tiket,
            petugas_checkin: data.user_id,
            no_urut:0,
            waktu_masuktruk: new Date()
        };

        const datatimbangan = {
            no_tiket: no_tiket,
            id_kendaraan: data.id_kendaraan,
            kode_barang: data.kode_barang,
            nama_supir: data.nama_supir,
            from_to: data.from_to,
            quantity: data.quantity,
            id_contract: data.id_contract,
            delivery_note: data.delivery_note,
            delivery_order: data.delivery_order,
            kode_angkutan: data.kode_angkutan,
            no_aju: data.no_aju,
            asal_pks: data.asal_pks,
            bruto_from: data.bruto_from,
            tarra_from: data.tarra_from,
            netto_from: data.netto_from,
            status_truck: 1,
            status: '0',
            created_at: new Date(),
            user_id:'-',
            timbang_1:0,
            timbang_2:0,
            timbang_selisih:0,
            tarra_rendah:0,
            tarra_tinggi:0,
            tarra_sekarang:'0',
            tgl_keluar: new Date('0001-01-01'),
            tgl_masuk: new Date('0001-01-01'),
            tgl_keluar_from: '2022-01-01 00:00:00',
            waktu_masuk: '00:00:00',
        };

        const kendaraan = await getRepository(t_kendaraan).findOne({id_kendaraan:data.id_kendaraan});
        const datalog = {
            no_tiket: no_tiket,
            user_id: data.user_id,
            created_at: new Date(),
            status: 'Truck Masuk',
            keterangan: `Truck masuk ${kendaraan.no_kendaraan} di input oleh ${data.user_id}`,
        }

        try {
            await getRepository(t_jenis).save((await getRepository(t_jenis).create(datalog)));
            await getRepository(t_averyweight).save((await getRepository(t_averyweight).create(datatimbangan)));
            await getRepository(t_truksecurity).save((await getRepository(t_truksecurity).create(datatruckmasuk)));

            // await getConnection().createQueryBuilder().insert().into(t_truksecurity).values(datatruckmasuk).execute();
            // await getConnection().createQueryBuilder().insert().into(t_averyweight).values(datatimbangan).execute();
            // await getConnection().createQueryBuilder().insert().into(t_jenis).values(datalog).execute();
            res.send({"code":200,"data":{"status":true,"msg":"Success !"}});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static rejectTicket = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const date = new Date();
        const tgl = date.getDate();
        const b = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        const bln = b[date.getMonth()];
        const thn = date.getFullYear();
        const jam = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const waktu = tgl+'/'+bln+'/'+thn+' '+jam+':'+min+':'+sec;
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: data.no_tiket,
                user_id: data.user_id,
                status: 'Tiket Reject',
                keterangan: `Tiket di reject oleh ${data.user_id}, alasan: ${data.keterangan}`,
            });

            await getConnection().createQueryBuilder().update(t_averyweight)
            .set({
                status_truck: 4,
                status: '1',
                waktu_delete: waktu, 
                user_delete: data.user_id
            }).where("no_tiket = :no_tiket",{no_tiket:data.no_tiket}).execute();
            
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success. !"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static checkOutTruck = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const date = new Date();
        
        const timbangan = await getRepository(t_averyweight).findOne({no_tiket:data.no_tiket});
        var selisih_netto, netto_from;
        selisih_netto = Number(timbangan.selisih_netto);
        netto_from = Number(timbangan.netto_from);
        if (netto_from == null) {
            netto_from = '0';
        } else {
            netto_from = netto_from;
        }
        const selisih_persen = (selisih_netto/netto_from*100).toString().slice(0,7);
        
        try {
            const logs = await getRepository(t_jenis).create({
                no_tiket: data.no_tiket,
                user_id: data.user_id,
                created_at: date,
                status: 'Truck Keluar',
                keterangan: `Truck ${data.no_kendaraan} telah selesai timbang, check out by ${data.user_id}!`,
            });

            await getConnection().createQueryBuilder().update(t_truksecurity).set({
                waktu_keluartruk: new Date(),
                no_locis:data.no_locis,
                petugas_checkout: data.user_id
            }).where("no_tiket = :no_tiket",{no_tiket:data.no_tiket}).execute();
            
            await getConnection().createQueryBuilder().update(t_averyweight)
            .set({
                selisih_netto_persen: selisih_persen,
                status_truck: 2
            }).where("no_tiket = :no_tiket",{no_tiket:data.no_tiket}).execute();
            
            await getRepository(t_jenis).save(logs);
            res.send({"code":200,"data":{"status":true,"msg":"Success. !"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static exportData = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        try {
            const exp = await getRepository(v_reportsecurity).createQueryBuilder()
            .where("DATE(waktu_keluartruk) >= :start",{start:data.start})
            .andWhere("DATE(waktu_keluartruk) <= :end",{end:data.end})
            .getMany();
            res.send({"code":200,"data":exp});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

} export default WBController;