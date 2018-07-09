import { Request, Response, Router} from "express";
import * as mongoClient from "mongodb";

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
            var myObj = {
              name: data.name,
              email: data.email,
              password: data.password,
              phone: data.phone
            };
            dbo.collection("userdetails").insertOne(myObj, function(err, result){
                if (err) throw err;
                console.log("1 document inserted!!!");
                res.send("Response Code - "+result);
            });
            
    	});

	}

}