/**
 * web: 常用方法
 *
 * @namespace org.shen.Starfish
 * @module web
 */
starfish.web = {
    /**
     * 根据元素的class属性查找元素 x.getElementsByClassName()
     *
     * @method className
     * @param {String} searchClass        class属性名 如: &lt;input class="" /&gt;
     * @param {Element} node              起始查找节点(默认为document)
     * @param {String} tag                查找的元素tag(默认为*)
     * @return {Array} 包含指定class属性的元素数组
     */
    className: function(searchClass, node, tag) {
        node = node || document;
        tag = tag || "*";

        var classes = searchClass.split(" ");

        var elements = (tag === "*" && node.all) ? node.all : node
            .getElementsByTagName(tag);
        var patterns = [];
        var returnElements = [];
        var i = classes.length;
        while (--i >= 0) {
            patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
        }

        var j = elements.length;
        var current, match;
        while (--j >= 0) {
            current = elements[j];
            match = false;
            for (var k = 0, kl = patterns.length; k < kl; k++) {
                match = patterns[k].test(current.className);
                if (!match) {
                    break;
                }
            }
            if (match) {
                returnElements.push(current);
            }
        }
        returnElements.reverse(); // 翻转数组 按实际dom顺序排列
        return returnElements;
    },

    /**
     * @method clazz
     * @deprecated 使用 starfish.web.className 方法代替
     **/
    clazz: function(node, tag, searchClass) {
        return starfish.web.className(searchClass, node, tag);
    },

    /**
     * 根据给定的属性名称和一个可选的匹配值得到元素数组
     *
     * @param  {String}  att  要查找的属性名称
     * @param  {Object/String}  value  属性要匹配的值(可选)
     * @return  {Array}  包含指定att属性的元素数组
     */
    byAttr: function(att, value) {
        var results = [];

        walk(document.body, function (node) {
            var actual = node.nodeType === 1 && node.getAttribute(att);
            if (typeof actual === 'string' &&
                (actual === value || typeof value !== 'string')) {
                results.push(node);
            }
        });

        function walk(node, func) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk(node, func);
                node = node.nextSibling;
            }
        }

        return results;
    },

    /**
     * 获取/设置元素属性值
     *
     * @method attr
     * @param {Object} elem        元素对象
     * @param {String} name        属性名
     * @param {Object} value    属性值
     * @return {Object}  设置的属性值 没有此属性返回undefined
     */
    attr: function(elem, name, value) {
        if (!name || name.constructor != String) {
            return '';
        }

        // 避免javascript保留字
        name = {
            'for' : 'htmlFor',
            'class' : 'className'
        }[name] || name;

        if (value) {
            elem[name] = value;
            if (elem.setAttribute) {
                elem.setAttribute(name, value);
            }
        }
        return elem[name] || elem.getAttribute(name) || undefined;
    },

    /**
     * 得到/设置给定元素的给定style值
     *
     * @method css
     * @param {Element}     elem    给定元素
     * @param {String}      name    style名称
     * @param {String}     value    style值 赋值时提供 (可选)
     * @return {Object}     style值
     */
    css: function(elem, name, value) {
        if (value) {
            elem.style[name] = value;
        }

        if (elem.style[name]) {
            return elem.style[name];
        } else if (elem.currentStyle) { // IE
            return elem.currentStyle[name];
        } else if (document.defaultView && document.defaultView.getComputedStyle) { // W3C
            // W3C使用如'text-align'的风格代替'textAlign'
            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
            var s = document.defaultView.getComputedStyle(elem, "");
            return s && s.getPropertyValue(name);
        } else {
            return null;
        }
    },

    /**
     * 设置给定元素的一组style值 并保留原有的属性值
     *
     * @method czz
     * @param {Element}     elem    给定元素
     * @param {Object}     stylez    style属性对象
     * @return {Object}     原有的属性值对象
     */
    czz: function(elem, stylez) {
        var bak = {};
        for (var s in stylez) {
            bak[s] = starfish.web.css(elem, s);
            starfish.web.css(elem, s, stylez[s]);
        }
        return bak;
    },

    /**
     * 判断给定的元素是否具有给定的样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要判断的样式
     * @return {Boolean}  true/false
     */
    hasClass: function(elem, clazz) {
        var re = new RegExp('(^| )' + clazz + '( |$)');
        return re.test(elem.className);
    },

    /**
     * 为给定的元素添加给定的样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要添加的样式
     */
    addClass: function(elem, clazz) {
        if (!starfish.web.hasClass(elem, clazz)) {
            elem.className += ' ' + clazz;
        }
    },

    /**
     * 去除给定元素的给定样式
     * @param {Element}  elem  给定元素
     * @param {String}  clazz  要去除的样式
     */
    removeClass: function(elem, clazz) {
        var re = new RegExp('(^| )' + clazz + '( |$)');
        elem.className = elem.className.replace(re, ' ').trim();
    },

    /**
     * 使用display属性隐藏元素 并保留自身display属性的值在自建属性"__displayed__"中
     *
     * @method hide
     * @param {Element}  elem    元素
     */
    hide: function(elem) {
        var curDisplay = starfish.web.css(elem, 'display');
        if (curDisplay != 'none') {
            elem.__displayed__ = curDisplay;
        }
        starfish.web.css(elem, "display", "none");
    },

    /**
     * 使用display属性显示元素 先查看元素有没有"__displayed__"属性,如有就用其值,并删除该属性
     *
     * @method show
     * @param {Element}  elem    元素
     */
    show: function(elem) {
        starfish.web.css(elem, "display", elem.__displayed__ || 'block');
        if (elem.__displayed__) {
            elem.removeAttribute("__displayed__");
        }
    },

    /**
     * 设置元素透明度
     *
     * @method setOpacity
     * @param {Element}  elem    元素
     * @param {int}  level    透明度 (0-100 透明-不透明)
     */
    setOpacity: function(elem, level) {
        if (elem.style.filter) { // IE filters
            starfish.web.css(elem, "filter", "alpha(opacity=" + level + ")");
        } else {    // W3C opacity
            starfish.web.css(elem, "opacity", level / 100);
        }
    }

};
