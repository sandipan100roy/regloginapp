import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";

import * as mongoClient from "mongodb";

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

  private routes(): void {
    const router = express.Router();

    // Initialize connection once
    var url = "mongodb://localhost:27017/userdetails";
    var dbo;
    mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            dbo = db.db("userdetails");
      });



    router.get('/', (req: Request, res: Response) => {
            var query = {};
            dbo.collection("userdetails").find(query).toArray(function(err, result) {
                if (err) throw err;
                 res.send(result);
            });
    });

    router.post('/', (req: Request, res: Response) => {
      //const data = req.body;
            var query = { email: req.body.email, password: req.body.password};
            dbo.collection("userdetails").find(query).toArray(function(err,result) {
                if (err) throw err;
                if(result && result.length==1)
                 res.send("User Exists");
                else
                  res.send("User Doesn't Exists");
            });
    });

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

    this.app.use('/', router)

  }

}

export default new App().app;
