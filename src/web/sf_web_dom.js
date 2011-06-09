/**
 * web: document
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module dom
 * @requires event
 */
starfish.web.dom = {
	/**
	 * 判断文档是否加载完毕
	 *
     * @method domReady
	 * @param {Function}  func	要执行的函数
	 */
	domReady: function(func) {
		var web = starfish.web;
		if (web.dom.domReady.done) {
			return func();
		}	
		if (web.dom.domReady.timer) {
			web.dom.domReady.ready.push(func);
		} else {
			web.event.addEvent(window, "load", web.dom._isDOMReady);
			web.dom.domReady.ready = [ func ];
			web.dom.domReady.timer = setInterval(web.dom._isDOMReady, 10);
		}
	},

    /**
     * @private
     */
	_isDOMReady: function() {
		var web = starfish.web;
		if (web.dom.domReady.done) {
			return false;
		}	
		if (document && document.getElementsByTagName && document.getElementById
				&& document.body) {
			web.dom.domReady.done = true;
			clearInterval(web.dom.domReady.timer);
			web.dom.domReady.timer = null;
			for (var i = 0, j = web.dom.domReady.ready.length; i < j; i++) {
				web.dom.domReady.ready[i]();
			}
			web.dom.domReady.ready = null;
		}
	},
	
	/**
	 * 得到指定元素的前一个元素
	 *
     * @method prev
	 * @param {Element}  elem	指定的元素
	 * @return {Element} 前一个元素
	 */
	prev: function(elem) {
		do {
			elem = elem.previousSibling;
		} while (elem && elem.nodeType != 1);
		return elem;
	},

	/**
	 * 得到指定元素的下一个元素
	 *
     * @method next
	 * @param {Element}   elem	指定的元素
	 * @return {Element}  下一个元素
	 */
	next: function(elem) {
		do {
			elem = elem.nextSibling;
		} while (elem && elem.nodeType != 1);
		return elem;
	},

	/**
	 * 得到指定元素的子元素中第一个元素
	 *
     * @method first
	 * @param {Element}   elem	指定的元素
	 * @return {Element}  第一个元素
	 */
	first: function(elem) {
		elem = elem.firstChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.next(elem) : elem;
	},

	/**
	 * 得到指定元素的子元素中最后一个元素
	 *
     * @method last
	 * @param {Element}   elem	指定的元素
	 * @return {Element}  最后一个元素
	 */
	last: function(elem) {
		elem = elem.lastChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.prev(elem) : elem;
	},

	/**
	 * 得到指定元素的父元素
	 *
     * @method parent
	 * @param {Element}  elem	指定的元素
	 * @param {int}		 num	父元素向上几级 默认为1	
	 * @return {Element} 	父元素
	 */
	parent: function(elem, num) {
		num = num || 1;
		for ( var i = 0; i < num; i++) {
			if (elem != null) {
				elem = elem.parentNode;
			}
		}	
		return elem;
	},

    /**
     * 把additive元素添加到elem元素的where处
     *
     * @param {Element}  elem  原有相对的元素
     * @param {Element}  additive  被添加的元素
     * @param {String}  where  添加到何处(默认为'bottom'):
     *          'before': 把additive加到elem之前 (additive和elem是兄弟节点)
     *          'after': 把additive加到elem之后 (additive和elem是兄弟节点)
     *          'bottom': 把additive添加到elem的子节点列表的末尾 (elem是additive的父节点)
     *          'top': 把additive添加到elem的子节点列表的开始 (elem是additive的父节点)
     */
    insert: function(elem, additive, where) {
        switch (where) {
            case 'before':
                var parent = elem.parentNode;
                if (parent) {
                    parent.insertBefore(additive, elem);
                }
                break;

            case 'after':
                parent = elem.parentNode;
                if (parent) {
                    parent.insertBefore(additive, elem.nextSibling);
                }
                break;

            case 'top':
                elem.insertBefore(additive, elem.firstChild);
                break;

            default: // 'bottom'
                elem.appendChild(additive);
                break;
        }
    },

	/**
	 * 得到给定元素中的text
	 *
     * @method text
	 * @param {Element}  elem  给定元素
	 * @return {String}  元素中的text
	 */
	text: function(elem) {
		var t = "";
		elem = elem.childNodes || elem;
		for ( var j = 0; j < elem.length; j++) {
			t += elem[j].nodeType != Node.ELEMENT_NODE ? elem[j].nodeValue : starfish.web.dom.text(elem[j].childNodes);
		}
		return t;
	},

    /**
     * 根据lab值创建元素
     *
     * @method elem
     * @param {String}  lab  元素类型字符串
     * @return {Element}  创建的元素
     */
    elem: function(lab) {
        return document.createElement(lab);
    },

    /**
     * 把指定字符串转化为DOM
     *
     * @param {String} html  指定的字符串
     * @return {Array}  转化的DodeList
     */
    parseDOM: function(html) {
        var div = starfish.web.dom.elem("div");
        div.innerHTML = html;
        return div.childNodes;
    },

    /**
     * 给指定元素(elem)包裹指定的元素(wrapper)
     *
     * @param {Element}  elem  要被包裹的元素
     * @param {Element/String}  wrapper  包裹的元素或元素字符串
     * @return {Element}  包裹的元素
     */
    wrap: function(elem, wrapper) {
        var dom = starfish.web.dom;
        var w_type = type(wrapper);

        if (w_type == "string") {
            var parent = dom.parent(elem);
            var wrap = dom.parseDOM(wrapper)[0];
            var removed = parent.replaceChild(wrap, elem);
            wrap.appendChild(removed);
            return wrap;
        } else if (w_type.contains("element")) {
            dom.parent(elem).appendChild(wrapper).appendChild(elem);
            return wrapper;
        } else {
            return null;
        }
    }

};

// 为IE添加Node常量
if (!window.Node) {
	window.Node = {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_FRAGMENT_NODE: 11
	};
}
