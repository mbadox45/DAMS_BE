import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository, getManager } from "typeorm";
import config from "../config/config";

import { checkJwt } from '../middlewares/checkJwt';

// Entity Model
import { t_agen } from "../entity/Agen";

// Controller Interface
import IController from '../config/interface';

class AgenController implements IController{
    public router = Router();

    public path = '/v1/api/agen';

    constructor(){
        this.routerMethod();
    }

    private routerMethod(){
        this.router
        .get(`${this.path}/all`, [checkJwt], this.getAllAgen)
        .post(`${this.path}/all`, this.postAgen)
    }

    private getAllAgen = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_agen).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private postAgen = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        const agen = await getRepository(t_agen).count();
        try {
            
            const data = {
                nama_agen: post.nama,
                notelp: post.notelp,
                alamat: post.alamat
            }
            const users = await getRepository(t_agen).find()
            // console.log(id);
            res.send({"code":200,"data":users,"count":agen});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }
}

export default AgenController;