# Recursive-Diff
#####A JavaScript library to calculate diff between two variable where variable could be any valid JavaScript Data Type eg: string, Boolean, number, array or object

Recursive diff is a javascript library which can be used for finding difference between any two variable, where variable is any valid JavaScript data type like numeric, Boolean, Array, Object etc. You can use it for Node and browsers as well.

The api returns a standard diff object having collection of (path,change) touple in the followign generalized structure:
```
diff = {
	path : {'operation': 'add/update/delete', 'value' : 'NewValue'}  /* Value represent ChangedValue */
}
```
Where each (path, change) touple represent **change** made at a particular **path**. **Path** represents, where the changes has been made and **change** represents the nature of change ie: add/update or delete. New value is also given in the change object.

You can assume path just like unix directory system. eg: '/' represents root directory whereas /var/lib represent lib directory which is under '/'(root) directory at a relative path '/var/lib'.
So using path we can easily define diff made at any level and for any data structure whether it be an object or string or array.

a) path '/' : this denotes change made at top level, or the object itself 
b) '/key1' represent changes made at ob.key1 
c) similarly /key1/key2/key3 represent change at ob.key1.key2.key3


So if diff = {'/' : {'operation':'add/update/delete', value:'someValue'}} , it represent that at root path , add/update/delete operation is performed, In the case of add/update a value key is also given which tell us about new value as a result of add/update operation.

b) If original object is 'ob' then path '/key1/key2/key3' represent ob[key1][key2][key3]
Api: Api has following two public method :
getDiff(ob1, ob2) => getDiff will calculate the diff between ob1 and ob2 and return the diff object.
applyDiff (ob1, diff) => applyDiff will take ob1 object and apply diff object to transform ob1 into ob2.


Examples:
---------

