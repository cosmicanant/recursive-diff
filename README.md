# Recursive-Diff
#####A JavaScript library to calculate diff between two variable where variable could be any valid JavaScript Data Type eg: string, Boolean, number, array or object

The api returns a standard diff object having standard key, value pair where each key represent a path and each value represent a change object. Path denotes that where the changes has been made against the original object and change denotes the nature of change ie: which operation(add/update/delete) has been performed and what is the new value.

```
diff = {
	path : {'operation': 'add/update/delete', 'value' : 'NewValue'}  /* Value represent ChangedValue */
}
```

You can assume path just like unix directory structure. eg: '/' represents root directory whereas /var/lib represent lib directory which is located under var directory relative to root directory.
So using path we can easily define changes made at any level and for any data structure whether it be an object or string or array.

eg: if orginal object is 'ob', the following is the description of various path.

1.  path = '/': this denotes change made at top level, or the object itself 
2.  path = '/key1': this denotes change made at ob.key1
3.  path = '/key1/key2/key3': this denotes change made at ob.key1.key2.key3
So if diff = {'/' : {'operation':'update', value:'newValue'}} , it represent that at root path , update operation is performed and the new value is 'newValue'.

Api: Api has following two methods:

1. getDiff(ob1, ob2): getDiff will calculate the diff between ob1 and ob2 and return the diff object.
2. applyDiff (ob1, diff): applyDiff will take ob1 object and apply diff object to transform ob1 into ob2.

#####Examples:
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
##### How to use recursive diff
**Node**: Please follow below steps for node.
1. npm install recursive-diff 
2. once installed, you can use following code block
```
var diff = require('recursive-diff');
var ob1 = {a:1};
var ob2 = {a:2};
var delta = diff.getDiff(ob1,ob2);
var ob3 = diff.applyDiff(ob1, delta);//expect ob3 is deep equal to ob2

```
**Browser**: Please follow below steps for using recursive-diff library in browser.
1. include recursive-diff.js into your html file using script tag and then use it using window.diff as given below
```
<script type="text" src="recursive-diff.js"/>
<script type="text/javascript">
var ob1 = {a:1};
var ob2 = {a:2};
var delta = diff.getDiff(ob1,ob2);
var ob3 = diff.applyDiff(ob1, delta); //expect ob3 is deep equal to ob2
</script>
```
2. once installed, you can use following code block
