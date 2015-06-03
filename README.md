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

eg: if orginal object is **ob**, the following is the description of various path.
1.  **path = '/' **: this denotes change made at top level, or the object itself 
2.  **path = '/key1'**: this denotes change made at ob.key1
3.  **path = '/key1/key2/key3'** this denotes change made at ob.key1.key2.key3
So if diff = {'/' : {'operation':'update', value:'someValue'}} , it represent that at root path , update operation is performed.

##### **Api**: Api has following two methods :
**getDiff(ob1, ob2)** => getDiff will calculate the diff between ob1 and ob2 and return the diff object.
**applyDiff (ob1, diff)** => applyDiff will take ob1 object and apply diff object to transform ob1 into ob2.


#####Examples:
---------

