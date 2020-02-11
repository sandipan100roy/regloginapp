import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";

import { Getusers } from './routes/getusers';
import { Registeruser } from './routes/registeruser';
import { Loginuser } from './routes/loginuser';
import { Logoutuser } from './routes/logoutuser';
import { Setuserdata } from './routes/setuserdata';

const getusers = new Getusers();
const registeruser = new Registeruser();
const loginuser = new Loginuser();
const logoutuser = new Logoutuser();
const setuserdata = new Setuserdata();

class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    //this.app.use(bodyParser.json());
    //this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({limit: '10mb'}))
    this.app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
  }

  public routes(): void {
    const router = express.Router();
    this.app.use(cors())

    //this.app.use('/', router);
    this.app.use('/getalluser', this.getsession, getusers.router);
    this.app.use('/registeruser', registeruser.router);
    this.app.use('/loginuser', loginuser.router);
    this.app.use('/logout', this.getsession, logoutuser.router);

    this.app.use('/getusermessages', this.getsession, getusers.router);

    this.app.use('/setusermessages', this.getsession, setuserdata.router);
    this.app.use('/setuserprofilepic', this.getsession, setuserdata.router);
  }

  public getsession(req, res, next){
    console.log("From getsession function");
    // check header or url parameters or post parameters for token
    var token = req.body.token;

    // decode token
    if (token) {

    // verifies secret and checks exp
      jwt.verify(token, 'secret', function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });

    } else {
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });

    }
  }

}

export default new App().app;
