/**
 * 扩展Function
 *
 * @module Function
 */

/**
 * 绑定方法调用
 * @return {Function}	 一个函数
 *
 * @method bind
 */
Function.prototype.bind = function() {
	var __method = this;
	var args = Array.prototype.slice.call(arguments);
	var object = args.shift();
	return function() {
		return __method.apply(object, args.concat(Array.prototype.slice
				.call(arguments)));
	}
};

/**
 * 把一个多参数的函数转换成多个单参数函数
 * 
 * @return 	{Function} 一个函数
 *
 * @method curry
 */
Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
		return fn.apply(this, args
				.concat(Array.prototype.slice.call(arguments)));
	};
};

/**
 * 对一个多参数的函数调用,但只传入部分需要的参数,得到的是接受剩余参数的函数
 * 
 * @return {Function} 一个函数
 *
 * @method partial
 */
Function.prototype.partial = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
		var arg = 0;
		for (var i = 0; i < args.length && arg < arguments.length; i++) {
			if (args[i] === undefined) {
				args[i] = arguments[arg++];
			}
		}
		return fn.apply(this, args);
	};
};
