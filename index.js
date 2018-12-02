/*
 * recursive-diff
 *
 * Copyright (C) 2015 Anant Shukla <anant.shukla.rkgit@gmail.com>
 *
 * Licensed under The MIT License (MIT)
 */
;(function(){
    var diff = (function(){
        var getType = function( x ){
            var type = typeof x ;
            if(type === 'object' && Object.prototype.toString.call(x).match(/array/i) ){
                type = 'array';
            }
            return type ;
        };

        var findDiff =  function( ob1, ob2 , path , result){
            var val1, val2, newpath, key  ;
            var type1 = getType(ob1) ;
            var type2 = getType(ob2) ;
            //initialize some defaults
            if( path == null || typeof path !== 'string'){
                path = '/' ; //initialize to root path
            }
            if (result == null || typeof result !== 'object'){
                result = {} ;
            }
            //diff algo
            if(ob1 == null || ob2 == null ){
                if(ob1 !== ob2){
                    if(type1 === 'undefined'){
                        result[path] = {operation: 'add', value : ob2};
                    }
                    else if(type2 === 'undefined'){
                        result[path] = {operation: 'delete'};
                    }
                    else{
                        result[path] = {operation: 'update', value: ob2};
                    }
                }
            }
            else if( type1 !== type2  || (type1 !== 'object' && type1 !== 'array') || (type2 !== 'object' && type2 !== 'array') ){
                if(ob1 !== ob2){
                    result[path] = {operation: 'update', value : ob2};
                }
            }
            else{
                for(key in ob1){
                    newpath = path === '/' ? path + key : path + '/' + key;
                    val1 = ob1[key];
                    val2 = ob2[key];

                    if(val1 == null || val2 == null){
                        if(val1 !== val2){
                            if(typeof val1 === 'undefined'){
                                result[newpath] = {operation: 'add', value : val2};
                            }
                            else if(typeof val2 === 'undefined'){
                                result[newpath] = {operation: 'delete'};
                            }
                            else{
                                result[newpath] = {operation: 'update', value: val2};
                            }
                        }
                    }
                    else {
                        if(getType(val1) !== getType( val2) ){
                                result[newpath] = {operation : 'update', value: val2} ;
                        }
                        else {
                            if(typeof val1 === 'object'){
                                findDiff(val1, val2, newpath, result);
                            }
                            else{
                                if(val1 !== val2){
                                    result[newpath] = {operation : 'update', value: val2} ;
                                }
                            }
                        }
                    }
                }
                for(key in ob2){
                    newpath = path === '/' ? path + key : path + '/' + key;
                    val1 = ob1[key];
                    val2 = ob2[key];
                    if(val1 !== val2){
                        if(typeof val1 === 'undefined'){
                            result[newpath] = {operation: 'add', value : val2} ;
                        }
                    }
                }
            }
            return result ;
        };
        var setValueByPath = function(ob, path, value, visitorCallback){
            if(!path.match(/^\//)){
                throw new Error('Diff path: "' + path + '" is not valid');
            }
            var keys = path.split('/');
            keys.shift();
            var val = ob;
            var length = keys.length ;
            for(var i=0; i < length; i++){
                if (!val) throw new Error('Invalid path: "' + path + '" for object: ' + JSON.stringify(ob, null, 2));
                else if(keys[i].length < 1) throw new Error('Invalid path: "' + path + '" for object: ' + JSON.stringify(ob, null, 2));

                if( i !== length -1 ){
                    val = val[keys[i]];
                    if(visitorCallback){
                        visitorCallback(val);
                    }
                }
                else{
                    val[keys[i]] = value;
                }
            }
            return ob;
        };

        var deleteValueByPath = function(ob, path ){
            var keys = path.split('/');
            keys.shift(); //removing initial blank element ''
            var val = ob ;
            var length = keys.length ;
            for(var i=0; i < length; i++){
                if( i !== length -1){
                    if(!val[keys[i]]){
                        throw new Error('Invalid path: "' + path + '" for object: ' + JSON.stringify(ob, null, 2));
                    }
                    val = val[keys[i]];
                }
                else{
                    if(getType(val) === 'object'){
                        delete val[keys[i]] ;
                    }
                    else{
                        var index = parseInt(keys[i]);
                        while(val.length > index){
                            val.pop();
                        }
                    }
                }
            }
            return ob;
        };

        var applyDiff = function( ob1, diff, visitorCallback){
            var path, diffOb, op ;
            if (!diff) throw new Error('No diff object is provided, Nothing to apply');
            for(var key in diff ){
                path =  key;
                diffOb = diff[key];
                op = diffOb.operation ;
                if(op.match(/add|update|delete/)){
                    if(op === 'add'){
                        if(path === '/'){
                            ob1 = diffOb.value ;
                            break ;
                        }
                        setValueByPath(ob1, path, diffOb.value, visitorCallback);
                    }
                    else if(op === 'update'){
                        if(path === '/'){
                            ob1 = diffOb.value ;
                            break ;
                        }
                        setValueByPath(ob1, path, diffOb.value, visitorCallback);
                    }
                    else{
                        if(path === '/'){
                            ob1 = null ;
                            break ;
                        }
                        deleteValueByPath(ob1, path);
                    }
                }
                else throw new Error('Invalid operation: "' + op + '"');
            }
            return ob1 ;
        };

        return {
            getDiff : function( ob1, ob2){
               var result = findDiff(ob1, ob2) ;
               return result;
            },
            applyDiff : function(ob, diff, visitorCallback){
                var result = applyDiff(ob, diff, visitorCallback);
                return result ;
            }
        };
    })();
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
        module.exports = diff;
    }
    else{
        window.diff = diff ;
    }
})();
