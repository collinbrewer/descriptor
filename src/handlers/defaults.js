var Descriptor = require('../descriptor.js');

/**
 * Descriptor that describes the order of an array
 */
Descriptor.register("array", "order", function(arr, v){

   // lastName desc, firstName desc > []
   var args=v.split(",").map(function(desc){ var kvpa=desc.trim().split(" "); return {key:kvpa[0], order:(kvpa.length===2 ? kvpa[1] : "asc")}; });

   arr.sort(function(a, b){

      var order=a[args[0].key]>b[args[0].key];

      if(args[0].order==="desc")
      {
         order!=order;
      }

      return order;
   });

   return arr;
});

/**
 * Descriptor that describes the starting index of an array
 */
Descriptor.register("array", "offset", function(arr, v){

   return arr.splice(v);
});

/**
 * Descriptor that describes the length of an array
 */
Descriptor.register("array", "limit", function(arr, v){

   return arr.splice(0, v);
});


/**
 * Descriptor that groups keys of an array
 */
Descriptor.register("array", "group", function(arr){

   console.warn("The *group* directive is not yet supported");

   return arr;
});
