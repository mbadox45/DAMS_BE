import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.send({"code":401,"msg":"Unauthorization"});
    }
  
    //Get the jwt token from the head
    const token = <string>req.headers.authorization.split(" ")[1];
    let jwtPayload;
    console.log(token);
  
    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        // console.log(jwtPayload);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        return res.send({"code":402,"msg":"Error"});
    }
  
    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("authorization", newToken);
    // console.log(newToken)
  
    //Call the next middleware or controller
    next();
};