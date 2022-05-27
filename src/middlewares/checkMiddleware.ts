import { Response, Request, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkMiddle = (req: Request, res: Response, next: NextFunction) : any => {
    if (!req.headers.authorization) {
        return res.send({"code":401,"msg":"Unauthorization"});
    }
    // console.log(req.headers.authorization)
    let secretKey = config.jwtSecret;
    const token : string = req.headers.authorization.split(" ")[1];
    console.log(token);

    try {
        const credential : string | object = jwt.verify(token, secretKey);
        if (credential) {
            res.locals.credential = credential;
            next();
        }
        return res.send({"code":400,"msg":"Token Invalid"});
    } catch (err) {
        return res.send({"code":402,"msg":err});
    }
}