import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";

import * as mongoClient from "mongodb";

import * as cryptoClient from "crypto";

//import getusers from "./getusers";

import { Getusers } from './getusers';
const getusers = new Getusers();

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


    //Get All Users API
    /*router.get('/', (req: Request, res: Response) => {
            var query = {};
            dbo.collection("userdetails").find(query).toArray(function(err, result) {
                if (err) throw err;
                 res.send(result);
            });
    });*/

    //Login API
    router.post('/loginuser', (req: Request, res: Response) => {
            var query = { email: req.body.email, password: req.body.password};
            var sha,generatedsession;
            dbo.collection("userdetails").find(query).project({email: 1}).toArray(function(err,result) {
                if (err) throw err;
                if(result && result.length==1){
                  
                  //Create Session Id.
                  sha = cryptoClient.createHash('sha256');
                  sha.update(Math.random().toString());
                  generatedsession=sha.digest('hex');

                  //Store session in DB
                  var sessionObj = {
                    userid: result[0].email,
                    sessionid: generatedsession
                  }
                  dbo.collection('usersessiondetails').insertOne(sessionObj, function(){
                    if (err) throw err;
                    console.log("User session inserted");
                  });


                  //Add Session Id To Response.
                  result[0].sessionid = generatedsession;
                  res.json(result)
               }
                else{
                  res.send("User Doesn't Exists");
                }
            });
    });

    //Register API
    router.post('/registeruser', (req: Request, res: Response) => {
            const data = req.body;
            var myObj = {
              name: data.name,
              email: data.email,
              password: data.password,
              phone: data.phone
            };
            dbo.collection("userdetails").insertOne(myObj, function(err, result){
                if (err) throw err;
                console.log("1 document inserted");
                res.send("Response Code - "+result);
            });
            
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
    //module.exports = router;

  }

}

export default new App().app;
