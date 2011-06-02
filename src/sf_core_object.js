/**
 * 扩展Object
 */
(function() {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
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
	 * 
	  	var obj1 = {a: 0, b: 1};
		var obj2 = {c: 2, d: 3};
		var obj3 = {a: 4, d: 5};
		var merged = Object.merge(obj1, obj2, obj3); // returns {a: 4, b: 1, c: 2, d: 5}, (obj2, and obj3 are unaltered)
		 
		merged === obj1; // true, obj1 gets altered and returned as merged object
		 
		var nestedObj1 = {a: {b: 1, c: 1}};
		var nestedObj2 = {a: {b: 2}};
		var nested = Object.merge(nestedObj1, nestedObj2); // returns: {a: {b: 2, c: 1}}
	 * 
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
	 * @param {object} 		object		迭代的对象
	 * @param {func} 		fn			对每个元素执行的函数
	 * 				fn(item, key, object) 
	 * 				@param {object}		item	当前的元素								
	 * 				@param {object}		key		当前元素的键
	 * 				@param {object}		object	实际的对象
	 * 				如: function(value, key) { ... }
	 * @param {object} 		bind	在函数中this指向的对象(可选)	
	 */
	Object.prototype.each = function(object, fn, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
                fn.call(bind, object[key], key, object);
			}
		}
	};

	/**
	 * 得到指定对象的子对象
	 * @param {object} 		object	指定的对象
	 * @param {array} 		keys	键的数组
	 * 
	 * @return {object}		子对象
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
	 * 对每一个Map中的值调用指定的函数,并返回得到结果的新Map(Map其实就是键值对对象)
	 * @param {object} 		object		指定的对象
	 * @param {func} 		fn			对每个元素执行的函数
	 * 				fn(value, key, object)
	 * 				@param {object}		value	当前的元素值							
	 * 				@param {object}		key		当前元素的键
	 * 				@param {object}		object	实际的对象
	 * 				如: function(value, key) { ... }
	 * @param {object} 		bind	在函数中this指向的对象(可选)
	 * 
	 * @return {object}		新的对象 
	 */
	Object.prototype.map = function(object, fn, bind) {
		var results = {};
		for (var key in object) {
			if (hasOwnProperty.call(object, key))
				results[key] = fn.call(bind, object[key], key, object);
		}
		return results;
	};

	/**
	 * 对对象中的每一个元素调用指定的函数, 返回由执行结果为真的元素所组成的新对象
	 * @param {object} 		object		指定的对象
	 * @param {func} 		fn			对每个元素执行的函数
	 * @param {object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {object}		新的对象 
	 */
	Object.prototype.filter = function(object, fn, bind) {
		var results = {};
		Object.each(object, function(value, key) {
			if (fn.call(bind, value, key, object)) {
				results[key] = value;
			}
		});
		return results;
	};

	/**
	 * 对对象中的每一个元素调用指定的函数, 返回true如果所有函数调用都为真,否则返回false
	 * @param {object} 		object		指定的对象
	 * @param {func} 		fn			对每个元素执行的函数
	 * @param {object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {boolean}	返回true如果所有函数调用都为真,否则返回false
	 */
	Object.prototype.every = function(object, fn, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)
					&& !fn.call(bind, object[key], key)) {
				return false;
			}
		}
		return true;
	};

	/**
	 * 对对象中的每一个元素调用指定的函数, 返回true如果至少有一个函数调用为真,都不为真返回false
	 * @param {object} 		object		指定的对象
	 * @param {func} 		fn			对每个元素执行的函数
	 * @param {object} 		bind		在函数中this指向的对象(可选)
	 * 
	 * @return {boolean}	返回true如果至少有一个函数调用为真,都不为真返回false
	 */
	Object.prototype.some = function(object, fn, bind) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)
					&& fn.call(bind, object[key], key)) {
				return true;
			}
		}
		return false;
	};

	/**
	 * 返回指定对象的所有属性名称(键名)
	 * @param {object} object	指定对象
	 *
	 * @return {array}	属性名称数组
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
	 * @param {object} 	object	指定对象
	 *
	 * @return {array}	属性值数组
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
	 * 得到属性的个数
	 * @param {object} 	object	指定对象
	 *
	 * @return {int}	属性的个数
	 */
	Object.prototype.getLength = function(object) {
		return Object.keys(object).length;
	};

	/**
	 * 得到指定对象的指定属性值所对应的属性名称
	 * @param {object} 	object	指定对象
	 * @param {object} 	value	指定属性值
	 * 
	 * @return {string}		对应的属性名称,否则返回null
	 * 
	 * 注意: 没有valueOf,直接用object[key]得到
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
	 * @param {object} 	object	指定对象
	 * @param {object} 	value	指定属性值
	 * 
	 * @return {boolean}	true存在指定的属性值, 否则false
	 */
	Object.prototype.contains = function(object, value) {
		return Object.keyOf(object, value) != null;
	};

	/**
	 * 递归地合并任意数目的对象属性
	 * @param {object} 		source		在此对象上合并	
	 * @param {object} 		k			object
	 * @param {object} 		v			object
	 * 
	 * @return {object}		source的引用 
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
	 * @param {object} 	object	指定对象
	 * 
	 * @return {object}		新的对象 
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
	 * @param {object} 		original
	 * 
	 * @return {object} 	original对象
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
	 * @param {object} 		original
	 * 
	 * @return {object} 	original对象
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
	 * @param {object} 	 object	 要串行化的对象
	 * @param {string}	 base	 基本值(可选)
	 * 
	 * @return {string} 	串行化字符串
	 * 
	 * 例子:
	 * 
	  		{a: 111, b: 222, c: 333, d: 444}  ==>  a=111&b=222&c=333&d=444
	  		Object.toQueryString({apple: 'red', lemon: 'yellow'}, 'fruits') ==> fruits[apple]=red&fruits[lemon]=yellow
	 * 
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

	/**
     * @deprecated 用 function.bind() 代替
	 * 为此对象绑定一个方法
	 * @param {func} 	f	要绑定的方法
	 * 
	 * @return {func}	绑定此对象的方法 
	 */
	Object.prototype.bindMethod = function(f) {
	    return function() {
			return f.apply(this, arguments);
		};
	};

	// ---------------------------------------------------- //
	
	/**
	 * 数组的克隆
	 * 
	 * @return {array} 	新的数组
	 */
	Array.prototype.clone = function() {
		var i = this.length, clone = new Array(i);
		while (i--) {
			clone[i] = cloneOf(this[i]);
		}
		return clone;
	};
	
})();
