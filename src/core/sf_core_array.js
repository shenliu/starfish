/**
 * 扩展Array
 *
 * @module Array
 */

/**
 * 迭代数组
 *
 * @method Array.forEach
 * @param {Function}    func    对每个元素执行的函数
 * @param {Object}   	bind	在函数中this指向的对象(可选)
 */
Array.prototype.forEach = function(func, bind) {
    if (!Array.prototype.forEach) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                func.call(bind, this[i], i, this);
            }
        }
    } else {
        Array.forEach(func, bind);
    }
};

/**
 * 迭代数组
 *
 * @method Array.each
 * @param {Function}    func	对每个元素执行的函数
 * 			func(item, index, array)
 * 			{Object}    item	当前元素
 * 			{int}   	index	当前索引
 * 			{Array}     array	实际数组
 * @param {Object} 	bind	在函数中this指向的对象(可选)
 * @return {Array}	本数组this
 */
Array.prototype.each = function(func, bind) {
	Array.forEach(this, func, bind);
	return this;
};

/**
 * 对该数组的每一个元素调用指定的函数,并返回包含所有执行结果的数组
 *
 * @method Array.invoke
 * @param {String} 	methodName	要调用的函数名称 该函数所需要的参数可由arguments[0]后的提供
 * 					var arr = myArray.invoke(method[, arg, arg, arg ...])
 * @return {Array}	包括所有执行结果的数组
 * 例子:
 		var foo = [4, 8, 15, 16, 23, 42];
		var bar = foo.invoke('limit', 10, 30);  //bar is now [10, 10, 15, 16, 23, 30]
 */
Array.prototype.invoke = function(methodName) {
	var args = Array.slice(arguments, 1);
	return this.map(function(item) {
		return item[methodName].apply(item, args);
	});
};

/**
 * 对该数组中的每一个元素调用指定的函数, 如果所有函数调用都为真返回true,否则返回false
 *
 * @method Array.every
 * @param {Function} 	func	对每个元素执行的函数
 * @param {Object} 	    bind	在函数中this指向的对象(可选)
 * @return {Boolean} 	如果所有函数调用都为真返回true,否则返回false
 */
Array.prototype.every = function(func, bind) {
	for (var i = 0, l = this.length; i < l; i++) {
		if ((i in this) && !func.call(bind, this[i], i, this)) {
			return false;
		}
	}
	return true;
};

/**
 * 对该数组中的每一个元素调用指定的函数, 如果至少有一个函数调用为真返回true,都不为真返回false
 *
 * @method Array.some
 * @param {Function} 	func	对每个元素执行的函数
 * @param {Object} 	    bind	在函数中this指向的对象(可选)
 * @return {Boolean}	如果至少有一个函数调用为真返回true,都不为真返回false
 */
Array.prototype.some = function(func, bind) {
	for (var i = 0, l = this.length; i < l; i++) {
		if ((i in this) && func.call(bind, this[i], i, this)) {
			return true;
		}
	}
	return false;
};

/**
 * 对该数组中的每一个元素调用指定的函数, 返回由执行结果为真的元素所组成的新数组
 *
 * @method Array.filter
 * @param {Function} 	func	对每个元素执行的函数
 * @param {Object} 	    bind	在函数中this指向的对象(可选)
 * @return {Array}	新的数组
 */
Array.prototype.filter = function(func, bind) {
	var results = [];
	for (var i = 0, l = this.length; i < l; i++) {
		if ((i in this) && func.call(bind, this[i], i, this)) {
			results.push(this[i]);
		}
	}
	return results;
};

/**
 * 对该数组的每一个元素调用指定的函数,并返回得到结果的新数组
 *
 * @method Array.map
 * @param {Function} 	func	对每个元素执行的函数
 * @param {Object} 	    bind	在函数中this指向的对象(可选)
 * @return {Array}	新数组
 *
 * 例子:
        var timesTwo = [1, 2, 3].map(function(item, index){
            return item * 2;
        });

        现在timesTwo = [2, 4, 6];
 */
Array.prototype.map = function(func, bind) {
	var results = [];
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this) {
			results[i] = func.call(bind, this[i], i, this);
		}
	}
	return results;
};

/**
 * 创建一个由该数组包含的所有元素组成的新的数组,不包括null和undefined
 *
 * @method Array.clean
 * @return {Array} 	新的数组
 */
