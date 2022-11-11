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
        .get(`${this.path}/all/:id`, [checkJwt], this.getByIDAgen)
        .post(`${this.path}/all`, [checkJwt], this.postAgen)
        .post(`${this.path}/update`, [checkJwt], this.updateAgen)
        .post(`${this.path}/delete`, [checkJwt], this.deleteAgen)
    }

    private getAllAgen = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_agen).find();
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private getByIDAgen = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_agen).findOne({id_agen:req.params.id});
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    private postAgen = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        const agen = await getRepository(t_agen).count();
        var id;
        if (agen > 0 && agen < 10) {
            id = 'AG0000'+agen.toString();
        } else if (agen > 99 && agen < 100) {
            id = 'AG000'+agen.toString();
        } else if (agen > 999 && agen < 1000) {
            id = 'AG00'+agen.toString();
        } else if (agen > 9999 && agen < 10000){
            id = 'AG0'+agen.toString();
        } else {
            id = 'AG'+agen.toString();
        }
        try {
            const data = {
                id_agen: id,
                nama_agen: post.name,
                notelp: post.notelp,
                alamat: post.alamat,
                potongan: post.potongan,
                potongan_tambahan: post.potongan_tambahan,
            }
            const users = await getRepository(t_agen).create(data);
            await getRepository(t_agen).save(users);
            // console.log(id);
            res.send({"code":200,"msg":"Success","status":true, "test":users, "dev":id});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }

    private updateAgen = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        const agen = await getRepository(t_agen).count();

        const barang = await getConnection().createQueryBuilder().update(t_agen).set({
            alamat: post.alamat,
            nama_agen:post.name,
            notelp: post.notelp,
            potongan: post.potongan,
            potongan_tambahan: post.potongan_tambahan
        }).where("id_agen = :id",{id:post.id}).execute();

        var id;
        if (agen > 0 && agen < 10) {
            id = 'AG0000'+agen.toString();
        } else if (agen > 99 && agen < 100) {
            id = 'AG000'+agen.toString();
        } else if (agen > 999 && agen < 1000) {
            id = 'AG00'+agen.toString();
        } else if (agen > 9999 && agen < 10000){
            id = 'AG0'+agen.toString();
        } else {
            id = 'AG'+agen.toString();
        }
        try {
            const data = {
                id_agen: id,
                nama_agen: post.nama,
                notelp: post.notelp,
                alamat: post.alamat,
                potongan: post.potongan,
                potongan_tambahan: post.potongan_tambahan,
            }
            const users = await getRepository(t_agen).create(data)
            // console.log(id);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
    private deleteAgen = async (req:Request, res:Response, next:NextFunction) => {
        const post = req.body;
        try {
            const result = await getRepository(t_agen).delete({id_agen:post.id});
            // console.log(id);
            res.send({"code":200,"msg":"Success","status":true});
        } catch (e) {
            res.send({"code":401,"msg":"Failed","status":false});
        }
    }
}

export default AgenController;