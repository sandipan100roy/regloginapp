import { Request, Response, Router } from "express";

import * as mongoClient from "mongodb";

export class Getusers {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }


  public routes(): void {
    
    // Initialize MongoDB Connection Once
    var url = "mongodb://localhost:27017/userdetails";
    var dbo;
    mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            dbo = db.db("userdetails");
      });

    //Get All Users API
    this.router.post('/getuserprofiledata', (req: Request, res: Response) => {
            var query = { email: req.body.email };
            dbo.collection("userdetails").find(query).toArray(function(err, result) {
                if (err) throw err;
                else{
                 result[0].success = true;
                 res.send(result);
                }
            });
    });

    //Get Messages API
    this.router.post('/getmessages', (req: Request, res: Response) => {
            var query = [{ to_email: req.body.email},{from_email: req.body.email }];
            dbo.collection("usermessages").find({$or:query}).toArray(function(err, result) {
                if (err) throw err;
                else{
                 res.send(result);
                }
            });
    });

  }

}

