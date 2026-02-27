import { Request, Response } from "express";


export class AuthController {

    // DI
    constructor(){}
    register = (req: Request, res: Response) => {
        const { email, password } = req.body;



        res.json( "register user")

    }


    login = (req: Request, res: Response) => {
        const { email, password } = req.body;



        res.json( "login user")

    }
    

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;
        const { email, password } = req.body;



        res.json( "validate Email")

    }
}