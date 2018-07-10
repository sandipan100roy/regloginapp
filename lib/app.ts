import * as express from "express";
import * as bodyParser from "body-parser";

import { Getusers } from './getusers';
import { Registeruser } from './registeruser';
import { Loginuser } from './loginuser';
import { Logoutuser } from './logoutuser';

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

    //this.app.use('/', router);
    this.app.use('/getalluser', getusers.router);
    this.app.use('/registeruser', registeruser.router);
    this.app.use('/loginuser', loginuser.router);
    this.app.use('/logout', logoutuser.router);
  }

}

export default new App().app;
