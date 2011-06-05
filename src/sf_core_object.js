/**
 * 扩展Object
 *
 * @module Object
 */
(function() {
    /**
     * @private
     */
	var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * @private
     */
	var cloneOf = function(item){
		switch (type(item)){
			case 'array':
				return item.clone();
			case 'object': 
				return Object.clone(item);
			default: 
				return item;
		}
	};
	
	/**
	 * 合并对象属性
	 * 
	 * 例子:
	  	var obj1 = {a: 0, b: 1};
		var obj2 = {c: 2, d: 3};
		var obj3 = {a: 4, d: 5};
		var merged = Object.merge(obj1, obj2, obj3); // returns {a: 4, b: 1, c: 2, d: 5}, (obj2, and obj3 are unaltered)
		 
		merged === obj1; // true, obj1 gets altered and returned as merged object
		 
		var nestedObj1 = {a: {b: 1, c: 1}};
		var nestedObj2 = {a: {b: 2}};
		var nested = Object.merge(nestedObj1, nestedObj2); // returns: {a: {b: 2, c: 1}}
	 *
     * @private
	 */
	var mergeOne = function(source, key, current){
		switch (type(current)){
			case 'object':
				if (type(source[key]) == 'object') {
					Object.merge(source[key], current);
				} else {
					source[key] = Object.clone(current);
				}
				break;
			case 'array': 
				source[key] = current.clone();
				break;
			default: 
				source[key] = current;
		}
		return source;
	};
	
	/**
	 * 迭代给定对象
	 * @param {Object} 		object		迭代的对象
	 * @param {Function}	func		对每个元素执行的函数
	 * 				func(item, key, object)
	 * 				{Object}	item	当前的元素
	 * 				{Object}	key		当前元素的键
	 * 				{Object}	object	实际的对象
	 * 				如: function(value, key) { ... }
	 * @param {Object} 		bind	在函数中this指向的对象(可选)
     *
     * @method Object.each
	 */
	Object.prototype.each = function(object, func, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
                func.call(bind, object[key], key, object);
			}
		}
	};

	/**
	 * 得到指定对象的子对象
	 * @param {Object} 	object	指定的对象
	 * @param {Array} 	keys	键的数组
	 * 
	 * @return {Object}	子对象
     *
     * @method Object.subset
	 */
	Object.prototype.subset = function(object, keys) {
		var results = {};
		for (var i = 0, l = keys.length; i < l; i++) {
			var k = keys[i];
			results[k] = object[k];
		}
		return results;
	};

	/**
	 * 对指定对象中的每一个元素调用指定的函数,并返回得到结果的新对象
	 * @param {Object} 		object		指定的对象
	 * @param {Function} 	func		对每个元素执行的函数
	 * 				func(value, key, object)
	 * 				{object}	value	当前的元素值
	 * 				{object}	key		当前元素的键
	 * 				{object}	object	实际的对象
	 * 				如: function(value, key) { ... }
	 * @param {Object} 		bind	在函数中this指向的对象(可选)
	 * 
	 * @return {Object}		新的对象
     *
     * @method Object.map
	 */
	Object.prototype.map = function(object, func, bind) {
		var results = {};
		for (var key in object) {
			if (hasOwnProperty.call(object, key))
				results[key] = func.call(bind, object[key], key, object);
		}
		return results;
	};

	/**
	 * 对指定对象中的每一个元素调用指定的函数, 返回由执行结果为真的元素所组成的新对象
	 * @param {Object} 		object		指定的对象
	 * @param {Function} 	func		对每个元素执行的函数
	 * @param {Object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {Object}		新的对象
     *
     * @method Object.filter
	 */
	Object.prototype.filter = function(object, func, bind) {
		var results = {};
		Object.each(object, function(value, key) {
			if (func.call(bind, value, key, object)) {
				results[key] = value;
			}
		});
		return results;
	};

	/**
	 * 对指定对象中的每一个元素调用指定的函数, 如果所有函数调用都为真返回true,否则返回false
	 * @param {Object} 		object		指定的对象
	 * @param {Function} 	func		对每个元素执行的函数
	 * @param {Object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {Boolean}	如果所有函数调用都为真返回true,否则返回false
     *
     * @method Object.every
	 */
	Object.prototype.every = function(object, func, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)
					&& !func.call(bind, object[key], key)) {
				return false;
			}
		}
		return true;
	};

	/**
	 * 对指定对象中的每一个元素调用指定的函数, 如果至少有一个函数调用为真返回true,都不为真返回false
	 * @param {Object} 		object		指定的对象
	 * @param {Function} 	func		对每个元素执行的函数
	 * @param {Object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {Boolean}	如果至少有一个函数调用为真返回true,都不为真返回false
     *
     * @method Object.some
	 */
	Object.prototype.some = function(object, func, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)
					&& func.call(bind, object[key], key)) {
				return true;
			}
		}
		return false;
	};

	/**
	 * 返回指定对象的所有属性名称(键名)
	 * @param {Object} object	指定对象
	 *
	 * @return {Array}	属性名称数组
     *
     * @method Object.keys
	 */
	Object.prototype.keys = function(object) {
		var keys = [];
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
				keys.push(key);
			}
		}
		return keys;
	};

	/**
	 * 返回指定对象的所有属性值
	 * @param {Object} 	object	指定对象
	 *
	 * @return {Array}	属性值数组
     *
     * @method Object.values
	 */
	Object.prototype.values = function(object) {
		var values = [];
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
				values.push(object[key]);
			}
		}
		return values;
	};

	/**
	 * 得到指定对象的属性个数
	 * @param {Object} 	object	指定对象
	 *
	 * @return {int}	属性的个数
     *
     * @method Object.getLength
	 */
	Object.prototype.getLength = function(object) {
		return Object.keys(object).length;
	};

	/**
	 * 得到指定对象的指定属性值所对应的属性名称
     * 注意: 没有valueOf,直接用object[key]得到
     *
	 * @param {Object} 	object	指定对象
	 * @param {Object} 	value	指定属性值
	 * 
	 * @return {String}	对应的属性名称,否则返回null
	 * 
	 * @method Object.keyOf
	 */
	Object.prototype.keyOf = function(object, value) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key) && object[key] === value) {
				return key;
			}
		}
		return null;
	};

	/**
	 * 检查指定对象的指定属性值是否存在
	 * @param {Object} 	object	指定对象
	 * @param {Object} 	value	指定属性值
	 * 
	 * @return {Boolean}	存在指定的属性值返回true, 否则返回false
     *
     * @method Object.contains
	 */
	Object.prototype.contains = function(object, value) {
		return Object.keyOf(object, value) != null;
	};

	/**
	 * 递归地合并任意数目的对象属性
	 * @param {Object} 		source		在此对象上合并
	 * @param {Object} 		k			object
	 * @param {Object} 		v			object
	 * 
	 * @return {Object}		source的引用
     *
     * @method Object.merge
	 */
	Object.prototype.merge = function(source, k, v) {
		if (type(k) == 'string') {
			return mergeOne(source, k, v);
		}
		for (var i = 1, l = arguments.length; i < l; i++) {
			var object = arguments[i];
			for (var key in object) {
				mergeOne(source, key, object[key]);
			}
		}
		return source;
	};

	/**
	 * 得到指定对象的拷贝
	 * @param {Object} 	object	指定对象
	 * 
	 * @return {Object}	 新的对象
     *
     * @method Object.clone
	 */
	Object.prototype.clone = function(object) {
		var clone = {};
		for (var key in object) {
			clone[key] = cloneOf(object[key]);
		}
		return clone;
	};

	/**
	 * 追加指定对象中的属性到original对象中,original对象中已有的重名属性不改变
	 * @param {Object} 		original
	 * 
	 * @return {Object} 	original对象
     *
     * @method Object.append
	 */
	Object.prototype.append = function(original) {
		for (var i = 1, l = arguments.length; i < l; i++) {
			var extended = arguments[i] || {};
			for (var key in extended) {
				if (!key in original) {
					original[key] = extended[key];
				}
			}
		}
		return original;
	};

	/**
	 * 追加指定对象中的所有属性到original对象中,original对象中已有的重名属性将被覆盖
	 * @param {Object} 		original
	 * 
	 * @return {Object} 	original对象
     *
     * @method Object.appendAll
	 */
	Object.prototype.appendAll = function(original) {
		for (var i = 1, l = arguments.length; i < l; i++) {
			var extended = arguments[i] || {};
			for (var key in extended) {
				original[key] = extended[key];
			}
		}
		return original;
	};

	/**
	 * 串行化对象
	 * @param {Object} 	 object	 要串行化的对象
	 * @param {String}	 base	 基本值(可选)
	 * 
	 * @return {String} 	串行化字符串
	 * 
	 * 例子:
	  		{a: 111, b: 222, c: 333, d: 444}  ==>  a=111&b=222&c=333&d=444
	  		Object.toQueryString({apple: 'red', lemon: 'yellow'}, 'fruits') ==> fruits[apple]=red&fruits[lemon]=yellow
	 *
     * @method Object.toQueryString
	 */
	Object.prototype.toQueryString = function(object, base) {
		var queryString = [];
		Object.each(object, function(value, key) {
			if (base) {
				key = base + '[' + key + ']';
			}
			var result;
			switch (type(value)) {
			case 'object':
				result = Object.toQueryString(value, key);
				break;
			case 'array':
				var qs = {};
				value.each(function(val, i) {
					qs[i] = val;
				});
				result = Object.toQueryString(qs, key);
				break;
			default:
				result = key + '=' + encodeURIComponent(value);
			}
			if (value != null) {
				queryString.push(result);
			}
		});
		return queryString.join('&');
	};

	// ---------------------------------------------------- //
	
	/**
	 * 数组的克隆
	 * 
	 * @return {Array} 	新的数组
     *
     * @method Array.clone
	 */
	Array.prototype.clone = function() {
		var i = this.length, clone = new Array(i);
		while (i--) {
			clone[i] = cloneOf(this[i]);
		}
		return clone;
	};
	
})();
