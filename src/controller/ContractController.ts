import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { t_contract } from "../entity/Contract";
import { t_barang } from "../entity/Barang";
import { randomBytes } from 'crypto';
import { v_contract } from "../entity/VContract";

class ContractController{

    static getAllContract = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const contract = await getRepository(v_contract).find()
            res.send({"code":200,"data":contract});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postContract = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const id_contract = randomBytes(16).toString('hex');
        try {
            const createContract = await getRepository(t_contract).create({
                id_contract: id_contract,
                contract_no: data.contract_no,
                kode_barang: data.kode_barang,
                pengirim: data.pengirim,
                penerima: data.penerima,
                no_aju: data.no_aju,
                contract_date: data.contract_date,
                note: data.note,
                order_quantity: data.order_quantity
            });
            await getRepository(t_contract).save(createContract);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    static getIdContract = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.params.id_contract
        try {
            const contract = await getRepository(t_contract).findOne({id_contract:id});
            const barang = await getRepository(t_barang).findOne({kode_barang:contract.kode_barang});
            const data = {
                'id_contract':contract.id_contract,
                'no_contract':contract.contract_no,
                'from_to':contract.from_to,
                'kode_barang':contract.kode_barang,
                'nama_barang':barang.nama_barang,
                'no_aju':contract.no_aju,
                'note':contract.note,
                'order_quantity':contract.order_quantity
            }
            res.send({"code":200,"data":data});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
}

export default ContractController;