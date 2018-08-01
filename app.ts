import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { Getusers } from './routes/getusers';
import { Registeruser } from './routes/registeruser';
import { Loginuser } from './routes/loginuser';
import { Logoutuser } from './routes/logoutuser';

const getusers = new Getusers();
const registeruser = new Registeruser();
const loginuser = new Loginuser();
const logoutuser = new Logoutuser();

class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  public routes(): void {
    const router = express.Router();
    this.app.use(cors())

    //this.app.use('/', router);
    this.app.use('/getalluser', this.getsession, getusers.router);
    this.app.use('/registeruser', registeruser.router);
    this.app.use('/loginuser', this.getsession, loginuser.router);
    this.app.use('/logout', this.getsession, logoutuser.router);
  }

  public getsession(req, res, next){
    console.log("From getsession function getalluser");
    next();
  }

}

export default new App().app;
