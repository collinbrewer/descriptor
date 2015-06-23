# Descriptor.js
Descriptor offers a unified format for queries and their datasets, and includes a utility for understanding the descriptor.

```Descriptor``` is used primarily for:
- Defining queries in a unified way when Descriptoring datasets
- Generating unique keys for caching datasets
- Comparing queries and query depth for cache optimization

## What can you do with it?
Out of the box, ```Descriptor``` can:

- Use a unified format to describe datasets
- Compare Descriptors to determine if they are the same or if one is more strict than the other
- Parse and stringify in multiple formats, including JSON and a non-standardized queryString format
- Test a value against the parameters of the Descriptor
- Filter an array for values matching the parameters of the Descriptor
- Extensible...

### Example
```javascript
var descriptor={entityName:"Todo", predicate:"completed!=true"};
var filter=Descriptor.compile(descriptor);

var uncompletedTodos=todos.filter(filter);
```


## What can you do with it out of the box?

Descriptor is completely extensible, so it can handle custom parameters, and supplies hooks for custom processing.

In fact, all the parameters currently supported by Descriptor are available because they have been registered with Descriptor.

### Example
Let's say you want to extend Descriptor's capability to include a parameter for logging out what's going on.
-
```javascript
Descriptor.register("shouldLog", function(parameterValue, objectInDataset){

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
