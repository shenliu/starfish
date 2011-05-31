/**
 * 扩展String
 */

/**
 * 生成一个unique ID
 * 
 * @return {string}		UID 
 */
String.uniqueID = function() {
	var UID = Date.now();
	return (UID++).toString(36);
};

// ----------------------------------------------------- //

/**
 * 在该字符串中寻找指定的子字符串或正则表达式
 * 
 * @param {string/re} 	regex	要寻找的子字符串或正则表达式
 * @param {string} 		params	标志 i g m (可选)
 * 
 * @return {boolean} 	找到返回true,否则false
 */
String.prototype.test = function(regex, params) {
	return ((type(regex) == 'regexp') ? regex : new RegExp('' + regex, params))
			.test(this);
};

/**
 * 检查指定的字符串是否在该字符串中.
 * @param {string} 		string		要查找的字符串
 * @param {string} 		separator	要查找的字符串以separator分割(可选)
 * 
 * @return {boolean} 	找到返回true,否则false
 * 
 * 例子:
 * 
 		'a bc'.contains('bc'); // returns true
		'a b c'.contains('c', ' '); // returns true
		'a bc'.contains('b', ' '); // returns false
 * 
 */
String.prototype.contains = function(string, separator) {
	return (separator) ? (separator + this + separator).indexOf(separator
			+ string + separator) > -1 : this.indexOf(string) > -1;
};

/**
 * 删除字符串中所有的HTML标记
 * 
 * @return 	{string} 	删除标记后的字符串
 */
String.prototype.stripTags = function(str) {
	return this.replace(/<(?:.|\s)*?>/g, "");
};

/**
 * 去掉字符串两边的空白
 * 
 * @return {string} 去掉空白的字符串
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

/**
 * 去掉字符串两边和字符串内多余的空格
 * 
 * @return {string} 去掉空白的字符串
 */
String.prototype.clean = function() {
	return this.replace(/\s+/g, ' ').trim();
};

/**
 * 将字符串中的连字符的转换为camelCase字符串
 * 
 * @return 	{string}	camelCase字符串
 */
String.prototype.camelCase = function() {
	return this.replace(/-\D/g, function(match) {
		return match.charAt(1).toUpperCase();
	});
};

/**
 * 将字符串中的camelCase转换为带有连字符的字符串
 * 
 * @return {string} 	带有连字符的字符串
 */
String.prototype.hyphenate = function() {
	return this.replace(/[A-Z]/g, function(match) {
		return ('-' + match.charAt(0).toLowerCase());
	});
};

/**
 * 使字符串中每个单词的首字母大写
 * 
 * @return 	{string}	字符串
 */
String.prototype.capitalize = function() {
	return this.replace(/\b[a-z]/g, function(match) {
		return match.toUpperCase();
	});
};

/**
 * 转义字符串中的正则表达式的字符
 * 
 * @return {string} 	转义后的字符串
 * 
 * 例子:
 * 
 		'animals.sheep[1]'.escapeRegExp(); // returns 'animals\.sheep\[1\]'
 * 
 */
String.prototype.escapeRegExp = function() {
	return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};

/**
 * 解析字符串,返回包括的整数值
 * @param 	{int} 	base	进制数,默认为10 (可选)
 * 
 * @return {int}	数字,如果不能转换返回NaN 
 */
String.prototype.toInt = function(base) {
	return parseInt(this, base || 10);
};

/**
 * 解析字符串,返回包括的浮点值
 * 
 * @return {float}	浮点数,如果不能转换返回NaN 
 */
String.prototype.toFloat = function() {
	return parseFloat(this);
};

/**
 * 转换16进制颜色值到RGB.必须是'#ffffff','#fff','ffffff','fff'中的形式
 * @param {boolean} 	array	如果为true,则转换为数组
 * 
 * @return {string/array}	转换后的RGB或数组
 * 
 * 例子:
 * 
		'#123'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		'112233'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		'#112233'.hexToRgb(true); // returns [17, 34, 51]
 * 
 */
String.prototype.hexToRgb = function(array) {
	var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
	return (hex) ? hex.slice(1).hexToRgb(array) : null;
};

/**
 * 转换RGB颜色值到16进制.必须是"rgb(255, 255, 255)","rgba(255, 255, 255, 1)"中的形式
 * @param {boolean} 	array	如果为true,则转换为数组
 * 
 * @return {string/array}	转换后的16进制颜色值或数组,如果第4个参数为0,则返回transparent
 * 
 * 例子:
 * 
 		'rgb(17, 34, 51)'.rgbToHex(); // returns '#112233'
		'rgb(17, 34, 51)'.rgbToHex(true); // returns ['11', '22', '33']
		'rgba(17, 34, 51, 0)'.rgbToHex(); // returns 'transparent'
 * 
 */
String.prototype.rgbToHex = function(array) {
	var rgb = this.match(/\d{1,3}/g);
	return (rgb) ? rgb.rgbToHex(array) : null;
};

/**
 * 用对象中的键值对替换字符串中匹配regexp的部分
 * @param {object}  	object	键值对对象
 * @param {regexp} 		regexp	要替换的正则表达式.默认为/\?{([^}]+)}/g	
 * 
 * @return {string}		替换的字符串
 * 
 * 例子:
 * 
 		var myString = '{subject} is {property_1} and {property_2}.';
		var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'saviour'};
		myString.substitute(myObject); // returns 'Jack Bauer is our lord and saviour'
 * 
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
 * @param {string} 		key	指定的key
 * 
 * @return {string} 	key对应的值.如无对应值,返回"".
 * 
 * 例子:
 * 
 		a=111&b=222&c=333&d=444
  		key=b 返回 222
 * 
 */
String.prototype.getParamter = function(key) {
	if (key == "") {
		return "";
	}
	return new RegExp(key + "=([^&]+)", "gi").test(this) ? RegExp.$1 : "";
};
