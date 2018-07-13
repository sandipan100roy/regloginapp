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
    this.router.get('/', (req: Request, res: Response) => {
            var query = {};
            dbo.collection("userdetails").find(query).toArray(function(err, result) {
                if (err) throw err;
                 res.send(result);
            });
    });

  }

}

