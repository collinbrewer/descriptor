var should=require("chai").should();
var Descriptor=require("../index.js");

global.Descriptor=Descriptor;

require("../src/handlers/defaults.js");

describe("Handlers", function(){

   var doc;

   beforeEach(function(){

      doc=[
         {"foo":"qwer", "orderKey":3, "limited":true},
         {"bar":"qwer", "orderKey":1},
         {"foo":"qwer", "orderKey":2},
      ];
   });

   context("#order", function(){

      it("should order the document by the value of orderKey", function(){

         var f=Descriptor.compile({"order":"orderKey"});

         var result=f(doc);

         result.should.have.length(3);
         result[0].orderKey.should.equal(1);
         result[1].orderKey.should.equal(2);
         result[2].orderKey.should.equal(3);

      });
   });

   context("#offset", function(){

      it("should create a new document start at index 1", function(){

         var f=Descriptor.compile({"offset":1});

         var result=f(doc);

         result.should.have.length(2);
         result[0].should.have.property("bar");
      });
   });

   context("#limit", function(){

      it("should create a new document with 1 indices", function(){

         var f=Descriptor.compile({"limit":1});

         var result=f(doc);

         result.should.have.length(1);
         result[0].should.have.property("limited");
      });
   });
});
