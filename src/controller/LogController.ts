import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { t_jenis } from "../entity/Log";

class LogController{
    static getLog = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params.no_tiket;
        try {
            const logs = await getRepository(t_jenis).find({no_tiket:data});
            res.send({"code":200,"data":logs});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static getLogByName = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.params.user_id;
        try {
            const logs = await getRepository(t_jenis).find({user_id:data});
            res.send({"code":200,"data":logs});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
} export default LogController;