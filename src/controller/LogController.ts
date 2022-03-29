import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { tsXLXS } from 'ts-xlsx-export';
import { t_jenis } from "../entity/Log";

class LogController{
    static getLog = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params.no_tiket;
        try {
            const logs = await getRepository(t_jenis).createQueryBuilder()
            .where("no_tiket = :no",{no:data})
            .orderBy("created_at","DESC")
            .getMany();
            res.send({"code":200,"data":logs});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static getLogByName = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params.user_id;
        try {
            const logs = await getRepository(t_jenis).find({user_id:data});
            // tsXLXS().exportAsExcelFile(logs).saveAsExcelFile('fileName');
            res.send({"code":200,"data":logs});
            // res.json(logs);
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static exportData = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params;
        var load: any = [];
        const list = [];
        const logs = await getRepository(t_jenis).find({user_id:'user'});
        for (let i = 0; i < logs.length; i++) {
            list[i] = {
                status : logs[i].user_id,
                keterangan: logs[i].keterangan
            };
        }
        load = list;
        try {
            res.send({"code":200,"tgl_start": data.start,"tgl_end": data.end, "data":load});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak dapat di export!"}});
        }
    }

} export default LogController;