# Descriptor.js
Descriptor is an extensible utility for describing and working with criteria in a unified format.

Descriptor is used primarily for:
- Describing datasets with a unified format
- Test if a value matches a Descriptor
- Filter an array for values matching the parameters of the Descriptor
- Idempotent serialization that can be used as unique keys for caching datasets
- Parse and stringify into multiple formats
- Comparing descriptors granularity(which we use for optimizing caches and HTTP requests)

## What can you do with it?

### Example
```javascript
var descriptor={entityName:"Todo", predicate:"completed!=true"};

var filter=Descriptor.compile(descriptor);

var uncompletedTodos=todos.filter(filter);
```

## What is provided out of the box?
For pre-built functionality, including **default** in your project gives you:

- Exports/Imports JSON, SQL and a non-standardized queryString format
- Basic store/collection/object descriptors

### Example
Let's say you want to extend Descriptor's capability to include a parameter for logging out what's going on.

```javascript
Descriptor.register("shouldLog", function(objectInDataset, parameterValue){

   if(parameterValue===true)
   {
      console.log(objectInDataset)
   }

   return true; // the object passes the criteria for this test
});
```

## Features

1. **Unified**  
Provides a high-level, unified interface for describing queries/datasets.
2. **Portable**  
Outputs discrete, serializable strings that can be used as unique keys.
3. **Extensible**  
Has standard query features but offers hooks for teaching it new tricks.

### Unified
Use Descriptor to describe and represent any dataset.

For example, HTML elements:

```javascript
var navLinkDescriptor=new Descriptor({
   entityName:"a",
   predicate:"/href!=null"
});

var links=Descriptor.match(document.body);
```


### Serializable
Descriptor is easily serializable for portability.

```javascript
new Descriptor({entityName:"Task", sortBy:"dateCompleted"})
// becomes...
 /Task?predicate=&sortBy=dateCompleted
```

Becomes:
```javascript
{
   entityName:"Task",
   predicate: [
      {dateDue}
   ],
   sortBy:
}
```

### toQueryString()

Outputs:

    /Task?predicate={}&sortBy=dateCompleted


### Extensible

```javascript
Descriptor.addComponent("ignore", function(o){

});
```


The array extensions add the ability to filter a data structure based on the Descriptor definition.

```javascript

var criteria={
   entityName:"Task",
   predicate:"dateDue<$NOW",
   sortBy:"dateDue",
   limit:5
};

var filter=Descriptor.compile(criteria);

var top5OverdueTasks=filter(allTasks);
```
