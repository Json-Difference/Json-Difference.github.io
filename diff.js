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

  var linearizeJson = function linearizeJson(baseObject) {
    if (!(baseObject && _typeof(baseObject) === "object")) return [];
    var keyStack = [Object.keys(baseObject)];
    var linearKey = [];
    var linearlist = [];

    while (keyStack.length > 0) {
      linearKey.pop();
      var currentKeys = keyStack.pop();

      while (currentKeys && currentKeys.length > 0) {
        var currNode = currentKeys.pop();
        if (!currNode) continue;
        linearKey.push(currNode);
        var value = getSafely(linearKey, baseObject);

        if (value && _typeof(value) === "object") {
          keyStack.push(currentKeys);
          currentKeys = Object.keys(value);
        } else {
          linearlist.push({
            key: JSON.stringify(linearKey),
            value: value
          });
          linearKey.pop();
        }
      }
    }

    return linearlist;
  };

  var getDifferences = function getDifferences(left, right) {
    var linearLeft = linearizeJson(left);
    var linearRight = linearizeJson(right);
    var allKeys = linearLeft.concat(linearRight).map(function (keyVal) {
      return keyVal.key;
    });
    return allKeys.filter(function (key, index, arr) {
      return arr.indexOf(key) === index;
    }).filter(function (key, index, arr) {
      return arr.findIndex(function (keyInternal) {
        return key.startsWith(keyInternal.slice(0, -1)) ? keyInternal !== key : false;
      }) < 0;
    }).map(function (key) {
      return {
        stringVal: key,
        parsed: JSON.parse(key)
      };
    }).map(function (key) {
      return {
        key: key.stringVal,
        left: getSafely(key.parsed, left),
        right: getSafely(key.parsed, right)
      };
    }).filter(function (diff) {
      return diff.left !== diff.right;
    });
  };

  return getDifferences(left, right);
};