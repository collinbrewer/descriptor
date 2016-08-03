var should=require("chai").should();
var expect = require('chai').expect;
var Descriptor=require("../index.js");

describe("Descriptor", function(){

   context("#register", function(){

      it("should register a new directive", function(){

         Descriptor.register("new", function(){});
      });
   });

   context("#compile", function(){

      it("should create a new function", function(){

         var descriptor={"foo":"bar"};

         var f=Descriptor.compile(descriptor);

         f.should.be.a("function");
      });
   });

   context("#stringify", function(){

      it("should return a string", function(){

         var descriptor={"foo":"bar"};

         var s=Descriptor.stringify(descriptor);

         s.should.be.a("string");
      });
   });

   context("#parse", function(){

      it("should return a descriptor", function(){

         var s='{"foo":"bar"}';
         var d=Descriptor.parse(s);

         expect(d instanceof Descriptor).to.be.true;
      });
   });

   context("#evaluate", function(){

      it("should return original document", function(){

         var doc=[3, 1, 2];
         var descriptor={"no":1, "such":2, "descriptors":3};
         var f=Descriptor.compile(descriptor);
         var results=f(doc);

         results.should.have.length(3);
      });

      it("should evaulate a document against registered directive", function(){

         Descriptor.register("comparator", "valueOfComplete", function(doc, value){

            return doc.hasOwnProperty("complete") && doc.complete===value;
         });

         // array doc
         var doc=[
            {"complete":false},
            {"date":true},
            {"complete":true},
         ];

         var descriptor={"valueOfComplete":true};

         // Descriptor.registered.valueOfComplete(doc, true);

         var f=Descriptor.compile(descriptor);

         var results=f(doc);

         results.should.have.length(1);

         // object doc
         doc={
            "first" : {"complete":false},
            "second" : {"date":true},
            "third" : {"complete":true}
         };
         results=f(doc);
         results.should.have.property("third");
         results.should.not.have.property("second");

         // object doc, with array results option
         doc={
            "first" : {"complete":false},
            "second" : {"date":true},
            "third" : {"complete":true}
         };
         results=f(doc, {resultType:"array"});
         results.should.be.an("array");
         results.should.have.length(1);
      });
   });
});
