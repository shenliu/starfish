/**
 * starfish的基本类
 *
 * 命名规范：
 *         1.以"_"开头的属性或方法为 私有的或局部的
 *         2.以"$"开头或全部大写的变量为 全局变量
 *
 * @namespace org.shen.Starfish
 * @module Starfish
 */
var org;
if (!org) {
    org = {};
} else if (typeof org != "object") {
    throw new Error("包'org'已经存在,并且不是一个对象!");
}

if (!org.shen) {
    org.shen = {};
} else if (typeof org.shen != "object") {
    throw new Error("包'org.shen'已经存在,并且不是一个对象!");
}

if (org.shen.Starfish) {
    throw new Error("包'org.shen.Starfish'已经存在");
}

org.shen.Starfish = {
    author: 'shen LIU',
    email: 'bonjour.shen@gmail.com',
    organization: 'shen universal group',
    found: '2010.02.10',
    /**
     *  v.x.y
     *  v - 主版本(重大改动)
     *  x - 次版本(增加方法)
     *  y - 方法有小改动
     */
    version: '0.8.90',
    lastmodify: '2011.12.28'
};

var starfish = org.shen.Starfish;
// ----------------------------------------- //

// 改造内置方法

/**
 * 返回对象的类型    此方法替换typeof 因为Object.toString()返回'[object class]'形式
 *
 * @method type
 * @param {Object}  o   待检验的对象
 * @return {String}        o的类型
 */
var type = function(o) {
    var _t;
    return ((_t = typeof(o)) == "object" ? o == null && "null" ||
        Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
};

/**
 * document.getElementById()
 *
 * @method $
 * @param {String/Object}   _id   元素的id值或元素
 * @return {Object} 元素
 */
var $ = function(_id, isParent) {
    if (typeof(_id) != "object") {
        if (isParent) {
            return parent.document.getElementById(_id);
        }
        return document.getElementById(_id);
    } else {
        return _id;
    }
};

/**
 * x.getElementsByTagName()
 *
 * @method $$
 * @param {Object} elem   元素 默认为document
 * @param {String} name   tag名称
 * @return {Array}  具有tag名称的元素数组
 */
var $$ = function(elem, name) {
    return (elem || document).getElementsByTagName(name);
};

/**
 * document.getElementsByName
 *
 * @method $n
 * @param {Object} elem  document <这个有错误该参数无效>
 * @param {String} name  元素name属性的值
 * @return {Array}  具有name属性值的元素数组
 */
var $n = function(elem, name) {
    return document.getElementsByName(name);
};

/**
 * window.setTimeout支持传递Object
 *
 * @method delay
 * @param {Function}     func    要执行的函数
 * @param {int}         mDelay    时间间隔
 * @return {Function}  延迟执行的函数
 */
var delay = function(func, mDelay) {
    var st = window.setTimeout;
    if (type(func) == 'function') {
        var args = Array.prototype.slice.call(arguments, 2);
        var f = function() {
            func.apply(null, args);
        };
        return st(f, mDelay);
    }
    return st(func, mDelay);
};
