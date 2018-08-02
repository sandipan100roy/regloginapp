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
            var query = { email: req.body.email};
            var sha,generatedsession;

            dbo.collection("userdetails").find(query).project({name:1, email: 1, password: 1}).toArray(function(err,result) {
                if (err) throw err;

                if(result && result.length==1){

                  //Decrypt encryptedpassword Starts
                  var matched = false;
                  //var decryptedPassword = this.passwordDecrypt(result[0].password);
                  var myKey = cryptoClient.createDecipher('aes-128-cbc','mypassword');
                  var myStr = myKey.update(result[0].password, 'hex', 'utf8');
                  myStr += myKey.final('utf8');
                  //Decrypt encryptedpassword Ends

                  if(myStr == req.body.password)
                    matched = true;
                  else
                    matched = false;

                  if(matched){

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
                      result[0].code = 1;
                      res.json(result)

                  }else{
                      var message ={
                        msg : "User Doesn't Exists",
                        code:0
                      }
                      res.send(message);

                  }
                  
               }
                else{
                  var message ={
                        msg : "User Doesn't Exists",
                        code:0
                  }
                  res.send(message);
                }
            });
   		});

  	}

    /*public passwordDecrypt(encryptedpassword: any) : any{

      var myKey = cryptoClient.createDecipher('aes-128-cbc','mypassword');
      var myStr = myKey.update(encryptedpassword, 'hex', 'utf8');
      myStr += myKey.final('utf8');
      return myStr;

    }*/
}
