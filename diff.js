"use strict";

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, pos) {
            pos = !pos || pos < 0 ? 0 : +pos;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

var compareKeyPath = function compareKeyPath (a, b) {
  var keyPathA = JSON.parse(a)
  var keyPathB = JSON.parse(b);
  
  for (var index in keyPathA) {
    var keyA = keyPathA[index];
    var keyB = keyPathB[index];
    
    if(keyA === keyB) {
      continue;
    }
    
    if (+keyA == keyA && +keyB == keyB) {
      return keyA - keyB
    }
    
    return keyA < keyB 
          ? -1 
          : keyA > keyB
            ? 1
            : 0;
  } 
  
  return 0;
}

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

  var isObjectOrArray = function isObjectOrArray (type){
    return type === "object" || type === "array";
  }
  
  var flattenJson = function flattenJson(baseObject, identifier) {
    if (!(baseObject && _typeof(baseObject) === "object")) return [];
    var keyStack = [getKeysWithTypesAndVals(baseObject)];
    var keyPathArray = [];
    var flatObject = {};

    while (keyStack.length > 0) {
      
      keyPathArray.pop();
      var currentKeys = keyStack.pop();

      while (currentKeys && currentKeys.length > 0) {
        var currNode = currentKeys.pop();
        if (!currNode) continue;
        
                
        keyPathArray.push(currNode.key);     
        var keyPath = JSON.stringify(keyPathArray.slice(1));
        
        flatObject[keyPath] = {
          keyPath: keyPath
        };        
      
        flatObject[keyPath][identifier] = {              
          type: currNode.type,
          val: currNode.val
        };
        
        if (isObjectOrArray(currNode.type)) {
          keyStack.push(currentKeys);
          currentKeys = getKeysWithTypesAndVals(currNode.val);
        } else {    
          keyPathArray.pop();
        }
      }
    }

    return flatObject;
  };

  var getTypeString = function getTypeString (type) {
    return type || JSON.stringify(type) || "undefined" 
  }
  
  var getValuePrimitive = function getValuePrimitive (val, type) {
    return isObjectOrArray(type) ? JSON.stringify(val, null, 2) : val;
  } 
  var getDifferences = function getDifferences(left, right) {
    var flatLeft = flattenJson(left, "left");
    var flatRight = flattenJson(right, "right");
    
    for (var attrname in flatLeft) { 
      if (flatRight[attrname]){
        flatRight[attrname].left = flatLeft[attrname].left; 
      }else{
        flatRight[attrname] = flatLeft[attrname]
      }
    }
    
    
    
    return Object.keys(flatRight)
      .map(function (key) {        
        return flatRight[key];
      })
      .filter(function(key){
        return !key.left 
        || !key.right 
        || key.left.type !== key.right.type 
        || (key.left.val !== key.right.val && !isObjectOrArray(key.left.type)) ;
      })
      .filter(function (key, index, arr) {
        return !arr.some(function (other) {
          return key.keyPath.startsWith(other.keyPath.slice(0, -1)) ? other.keyPath !== key.keyPath : false;
        });
      })
      .sort(function(a, b) {
        return compareKeyPath(a.keyPath, b.keyPath);
      })
      .map(function (key) {
        var leftSafe = (key.left || {});
        var rightSafe = (key.right || {});
        var curr = {
          keyPath: key.keyPath,
          leftVal: getValuePrimitive(leftSafe.val, leftSafe.type),
          rightVal: getValuePrimitive(rightSafe.val, rightSafe.type),
          leftType: getTypeString(leftSafe.type),
          rightType: getTypeString(rightSafe.type),
          typeDifferent: leftSafe.type !== rightSafe.type
        };
        
        curr.leftTableDisplay = { 
            type: curr.leftType,
            val: curr.leftVal
        }
        curr.rightTableDisplay = {
            type: curr.rightType, 
            val: curr.rightVal
        }
        
        return curr;
      })
  };

  return getDifferences({root: JSON.parse(left)}, {root: JSON.parse(right)});
};
