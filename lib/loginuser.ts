import { Request, Response, Router } from "express";

import * as mongoClient from "mongodb";

import * as cryptoClient from "crypto";

export class Loginuser {
	
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

	//Login API
    	this.router.post('/', (req: Request, res: Response) => {
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
                    console.log("User session inserted!!!");
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

  	}
}