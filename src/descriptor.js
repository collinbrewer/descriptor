/**
* Descriptor.js
* An extensible interface for describing and working with things, particularly datasets.
*/

(function(){

   var registered={};
   var compiled={};

   function Descriptor(i){}

   /**
    * Compiles and returns a function that when given an array, will return a subset
    * of the array whose components meet the requirements of the request
    */
    Descriptor.compile=function(params){

      // TODO: handle the proper order
      return function(params, doc){

         var result;
         var d;

         if(typeof(doc)==="object")
         {
            if(doc instanceof Array) // NOTE: "array-ish" may be better
            {
               for(var directive in params)
               {
                  if(directive in registered)
                  {
                     d=registered[directive];

                     if(d.type==="comparator")
                     {
                        result=[];
                        var v=params[directive];

                        for(var i=0, l=doc.length, s; i<l, (s=doc[i++]);)
                        {
                           if(d.handler(s, v))
                           {
                              result.push(s);
                           }
                        }
                     }
                     else
                     {
                        result=d.handler(doc, params[directive]);
                     }
                  }
               }
            }
            else
            {
               result=true;

               for(var directive in params)
               {
                  if(directive in registered)
                  {
                     d=registered[directive];

                     if(d.type!=="comparator")
                     {
                        result&=d.handler(doc, params[directive]);
                     }

                     if(!result)
                     {
                        break;
                     }
                  }
               }
            }
         }
         else
         {
            result=doc;
         }

         return result;

      }.bind(null, params);
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
