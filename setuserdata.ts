import { Request, Response, Router } from 'express';
import * as mongoClient from 'mongodb';

export class Setuserdata{

	public router:Router;

	constructor(){
		this.router = Router();
		this.routes();
	}

	public routes(): void {

		// Initialize MongoDB Connection Once
	    var url = "mongodb://localhost:27017/userdetails";
	    var dbo;
	    mongoClient.connect(url, function(err, db){
	    	if(err) throw err;
	    	dbo = db.db('userdetails');
	    });

	    //Send Mail Api
	    this.router.post("/sendmail",(req:Request,res:Response) =>{
	    	const reqobj = req.body.requestBodyArray;
	    	dbo.collection("usermessages").insert(reqobj, function(err, result){
	    				if (err) throw err;
                        console.log("1 document inserted!!!");
                        var message ={
                            responsecode : result
                        }
                        res.send(message);
	    	});
	    });

	    //Save User Profile Pic
	    this.router.post("/profilepic",(req:Request,res:Response) =>{
	    	const reqobj = req.body.requestBodyArray;
	    	var query = {email:req.body.email};
	    	var base64data = req.body.requestBase64data;
	    	dbo.collection("userdetails").update(query,{$set:{'picbase64':base64data}}, function(err, result){
	    				if (err) throw err;
                        console.log("1 document inserted!!!");
                        var message ={
                            responsecode : result
                        }
                        res.send(message);
	    	});
	    });
	}
}