/**
 * 扩展String
 *
 * @module String
 */

/**
 * 生成一个unique ID
 *
 * @static
 * @method uniqueID
 * @return {String}	 UID
 */
String.uniqueID = function() {
	var UID = Date.now();
	return (UID++).toString(36);
};

// ----------------------------------------------------- //

/**
 * 在该字符串中寻找指定的子字符串或正则表达式
 *
 * @method String.test
 * @param {String/RegExp} 	regexp	要寻找的子字符串或正则表达式
 * @param {String} 		    params	标志 i g m (可选)
 * @return {Boolean} 	找到返回true,否则返回false
 */
String.prototype.test = function(regexp, params) {
	return ((type(regexp) == 'regexp') ? regexp : new RegExp('' + regexp, params))
			.test(this);
};

/**
 * 检查指定的字符串是否在该字符串中.
 *
 * @method String.contains
 * @param {String} 	string		要查找的字符串
 * @param {String} 	separator	要查找的字符串以separator分割(可选)
 * @return {Boolean} 	找到返回true,否则返回false
 * 例子:
 		'a bc'.contains('bc'); // returns true
		'a b c'.contains('c', ' '); // returns true
		'a bc'.contains('b', ' '); // returns false
 */
String.prototype.contains = function(string, separator) {
	return (separator) ? (separator + this + separator).indexOf(separator
			+ string + separator) > -1 : this.indexOf(string) > -1;
};

/**
 * 删除该字符串中所有的HTML标记
 *
 * @method String.stripTags
 * @return 	{String} 	删除标记后的字符串
 */
String.prototype.stripTags = function() {
	return this.replace(/<(?:.|\s)*?>/g, "");
};

/**
 * 去掉该字符串两边的空白
 *
 * @method String.trim
 * @return {String} 去掉空白的字符串
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

/**
 * 去掉该字符串两边和字符串内多余的空格
 *
 * @method String.clean
 * @return {String} 去掉空白的字符串
 */
String.prototype.clean = function() {
	return this.replace(/\s+/g, ' ').trim();
};

/**
 * 将该字符串中的连字符的转换为camelCase字符串
 *
 * @method String.camelCase
 * @return 	{String}	camelCase字符串
 */
String.prototype.camelCase = function() {
	return this.replace(/-\D/g, function(match) {
		return match.charAt(1).toUpperCase();
	});
};

/**
 * 将该字符串中的camelCase转换为带有连字符的字符串
 *
 * @method String.hyphenate
 * @return {String} 	带有连字符的字符串
 */
String.prototype.hyphenate = function() {
	return this.replace(/[A-Z]/g, function(match) {
		return ('-' + match.charAt(0).toLowerCase());
	});
};

/**
 * 该字符串中每个单词的首字母大写
 *
 * @method String.capitalize
 * @return 	{String}	字符串
 */
String.prototype.capitalize = function() {
	return this.replace(/\b[a-z]/g, function(match) {
		return match.toUpperCase();
	});
};

/**
 * 转义该字符串中的正则表达式的字符
 *
 * @method String.escapeRegExp
 * @return {String} 	转义后的字符串
 * 例子:
 		'animals.sheep[1]'.escapeRegExp(); // returns 'animals\.sheep\[1\]'
 */
String.prototype.escapeRegExp = function() {
	return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};

/**
 * 判断str是否为中文
 *
 * @method String.isChinese
 * @return {Boolean}
 */
String.prototype.isChinese = function() {
    return /[\u4e00-\u9fa5]/g.test(this);
};

/**
 * 解析该字符串,返回包括的整数值
 *
 * @method String.toInt
 * @param {int}   base	进制数,默认为10 (可选)
 * @return {int}  数字,如果不能转换返回NaN
 */
String.prototype.toInt = function(base) {
	return parseInt(this, base || 10);
};

/**
 * 解析该字符串,返回包括的浮点值
 *
 * @method String.toFloat
 * @return {Number}	 浮点数,如果不能转换返回NaN
 */
String.prototype.toFloat = function() {
	return parseFloat(this);
};

/**
 * 转换16进制颜色值到RGB.必须是'#ffffff','#fff','ffffff','fff'中的形式
 *
 * @method String.hexToRgb
 * @param {Boolean} 	array	如果为true,则转换为数组
 * @return {String/Array}	转换后的RGB或数组
 * 例子:
		'#123'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		'112233'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		'#112233'.hexToRgb(true); // returns [17, 34, 51]
 */
String.prototype.hexToRgb = function(array) {
	var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
	return (hex) ? hex.slice(1).hexToRgb(array) : null;
};

/**
 * 转换RGB颜色值到16进制.必须是"rgb(255, 255, 255)","rgba(255, 255, 255, 1)"中的形式
 *
 * @method String.rgbToHex
 * @param {Boolean}  array	如果为true,则转换为数组
 * @return {String/Array}	转换后的16进制颜色值或数组,如果第4个参数为0,则返回transparent
 * 例子:
 		'rgb(17, 34, 51)'.rgbToHex(); // returns '#112233'
		'rgb(17, 34, 51)'.rgbToHex(true); // returns ['11', '22', '33']
		'rgba(17, 34, 51, 0)'.rgbToHex(); // returns 'transparent'
 */
String.prototype.rgbToHex = function(array) {
	var rgb = this.match(/\d{1,3}/g);
	return (rgb) ? rgb.rgbToHex(array) : null;
};

/**
 * 用对象中的键值对替换该字符串中匹配regexp的部分
 *
 * @method String.substitute
 * @param {Object}  object	键值对对象
 * @param {RegExp} 	regexp	要替换的正则表达式.默认为/\?{([^}]+)}/g
 * @return {String}	 替换的字符串
 * 例子:
 		var myString = '{subject} is {property_1} and {property_2}.';
		var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'saviour'};
		myString.substitute(myObject); // returns 'Jack Bauer is our lord and saviour'
 */
String.prototype.substitute = function(object, regexp) {
	return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
		if (match.charAt(0) == '\\') {
			return match.slice(1);
		}
		return (object[name] != null) ? object[name] : '';
	});
};

/**
 * 返回指定key在querystring中的值
 *
 * @method String.getParamter
 * @param {String} 	key    指定的key
 * @return {String}  key对应的值.如无对应值,返回"".
 * 例子:
 		var s = 'a=111&b=222&c=333&d=444';
  		s.getParamter('b') 返回 222
 */
String.prototype.getParamter = function(key) {
	if (key == "") {
		return "";
	}
	return new RegExp(key + "=([^&]+)", "gi").test(this) ? RegExp.$1 : "";
};
