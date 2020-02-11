import { Request, Response, Router } from "express";

import * as mongoClient from "mongodb";

export class Connection {

	public router: Router;
	public dbo;

	  constructor() {
	    this.router = Router();
	    this.dbo = this.routes();
	  }

	public routes(): void {

	// Initialize MongoDB Connection Once
	    var url = "mongodb://localhost:27017/userdetails";
	    var dbo1;
	    mongoClient.connect(url, function(err, db) {
	            if (err) throw err;
	            dbo1 = db.db("userdetails");
	      });
	}


}

exports.data = Connection;