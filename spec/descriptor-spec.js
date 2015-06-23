var should=require("chai").should();
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

   context("#evaluate", function(){

      it("should evaulate a document against registered directive", function(){

         Descriptor.register("comparator", "valueOfComplete", function(doc, value){

            return doc.hasOwnProperty("complete") && doc.complete===value;
         });

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
      });
   });
});
