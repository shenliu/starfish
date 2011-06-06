/**
 * url参数方法
 *
 * @namespace org.shen.Starfish
 * @module url
 */
starfish.url = {
    /**
     * 提取URL中的参数 ?a=x&b=y&c=z
     *
     * @method parseParam
     * @return {Object} 对象 其属性名为参数名 属性值为参数值
     */
    parseParam: function(){
        var args = new Object();
        var query = location.search.substring(1);
        var pairs = query.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) 
                continue;
            var arg_name = pairs[i].substring(0, pos);
            var arg_value = pairs[i].substring(pos + 1);
            arg_value = decodeURIComponent(arg_value);
            args[arg_name] = arg_value;
        }
        return args;
    },
    
	/**
	 * 提取对象中的属性 返回其字符串型式
	 *
	 * @method parseObject
	 * @param {Object} obj	包含属性的对象
	 * @return {String} 字符串型式
     * 如:
	 * 		obj = {
	 * 			a: 'x',
	 * 			b: 'y',
	 * 			c: 'z'
	 * 		}
	 * 	 返回 ==> a=x&b=y&c=z
	 */
    parseObject: function(obj){
        var arg = "";
        for (var o in obj) {
            arg += o.toString();
            arg += "=";
            arg += obj[o];
            arg += "&";
        }
        if (arg.length > 0) {
            arg = arg.substring(0, arg.length - 1);
        }
        return encodeURI(arg);
    },
    
    /**
     * 通过url中的参数名得到该参数的值
     * 在 sf_core_string.js 中也有同样作用的方法 getParam()
     *
     * @method getParameter
     * @param {String}  arg_name  参数名
     * @return {String}	 参数的值
     */
    getParameter: function(arg_name){
        var query = location.search.substring(1);
        var reg = new RegExp(arg_name + "=([^&]+)", "gi");
        return reg.test(query) ? RegExp.$1 : null;
    }
    
};
