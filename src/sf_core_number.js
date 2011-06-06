/**
 * 扩展Number
 *
 * @module Number
 */

/**
 * 返回从min到max的随机数 (包括min和max)
 *
 * @static
 * @method Number.random
 * @param {int} min
 * @param {int} max
 * @return {int}    随机数[min, max]
 */
Number.random = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// --------------------------------------------- //

/**
 * 在给定的区域中查找该数值的极限
 *
 * @method Number.limit
 * @param {Number} 	min	极限最小值
 * @param {Number} 	max	极限最大值
 * @return {Number} 本数值的极限
 */
Number.prototype.limit = function(min, max) {
	return Math.min(max, Math.max(min, this));
};

/**
 * 得到该数值的近似值
 *
 * @method Number.round
 * @param {Number} 	precision	保留几位小数,默认为0.(可选)
 * @return {Number} 近似值
 */
Number.prototype.round = function(precision) {
	precision = Math.pow(10, precision || 0).toFixed(
			precision < 0 ? -precision : 0);
	return Math.round(this * precision) / precision;
};

/**
 * 执行该数值次指定的函数
 *
 * @method Number.times
 * @param {Function} 	func	指定的要执行的函数 索引值会变化
 * @param {Object} 	    bind	在函数中this指向的对象(可选)
 * 例子:
 		(4).times(alert); // alerts "0", then "1", then "2", then "3".
 */
Number.prototype.times = function(func, bind) {
	for (var i = 0; i < this; i++) {
		func.call(bind, i, this);
	}
};

/**
 * 将该数值转换为浮点值
 *
 * @method Number.toFloat
 * @return {Number}	 浮点值
 */
Number.prototype.toFloat = function() {
	return parseFloat(this);
};

/**
 * 将该数值转换为整型
 *
 * @method Number.toInt
 * @param {Number} 	base	进制,默认为10.(可选)
 * @return {int} 	整型
 */
Number.prototype.toInt = function(base) {
	return parseInt(this, base || 10);
};

// --------------------------------------------- //

/**
 *	使Number可以使用Math的方法 
 *
(function(math) {
	var methods = {};
	math.each(function(name) {
		if (!Number[name]) {
			methods[name] = function() {
				return Math[name].apply(null, [this].concat(Array.from(arguments)));
			};
		}	
	});
	Object.each(methods, function(item, key) {
		this[key] = item;
	}, Number);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor',
		'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);
*/
