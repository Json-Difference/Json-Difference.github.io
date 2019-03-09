"use strict";



var diff = function diff(left, right) {
  function _typeof(obj) { 
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { 
        _typeof = function _typeof(obj) { 
          return typeof obj; 
        }; 
    } 
    else { 
      _typeof = function _typeof(obj) { 
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; 
      }; 
    } 
    
    return _typeof(obj); 
  }
  
  var getSafely = function getSafely(keys, object) {
    return keys.reduce(function (currObject, currKey) {
      return currObject && _typeof(currObject) === "object" ? currObject[currKey] : {}[currKey];
    }, object);
  };
  
  var getKeysWithTypesAndVals = function getKeysWithTypesAndVals(object) {
    return Object.keys(object).map(function(key) {
      var val = object[key];
      return {
        key: key,
        val: val,
        type: Array.isArray(val) 
          ? "array" 
          : val === null 
            ? "null" 
            : _typeof(val)
      };     
    })
  }

  var getKeysOnly = function getKeysOnly(keyTypeArray) {
    return keyTypeArray.map(function(keyType){
      return keyType.key;
    });
  }
  
  var linearizeJson = function linearizeJson(baseObject, identifier) {
    if (!(baseObject && _typeof(baseObject) === "object")) return [];
    var keyStack = [getKeysWithTypesAndVals(baseObject)];
    var linearKey = [];
    var flatObject = {};

    while (keyStack.length > 0) {
      
      linearKey.pop();
      var currentKeys = keyStack.pop();

      while (currentKeys && currentKeys.length > 0) {
        var currNode = currentKeys.pop();
        if (!currNode) continue;
        
                
        linearKey.push(currNode.key);     
        var stringKey = JSON.stringify(linearKey.slice(1));
        
        flatObject[stringKey] = {
          stringKey: stringKey,
          key: linearKey.slice(),
          [identifier]: {              
            type: currNode.type
          }
        }
            

        if (["object", "array"].indexOf(currNode.type) > -1) {
          keyStack.push(currentKeys);
          currentKeys = getKeysWithTypesAndVals(currNode.val);
        } else {    
          flatObject[stringKey][identifier].val = currNode.val
          linearKey.pop();
        }
      }
    }

    return flatObject;
  };

  var getDifferences = function getDifferences(left, right) {
    var linearLeft = linearizeJson(left, "left");
    var linearRight = linearizeJson(right, "right");
    
    for (var attrname in linearLeft) { 
      if (linearRight[attrname]){
        linearRight[attrname].left = linearLeft[attrname].left; 
      }else{
        linearRight[attrname] = linearLeft[attrname]
      }
    }
    
    
    
    return Object.keys(linearRight)
      .map(function (key) {        
        return linearRight[key];
      })
      .filter(function(key){
        return !key.left || !key.right || key.left.type !== key.right.type || key.left.val !== key.right.val;
      })
      .filter(function (key, index, arr) {
        return arr.findIndex(function (other) {
          return key.stringKey.startsWith(other.stringKey.slice(0, -1)) ? other.stringKey !== key.stringKey : false;
      }) < 0})
      // })
      .map(function (key) {
        return {
          key: key.stringKey,
          left: (key.left || {}).val || getSafely(key.key, left),
          right: (key.right || {}).val || getSafely(key.key, right),
          leftMissing: !key.left,
          rightMissing: !key.right,
          typeDifferent: (key.left || {}).type !== (key.right || {}).type && ("left is " + (key.left || {}).type +" and right is "+(key.right || {}).type)
        };
      });
  };

  return getDifferences({root: left}, {root: right});
};
