import app from '../lib/app';

import { expect } from 'chai';

import * as mongoClient from "mongodb";

import 'mocha';

 

describe('App',function(){

    //testing connection to the URL

    var url = "mongodb://localhost:27017/userdetails";

    var dbo;

    beforeEach(function(){

        dbo ='';

    });

 

    describe('### POST /registeruser',function(){

 

       it('should create a new user',function(done){

            let user = {

                name:'Abha',

                email: "foo@bar.com",

                password: "India@123",

                phone: "2018202198"

              };

         mongoClient.connect(url, function(err, db) {

                if (err) throw err;

                dbo = db.db("userdetails");

              

         

        dbo.collection("userdetails").insertOne(user, function(err, result){

                if (err) throw err;   

                result = JSON.parse(result); 

                console.log('result is'+JSON.stringify(result));             

                

                expect(result.ok).to.equal(1);    
                done();

            });

        });   

    });
    });
});   