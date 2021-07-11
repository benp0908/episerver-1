/* jslint node: true */

'use strict';

var cfg = require('../map.json');

exports.addArticle = function(string) {
    return (/[aeiouAEIOU]/.test(string[0])) ? 'an ' + string : 'a ' + string;
};

exports.getDistance = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

exports.getDirection = function (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

exports.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

exports.angleDifference = (() => {    
    let mod = function(a, n) {
        return (a % n + n) % n;
    };
    return (sourceA, targetA) => { 
        let a = targetA - sourceA;
        return mod(a + Math.PI, 2*Math.PI) - Math.PI;
    };
})();

exports.loopSmooth = (angle, desired, slowness) => {
    return exports.angleDifference(angle, desired)/slowness;
};


exports.deepClone = (obj, hash = new WeakMap()) => {
    let result;
    // Do not try to clone primitives or functions
    if (Object(obj) !== obj || obj instanceof Function) return obj;
    if (hash.has(obj)) return hash.get(obj); // Cyclic reference
    try { // Try to run constructor (without arguments, as we don't know them)
        result = new obj.constructor();
    } catch(e) { // Constructor failed, create object without running the constructor
        result = Object.create(Object.getPrototypeOf(obj));
    }
    // Optional: support for some standard constructors (extend as desired)
    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(exports.deepClone(key, hash), 
                                                   exports.deepClone(val, hash)) );
    else if (obj instanceof Set)
        Array.from(obj, (key) => result.add(exports.deepClone(key, hash)) );
    // Register in hash    
    hash.set(obj, result);
    // Clone and assign enumerable own properties recursively
    return Object.assign(result, ...Object.keys(obj).map (
        key => ({ [key]: exports.deepClone(obj[key], hash) }) ));
};

exports.averageArray = arr => {
    if (!arr.length) return 0;    
    var sum = arr.reduce((a, b) => { return a + b; });
    return sum / arr.length;
};

exports.sumArray = arr => {
    if (!arr.length) return 0;    
    var sum = arr.reduce((a, b) => { return a + b; });
    return sum;
};


exports.signedSqrt = x => {
    return Math.sign(x) * Math.sqrt(Math.abs(x));
};

exports.getJackpot = x => {
    return (x > 26300 * 1.5) ? Math.pow(x - 26300, 0.85) + 26300 : x / 1.5;
};

exports.serverStartTime = Date.now();
// Get a better logging function
exports.time = () => {
    return Date.now() - exports.serverStartTime;
};

// create a custom timestamp format for log statements

exports.log = text => {
    console.log('[' + (exports.time()/1000).toFixed(3) + ']: ' + text);
};
exports.warn = text => {
    console.log('[' + (exports.time()/1000).toFixed(3) + ']: ' + '[WARNING] ' + text);
};
exports.error = text => {
    console.log(text);
};

exports.remove = (array, index) => {    
    // there is more than one object in the container
    if(index === array.length - 1){
        // special case if the obj is the newest in the container
        return array.pop();
    } else {
        let o = array[index];
        array[index] = array.pop();
        return o;
    }
};