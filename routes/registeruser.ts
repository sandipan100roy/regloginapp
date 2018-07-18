import { Request, Response, Router} from "express";
import * as mongoClient from "mongodb";

import * as crypto from "crypto";

export class Registeruser{

	public router: Router;

	constructor(){
		this.router = Router();
		this.routes();
	}

	public routes(): void{

		// Initialize MongoDB Connection Once
	    var url = "mongodb://localhost:27017/userdetails";
	    var dbo;
	    mongoClient.connect(url, function(err, db) {
	            if (err) throw err;
	            dbo = db.db("userdetails");
	      });

	    //Register API
    	this.router.post('/', (req: Request, res: Response) => {
            const data = req.body;

            var encryptedPass = this.passwordEncrypt(data.password);
            
            var myObj = {
              name: data.name,
              email: data.email,
              password: encryptedPass,
              phone: data.phone
            };
            dbo.collection("userdetails").insertOne(myObj, function(err, result){
                if (err) throw err;
                console.log("1 document inserted!!!");
                res.send("Response Code - "+result);
            });
            
    	});

	}

	private passwordEncrypt(password : any): any{
		var myKey = crypto.createCipher('aes-128-cbc','mypassword');
		var mystr = myKey.update(password,'utf8','hex');
		mystr += myKey.final('hex');
		return mystr;
	}

}