Array.prototype.clean = function() {
	return this.filter(function(item) {
		return item != null;
	});
};

/**
 * 从该数组中得到与指定值相等的第一个元素的索引值
 *
 * @method Array.indexOf
 * @param {Object} 	item	要查找的值
 * @param {int} 	from	从数组的第from位起查找,默认为0.(可选)
 * @return {int}	第一个匹配元素的索引值 或-1没有匹配
 */
Array.prototype.indexOf = function(item, from) {
	var len = this.length;
	for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++) {
		if (this[i] === item) {
			return i;
		}
	}
	return -1;
};

/**
 * 从该数组中得到与指定值相等的最后一个元素的索引值
 *
 * @method Array.lastIndexOf
 * @param {Object} 	item	要查找的值
 * @param {int} 	from	从数组的第from位起查找,默认为数组长度-1.(可选)
 * @return {int}	最后一个匹配元素的索引值 或-1没有匹配
 */
Array.prototype.lastIndexOf = function(item, from) {
	var len = this.length;
	for (var i = (from > len) ? Math.min(len - 1, from - len) : (from == 0 ? 0
			: from || len - 1); i >= 0; i--) {
		if (this[i] === item) {
			return i;
		}
	}
	return -1;
};

/**
 * 创建一个由指定数组的每一元素为键,该数组(this)的元素为值的对象
 *
 * @method Array.associate
 * @param {Array} 	keys	该数组每一元素为键
 * @return {Object}		键值对对象
 */
Array.prototype.associate = function(keys) {
	var obj = {}, length = Math.min(this.length, keys.length);
	for (var i = 0; i < length; i++) {
		obj[keys[i]] = this[i];
	}
	return obj;
};

/**
 * 用该数组中的元素为一个key/function对的对象赋值
 *
 * @method Array.link
 * @param {Object} 	object	一个包含key/function对的对象
 * @return {Object}		赋值了的对象
 * 例子:
 		var arr2 = [100, 'Hello', {foo: 'bar'}, el, false]; // el为对象
		arr2.link({
			myNumber: Type.isNumber,
		    myElement: Type.isElement,
		    myObject: Type.isObject,
		    myString: Type.isString,
		    myBoolean: function(obj){ return obj != null; }
		});
		// returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}
 */
Array.prototype.link = function(object) {
	var result = {};
	for (var i = 0, l = this.length; i < l; i++) {
		for (var key in object) {
			if (object[key](this[i])) {
				result[key] = this[i];
				delete object[key];
				break;
			}
		}
	}
	return result;
};

/**
 * 检查该数组中指定的元素值是否存在
 *
 * @method Array.contains
 * @param {Object} 	item	指定的元素值
 * @param {int} 	from	从数组的第from位起查找,默认为0.(可选)
 * @return {Boolean}	存在指定的元素值返回true, 否则返回false
 */
Array.prototype.contains = function(item, from) {
	return this.indexOf(item, from) != -1;
};

/**
 * 在该数组末尾添加指定的数组
 *
 * @method Array.append
 * @param {Array} 	array	要追加的数组
 * @return {Array}	该数组this
 */
Array.prototype.append = function(array) {
	this.push.apply(this, array);
	return this;
};

/**
 * 得到该数组的最后一个元素 此方法并不改变该数组 区别于pop()方法
 *
 * @method Array.getLast
 * @return {Object}	 最后一个元素,如果数组长度为0则返回null
 */
Array.prototype.getLast = function() {
	return (this.length) ? this[this.length - 1] : null;
};

/**
 * 随机得到该数组的一个元素
 *
 * @method Array.getRandom
 * @return {Object}   一个元素,如果数组长度为0则返回null
 */
Array.prototype.getRandom = function() {
	return (this.length) ? this[Number.random(0, this.length - 1)] : null;
};

/**
 * 添加指定的元素到该数组结尾处,如果该数组中已经存在就不添加.元素名称大小写和元素类型敏感
 *
 * @method Array.include
 * @param {Object} 	item	要添加的元素
 * @return {Array} 	该数组this
 */
Array.prototype.include = function(item) {
	if (!this.contains(item)) {
		this.push(item);
	}
	return this;
};

