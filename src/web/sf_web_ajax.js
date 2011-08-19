/**
 * AJAX
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module ajax
 */
starfish.web.ajax = {
    /**
     * 创建并返回一个新的XMLHttpRequest对象  如果浏览器不支持XMLHttpRequest,则引发异常
     *
     * @method newRequest
     * @return {Object}   XMLHttpRequest对象
     */
    newRequest: function() {
        var request;
        if (typeof XMLHttpRequest == "undefined") {
            request = new ActiveXObject(
                navigator.userAgent.indexOf("MSIE 5") >= 0 ?
                    "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
            );
        } else {
            request = new XMLHttpRequest();
        }
        return request;
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送GET请求
     * 以 字符串 的型式返回响应,并传送给callback引用的方法
     *
     * @method getText
     * @param {String}    url       请求url
     * @param {Function}  callback  回调函数
     */
    getText: function(url, callback) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
        request.open("GET", url);
        request.send(null);
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送GET请求
     * 以 XML 的型式返回响应,并传送给callback引用的方法
     *
     * @method getXML
     * @param {String}    url          请求url
     * @param {Function}  callback     回调函数
     */
    getXML: function(url, callback) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseXML);
            }
        };
        request.open("GET", url);
        request.send(null);
    },

    /**
     * 向指定的url发送GET请求,并提供了请求过期的处理方法
     *
     * @method get
     * @param {String}      url         请求url
     * @param {Function}    callback    回调函数
     * @param {Object}  options
     *        包含:
     *            timeout - 过期时间
     *            errorHandler - 错误回调方法
     *            progressHandler - 在request.readyState的值为4前的处理方法
     *            parameters - 包含对象的属性 名称/值 的参数对象 将传递给encodeFormData方法
     *                         转换为字符串后,成为url的'?'后参数等属性的对象
     **/
    get: function(url, callback, options) {
        var request = starfish.web.ajax.newRequest();
        var n = 0;
        var timer;
        if (options.timeout) {
            timer = setTimeout(function() {
                request.abort();
                if (options.timeoutHandler) {
                    options.timeoutHandler(url);
                }
            }, options.timeout);
        }
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (timer) {
                    clearTimeout(timer);
                }
                if (request.status == 200) {
                    callback(starfish.web.ajax._getResponse(request));
                } else {
                    if (options.errorHandler) {
                        options.errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            } else if (options.progressHandler) {
                options.progressHandler(++n);
            }
        };

        var target = url;
        if (options.parameters) {
            target += "?" + starfish.web.ajax._encodeFormData(options.parameters);
        }
        request.open("GET", target);
        request.send(null);
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送POST请求
     * 使用 名称/值 为属性的values对象作为请求的请求体
     * 根据服务器响应的类型(调用_getResponse方法)传递给回调函数
     * 如果出现错误
     *         - 指定了errorHandler方法,则调用该方法
     *         - 否则向callback回调函数传递null
     *
     * @method post
     * @param {String}    url             请求url
     * @param {Object}    values          请求体名称/值为属性的对象
     * @param {Function}  callback        成功处理回调函数
     * @param {Function}  errorHandler    错误处理回调函数
     **/
    post: function(url, values, callback, errorHandler) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    callback(starfish.web.ajax._getResponse(request));
                } else {
                    if (errorHandler) {
                        errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            }
        };

        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 编码对象的属性
        request.send(starfish.web.ajax._encodeFormData(values));
    },

    /**
     * 使用XMLHttpRequest对象,向指定的url发送HEAD请求
     *
     * - 如果成功返回响应,则调用parseHeaders方法解析(见下面的parseHeaders方法),并把解析结果的
     *      对象传给回调方法callback,callback的参数是parseHeaders方法的返回值.
     *
     * - 如果不成功
     *         当指定了errorHandler方法时,则调用该方法
     *         没有指定errorHandler方法时,则传入null值到callback回调方法
     *
     * @method getHeaders
     * @param {String}      url              请求url
     * @param {Function}    callback         成功处理回调函数
     * @param {Function}    errorHandler     错误处理回调函数
     */
    getHeaders: function(url, callback, errorHandler) {
        var request = starfish.web.ajax.newRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    callback(starfish.web.ajax._parseHeaders(request));
                }
                else {
                    if (errorHandler) {
                        errorHandler(request.status, request.statusText);
                    } else {
                        callback(null);
                    }
                }
            }
        };
        request.open("HEAD", url);
        request.send(null);
    },

    /**
     * 把对象的属性 名称/值 转换为一个字符串的形式.
     *
     * @private
     * @method _encodeFormData
     * @param {Object}    data    名称/值为属性的对象
     * @return {String} 字符串
     */
    _encodeFormData: function(data) {
        var pairs = [];
        var regexp = /%20/g;
        for (var name in data) {
            var value = data[name].toString();
            // 替换 空格(%20) 为 "+"
            var pair = encodeURIComponent(name).replace(regexp, "+") + '=' +
                encodeURIComponent(value).replace(regexp, "+");
            pairs.push(pair);
        }
        return pairs.join('&');
    },

    /**
     * 根据HTTP响应的类型(Content-Type) 返回响应的内容
     *
     * @private
     * @method _getResponse
     * @param {Object}    request    XMLHttpRequest对象
     */
    _getResponse: function(request) {
        switch (request.getResponseHeader("Content-Type")) {
            case "text/xml":
                return request.responseXML;
            case "text/json":
            case "application/json":
            case "text/javascript":
            case "application/javascript":
            case "application/x-javascript":
                return eval(request.responseText);
            default:
                return request.responseText;
        }
    },

    /**
     * 请求服务器返回一个给定url的头部,而不返回该url的内容
     * 该方法解析HTTP头部的一对名字/值并将它们存储为一个对象的属性及其值
     *
     * @private
     * @method _parseHeaders
     * @param {Object}    request  XMLHttpRequest对象
     * @return {Object} 一个对象
     */
    _parseHeaders: function(request) {
        // 服务端返回的字符串
        var headerText = request.getAllResponseHeaders();
        var headers = {};
        var exp = /^\s*|\s*$/;

        var lines = headerText.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.length == 0) {
                continue; // 跳过空行
            }
            var pos = line.indexOf(':');
            var name = line.substring(0, pos).replace(exp, "");
            headers[name] = line.substring(pos + 1).replace(exp, "");
        }
        return headers;
    }

};
