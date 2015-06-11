# Recursive-Diff

##### A JavaScript library to calculate diff between two variable where variable could be any valid JavaScript data type eg: string, Boolean, number, array or object
--------

![recursive diff demo](./img/recursive-diff.png?raw=true "Sample Recursive Diff")

The api returns a standard diff object having key, value pair where each key represents a '/' separated path and each value represents a change object. Path denotes where the changes has been made against the original object and change denotes the nature of change ie: which operation(add/update/delete) has been performed and what is it's new value.

```
diff = {
	path : {'operation': 'add/update/delete', 'value' : 'NewValue'}  /* Value represent ChangedValue */
}
```

## Api details: 

**getDiff(ob1, ob2):** getDiff would take two arguments and return their diff.

**applyDiff (ob1, diff):** applyDiff would take two arguments: 1)original object, 2)diff object and applies diff object on original object and return the resulting object.

## ChangeLog
**0.1.1** - Added support of **null** value for any key in a object.


##Using recursive diff library in Node:

First you need to install recursive diff libray into Node using  **npm install recursive-diff** and then you can use following code block.

```
var diff = require('recursive-diff');
var ob1 = {a:1};
var ob2 = {a:2};
var delta = diff.getDiff(ob1,ob2);
var ob3 = diff.applyDiff(ob1, delta);//expect ob3 is deep equal to ob2

```

##Using recursive diff library in Browser: 

Include recursive-diff library into your html file using script tag and then you can access recursive-diff api  as below.

```
<script type="text" src="index.js"/>
<script type="text/javascript">
var ob1 = {a:1};
var ob2 = {a:2};
var delta = diff.getDiff(ob1,ob2);
var ob3 = diff.applyDiff(ob1, delta); //expect ob3 is deep equal to ob2
</script>
```

## Examples:
---------
```
var diff = require('recursive-diff');
var a, b, c, delta ;
//testing primitive data type
a = 3 ;
b = 10;
delta = diff.getDiff(a, b);
console.log(delta) ; // Output: {'/', {operation: update, value: 10}}
c = diff.applyDiff(a, delta);
console.log(c); //Output: 10
 
//testing array
a = [1,2] ;
b = [1,30,40] ;
delta = diff.getDiff(a, b);
console.log(delta);
/*** Output: 
{
    '/1' : {operation: update, value: 30},
    '/2' : {operation: add, value: 40} 
}

***/
c = diff.applyDiff(a, delta);
console.log(c) ; //Output: [1,30,40]

//testing object 
a = {
    a: '10',
    b: '20',
    c: '30'
} ;
b = {
    a: '10',
    b: '40'
} ;
delta = diff.getDiff(a, b);
console.log(delta);
/*** Output:
{
   '/b' : {operation: 'update', value:'40'},
   '/c' : {operation: 'delete'}
}
**/
c = diff.applyDiff(a, delta);
console.log(c); //Output: {a:'10', 'b':40}

//testing complex deep object
a = {
    b: [1,2,[3,4]],
    c: {
        c1 : 20,
        c2 : {
            c21: 'hello'
        },
        c3: 'India'
    }
} ;
b = {
    b: [1,2,[4]],
    c: {
        c1 : 20,
        c2 : {
            c21: 'hi',
            c22: 'welcome'
        },
        c3: 'cosmic'
    }
} ;

delta = diff.getDiff(a, b);
console.log(delta);
/*** Output:
{ 
  '/b/2/0': { operation: 'update', value: 4 },
  '/b/2/1': { operation: 'delete' },
  '/c/c2/c22': { operation: 'add', value: 'welcome' },
  '/c/c2/c21': { operation: 'update', value: 'hi' },
  '/c/c3': { operation: 'update', value: 'cosmic' } 
}
***/
c = diff.applyDiff(a, delta);
console.log(c) ;
/***Output
 {
    b: [1,2,[4]],
    c: {
        c1 : 20,
        c2 : {
            c21: 'hi',
            c22: 'welcome'
        },
        c3: 'cosmic'
    }
}
**/
```