/**
 * 添加指定数组中的所有元素到该数组中,如果有重复就不添加.元素名称大小写和元素类型敏感
 *
 * @method Array.combine
 * @param {Array} 	array	要添加的数组
 * @return {Array} 	该数组this
 */
Array.prototype.combine = function(array) {
	for (var i = 0, l = array.length; i < l; i++) {
		this.include(array[i]);
	}
	return this;
};

/**
 * 删除该数组中所有与指定元素相同的元素
 *
 * @method Array.erase
 * @param {Object} 	item	指定元素
 * @return {Array} 	该数组this
 */
Array.prototype.erase = function(item) {
	for (var i = this.length; i--;) {
		if (this[i] === item) {
			this.splice(i, 1);
		}
	}
	return this;
};

/**
 * 删除该数组中索引为from到to的元素
 *
 * @method Array.remove
 * @param {int} from    起始索引
 * @param {int} to      终止索引 (可选) 不提供则只删除from指定的元素
 * @return {Array} 	该数组this
 */
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/**
 * 清空该数组
 *
 * @method Array.empty
 * @return {Array}   该数组this 为[]
 */
Array.prototype.empty = function() {
	this.length = 0;
	return this;
};

/**
 * 使多维数组变为一维数组
 *
 * @method Array.flatten
 * @return {Array}	新的一维数组
 */
Array.prototype.flatten = function() {
	var array = [];
	for (var i = 0, l = this.length; i < l; i++) {
		var type = type(this[i]);
		if (type == 'null') {
			continue;
		}
		array = array.concat((type == 'array' || type == 'collection'
				|| type == 'arguments' || (this[i] instanceof Array)) ? Array
				.flatten(this[i]) : this[i]);
	}
	return array;
};

/**
 * 得到该数组中第一个非null的元素
 *
 * @method Array.pick
 * @return {Object} 	第一个非null的元素
 */
Array.prototype.pick = function() {
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i] != null)
			return this[i];
	}
	return null;
};

/**
 * 转换16进制颜色值到RGB.必须是['FF','FF','FF']的形式
 *
 * @method Array.hexToRgb
 * @param {Boolean}  toArray   如果为true,则转换为数组
 * @return {String/Array}	转换后的RGB或数组
 * 例子:
 		['11', '22', '33'].hexToRgb(); // returns 'rgb(17, 34, 51)'
		['11', '22', '33'].hexToRgb(true); // returns [17, 34, 51]
 */
Array.prototype.hexToRgb = function(toArray) {
	if (this.length != 3) {
		return null;
	}
	var rgb = this.map(function(value) {
		if (value.length == 1) {
			value += value;
		}
		return value.toInt(16);
	});
	return (toArray) ? rgb : 'rgb(' + rgb + ')';
};

/**
 * 转换RGB颜色值到16进制.必须是[255, 255, 255], [255, 255, 255, 1]中的形式
 *
 * @method Array.rgbToHex
 * @param {Boolean} 	toArray	    如果为true,则转换为数组
 * @return {String/Array}	转换后的16进制颜色值或数组,如果第4个参数为0,则返回transparent
 * 例子:
 		[17, 34, 51].rgbToHex(); // returns '#112233'
		[17, 34, 51].rgbToHex(true); // returns ['11', '22', '33']
		[17, 34, 51, 0].rgbToHex(); // returns 'transparent'
 */
Array.prototype.rgbToHex = function(toArray) {
	if (this.length < 3) {
		return null;
	}
	if (this.length == 4 && this[3] == 0 && !toArray) {
		return 'transparent';
	}
	var hex = [];
	for (var i = 0; i < 3; i++) {
		var bit = (this[i] - 0).toString(16);
		hex.push((bit.length == 1) ? '0' + bit : bit);
	}
	return (toArray) ? hex : '#' + hex.join('');
};

/**
 * 对 对象的某一个属性进行排序,可以传入一个次要的比较函数(当属性值相同时,比较次要函数)
 * 此函数用于Array.sort()的compare function
 *
 * @param   {String}  name  属性名称
 * @param   {Function}  minor  次要的比较函数
 * @return  {Function}  排序比较函数
 *
 * 例子:
     s.sort(orderBy('last', orderBy('first'))); 先按'last'属性比较,再按'first'比较
 */
var orderBy = function(name, minor) {
    return function (o, p) {
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    }
};
