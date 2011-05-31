/**
 * starfish的基本类
 * 
 * 命名规范：
 * 		1.以"_"开头的属性或方法为 私有的或局部的
 * 		2.以"$"开头或全部大写的变量为 全局变量
 * 
 */
var org;
if (!org) {
	org = {};
} else if (typeof org != "object") {
	throw new Error("org already exists and is not an object");
}

if (!org.shen) {
	org.shen = {};
} else if (typeof org.shen != "object") {
	throw new Error("org.shen already exists and is not an object");
}

if (org.shen.Starfish) {
	throw new Error("org.shen.Starfish already exists");
}

org.shen.Starfish = {
	author: 'shen',
	email: 'bonjour.shen@gmail.com',
	organization: 'shen universal group',
	found: '2010.02.10',
	/**
 	*  v.x.y
 	*  v - 主版本(重大改动)
 	*  x - 次版本(增加方法)
 	*  y - 方法有小改动
 	*/
	version: '0.5.50',
	lastmodify: '2011.04.06'
};

var starfish = org.shen.Starfish;

// ----------------------------------------- //

// 改造内置方法
	
/**
 * document.getElementById()
 */
var $ = function(_id) {
	if (type(_id) != "object") {
		return document.getElementById(_id);
	} else {
		return _id;
	}
};

/**
 * x.getElementsByTagName()
 * @param {object} elem   元素 默认为document
 * @param {string} name   tag名称
 *
 * @return {array}         具有tag名称的元素数组
 */
var $$ = function(elem, name) {
    return (elem || document).getElementsByTagName(name);
};

/**
 * x.getElementsByName
 * @param {object} elem  元素 默认为document
 * @param {string} name  元素name属性的值
 */
var $n = function(elem, name) {
    return (elem || document).getElementsByName(name);
}

/**
 * window.setTimeout支持传递Object
 * 
 * @param {func} 	fn	    要执行的方程
 * @param {int} 	mDelay	时间间隔
 * 
 * @return {func}
 */
var delay = function(fn, mDelay) {
	var st = window.setTimeout;
	if (type(fn) == 'function') {
		var args = Array.prototype.slice.call(arguments, 2);
		var f = function() {
			fn.apply(null, args);
		};
		return st(f, mDelay);
	}
	return st(fn, mDelay);
};

/**
 * 返回对象的类型	此方法替换typeof 因为Object.toString()返回'[object class]'形式
 * 
 * @param {object} o	待检验的对象
 *
 * @return {string}		o的类型
 */
var type = function(o) {
	var _t;
	return ((_t = typeof(o)) == "object" ? o == null && "null" ||
		Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
};
