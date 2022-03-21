import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Router, Response, Request, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";
import { t_akun } from "../entity/User";
// import e = require('express');

class AuthController{

    static getAllUser = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const users = await getRepository(t_akun).find()
            res.send({"code":200,"data":users});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static postUser = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            const createUser = await getRepository(t_akun).create({
                name: data.name,
                username: data.username,
                password: hashedPassword,
                email: data.email,
                active: true,
                jabatan: data.jabatan,
                roles: data.roles
            });
            await getRepository(t_akun).save(createUser);
            res.send({"code":200,"data":{"status":true,"msg":"Success!"}});
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}});
        }
    }

    static getByEmail = async (req:Request, res:Response, next:NextFunction) => {
        const email = req.params.email;
        try {
            const user = await getRepository(t_akun).findOne({email:email});
            res.send({"code":200,"data":user});
        } catch (e) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static updateUser = async (req:Request, res:Response, next:NextFunction) => {
        const id = req.params.id;
        const data = req.body;
        try {
            if (data.password === null) {
                await getConnection().createQueryBuilder().update(t_akun)
                .set({
                    name: data.name,
                    username: data.username,
                    roles: data.roles,
                    email: data.email,
                    jabatan: data.jabatan,
                }).where("id = :id",{id:id}).execute();
            } else {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                await getConnection().createQueryBuilder().update(t_akun)
                .set({
                    name: data.name,
                    username: data.username,
                    password: hashedPassword,
                    roles: data.roles,
                    email: data.email,
                    jabatan: data.jabatan,
                }).where("id = :id",{id:id}).execute();
            }
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }

    static authSession = async (req:Request, res:Response, next:NextFunction) => {
        const data = req.body;
        // res.send({"code":200, "data":data})
        try {
            const user = await getRepository(t_akun).findOne({username:data.username});
            if (user) {
                const isPasswordMatching = await bcrypt.compare(data.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined
                    const expiresIn = 60 * 60;
                    const secret = 'secret';
                    const dataStoredInToken = {id:user.id}
                    const token = jwt.sign(dataStoredInToken,secret,{expiresIn})
                    res.setHeader('Cookie', `token=${token}; HttpOnly; Max-Age=${expiresIn}`)
                    res.send({"code":200, "data":{"accessToken":token, "user":user}})
                }else{
                    res.send({"code":505,"data":{"message":"Password Anda Salah"}});
                }
            } else {
                res.send({"code":506,"data":{"message":"Username tidak ditemukan"}});
            }
        } catch (e) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed!"}})
        }
    }

    static getWhereUser = async (req:Request, res:Response) => {
        const search = req.params.search;
        try {
            const result = await getRepository(t_akun)
                    .createQueryBuilder("user")
                    .where("user.name like :name", { name:`%${search}%`})
                    .orWhere("user.email like :email", { email:`%${search}%`})
                    .orWhere("user.jabatan like :jabatan", { jabatan:`%${search}%`})
                    .orWhere("user.roles like :role", { role:`%${search}%`})
                    .getMany();
            res.send({"code":200,"data":result})
        } catch (err) {
            res.send({"code":401,"data":{"msg":"Data tidak ada!"}});
        }
    }

    static deleteUser = async (req:Request, res:Response) => {
        const id = req.params.id;
        try {
            const result = await getRepository(t_akun).delete(id);
            res.send({"code":200,"data":{"status":true,"msg":"Success.!"}});
        } catch (err) {
            res.send({"code":401,"data":{"status":false,"msg":"Failed. !"}});
        }
    }
}

export default AuthController;