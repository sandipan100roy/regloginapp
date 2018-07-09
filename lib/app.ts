import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";

import * as mongoClient from "mongodb";


import { Getusers } from './getusers';
import { Registeruser } from './registeruser';
import { Loginuser } from './loginuser';

const getusers = new Getusers();
const registeruser = new Registeruser();
const loginuser = new Loginuser();

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

    // Initialize MongoDB Connection Once
    var url = "mongodb://localhost:27017/userdetails";
    var dbo;
    mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            dbo = db.db("userdetails");
      });

    
    //Logout API
    router.post('/logout', (req: Request, res: Response ) => {
        var deletequery = { userid: req.body.email };
        dbo.collection("usersessiondetails").deleteOne(deletequery, function(err, result){
          if (err) throw err;
          console.log("Session deleted");
          res.send("Response Code - "+result);
        });
    });

    this.app.use('/', router);
    this.app.use('/getalluser', getusers.router);
    this.app.use('/registeruser', registeruser.router);
    this.app.use('/loginuser', loginuser.router);
    //module.exports = router;

  }

}

export default new App().app;
