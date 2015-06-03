# Recursive-Diff
A JavaScript library to calculate diff between two variable where variable could be any valid JavaScript Data Type eg: string, Boolean, number, array or object

Recursive diff is a javascript library which can be used for finding difference between any two variable, where variable is any valid JavaScript data type like numeric, Boolean, Array, Object etc. You can use it for Node and browsers as well.

The api returns a standard diff object having collection of path,change touple in the followign generalized structure:
diff = {
	path : {'operation': 'add/update/delete', 'value' : 'NewValue'}  /* Value will be present only for add/update operation*/
}
Where each (path, change) touple represent changes made at a particular path. Path represent where the changes has been made and change represent the nature of changes. only three type of changes are possible at any path ie: add/update/delete, For add/update a value is also given which represent the newly added/update value.

You can assume path just like unix directory structure. eg: root directory is represent by '/', So using this root path we can represent any directory relative to root directory, eg: /var/lib. Idea of using path was inspired from the fact that we can easily define diff for any data structure whether it be an object or string or array .

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

