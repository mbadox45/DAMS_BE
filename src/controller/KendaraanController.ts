import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import config from "../config/config";

import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_agen } from "../entity/Agen";
import { t_kendaraan } from "../entity/Kendaraan";

// Controller Interface
import IController from '../config/interface';

class KendaraanController implements IController{
    public router = Router();

    public path = '/v1/api/kendaraan';

    constructor(){
        this.routerMethod();
    }

    private routerMethod(){
        this.router
        .get(`${this.path}/all`, [checkJwt], this.getAllKendaraan)
        .post(`${this.path}/all`, this.postKendaraan)
        .post(`${this.path}/delete`, this.deleteKendaraan)
    }

    private getAllKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_kendaraan).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private postKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            const data = {
                no_kendaraan: post.no_kendaraan,
            }
            const users = await getRepository(t_kendaraan).create(data);
            await getRepository(t_kendaraan).save(users);
            // console.log(id);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    private deleteKendaraan = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            const data = {
                no_kendaraan: post.no_kendaraan,
            }
            const result = await getRepository(t_kendaraan).delete({no_kendaraan:post.no_kendaraan});
            // console.log(id);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
}

export default KendaraanController;