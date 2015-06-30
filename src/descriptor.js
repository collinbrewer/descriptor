/**
* Descriptor.js
* An extensible interface for describing and working with things, particularly datasets.
*/

(function(){

   // Utility Methods
   var isArray=Array.isArray || function (obj){
      return obj.push && typeof obj.length === 'number';
   };

   var registered={};
   var compiled={};

   function Descriptor(i){}

   /**
    * Compiles and returns a function that when given an array, will return a subset
    * of the array whose components meet the requirements of the request
    * @param {Object} directives
    */
    Descriptor.compile=function(directives, type){

      return function(directives, type, doc){

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
         var docIsArray=isArray(doc);
         var value;
         var passes;

         result=(docIsArray ? [] : {});

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
                  docIsArray ? (result.push(value)) : (result[key]=value);
               }
            }
         }

         // filter arrays
         if(docIsArray)
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

      }.bind(null, directives, type);
   };

   Descriptor.register=function(type, directive, handler){

      registered[directive]={
         "type": type,
         "directive": directive,
         "handler": handler
      };
   };

   // expose
   (function(mod, name){
      (typeof(module)!=="undefined" ? (module.exports=mod) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return mod; }) : (window[name]=mod)));
   })(Descriptor, "Descriptor");

   return Descriptor;

})();
