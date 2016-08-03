/**
* Descriptor.js
* An extensible interface for describing and working with things, particularly datasets.
*/

// Utility Methods
var isArray=require("isarray");

var registered={};
var cached={};

function evaluate(directives, type, doc, options){

   options || (options={});

   var result;
   var directive;
   var directiveName;
   var directiveValue;

   // get the directives that are actually registered
   var validDirectives={};

   for(var key in directives)
   {
      if(registered.hasOwnProperty(key))
      {
         validDirectives[key]=directives[key];
      }
   }

   // TODO: need a better way to handle the proper order... sort of hardcoded at the moment and it's bad.
   if(type)
   {
      for(directiveName in validDirectives)
      {
         directive=registered[directiveName];

         if(directive.type===type)
         {
            directiveValue=directives[directiveName];

            doc=directive.handler(doc, directiveValue);
         }
      }
   }

   // run the comparators on each node
   var resultType=("resultType" in options ? (options.resultType) : "auto");
   var resultTypeIsArray=(resultType==="auto" ? isArray(doc) : (resultType==="array"));
   var value;
   var passes;

   result=(resultTypeIsArray ? [] : {});

   for(var key in doc)
   {
      if(doc.hasOwnProperty(key))
      {
         value=doc[key];
         passes=true;

         for(directiveName in validDirectives)
         {
            directive=registered[directiveName];
            directiveValue=directives[directiveName];

            if(directive.type==="comparator")
            {
               passes&=directive.handler(value, directiveValue);
            }

            if(!passes)
            {
               break;
            }
         }

         if(passes)
         {
            resultTypeIsArray ? (result.push(value)) : (result[key]=value);
         }
      }
   }

   // filter arrays
   if(resultTypeIsArray)
   {
      for(directiveName in validDirectives)
      {
         directive=registered[directiveName];
         directiveValue=directives[directiveName];

         if(directive.type==="array")
         {
            result=directive.handler(result, directiveValue);
         }
      }
   }

   return result;
}

function Descriptor(directives, type, options) {

   this.directives=directives;
   this.type=type;
}

Descriptor.prototype.evaluate = function(doc, options) {
   return evaluate(this.directives, this.type, doc, options || this.options);
};

Descriptor.prototype.getDirectives = function () {
   return this.directives;
};

Descriptor.prototype.getType = function () {
   return this.type;
};

Descriptor.prototype.stringify = function () {
   return JSON.stringify(this.directives);
};

/**
 * Creates a serializable string version of the descriptor
 */
Descriptor.stringify = function(d) {
   return ((d instanceof Descriptor) ? d.stringify : JSON.stringify(d));
};

/**
 * Creates a descriptor from a string
 */
Descriptor.parse = function(s) {
   let directives = JSON.parse(s);
   return new Descriptor(directives);
};

/**
 * Compiles and returns a function that when given an array, will return a subset
 * of the array whose components meet the requirements of the request
 * @param {Object} directives
 */
 Descriptor.compile=function(directives, type){

   let descriptorKey = Descriptor.stringify(directives);
   let descriptor = cached[descriptorKey];

   if(!descriptor) {
      descriptor = (cached[descriptorKey] = new Descriptor(directives, type));
   }

   return descriptor.evaluate.bind(descriptor);
};

Descriptor.register=function(type, directive, handler){

   registered[directive]={
      "type": type,
      "directive": directive,
      "handler": handler
   };
};

// expose
module.exports = Descriptor;
