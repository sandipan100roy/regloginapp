import { Request, Response, Router } from "express";

import * as mongoClient from "mongodb";

export class Logoutuser {

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


	    //Logout API
	    this.router.post('/', (req: Request, res: Response ) => {
	        var deletequery = { sessionid: req.body.sessionid };
	        dbo.collection("usersessiondetails").deleteOne(deletequery, function(err, result){
	          if (err) throw err;
	          var logoutRes ={
	          		code:result,
	          		msg:'User logged out!!!'
	          }
	          res.send(logoutRes);
	        });
	    });

	}


}