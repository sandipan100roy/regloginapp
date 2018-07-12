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

 

    describe('### GET /getalluser',function(){

 

        it('should all the users or desired user',function(done){

         

         mongoClient.connect(url, function(err, db) {

                if (err) throw err;

                dbo = db.db("userdetails");

                var query={};        

                dbo.collection("userdetails").find(query).toArray(function(err, response) {

                if (err) throw err;                               

                expect(200);

                done();

            });

        });   

        });

    });   

        

});