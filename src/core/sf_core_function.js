/**
 * 扩展Function
 *
 * @module Function
 */

/**
 * 可以省略prototype为类型增加新的方法
 *
 * @method method
 * @param  {String}  name  增加的方法名称
 * @param  {Function}  func  方法
 * @return  {Object}  该类型
 */
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
    return this;
};

/**
 * 绑定方法调用
 *
 * @method bind
 * @return {Function}	 一个函数
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
 * @method curry
 * @return 	{Function} 一个函数
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
 * @method partial
 * @return {Function} 一个函数
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
