/**
 * web: document
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module dom
 * @requires event
 * 
 */
starfish.web.dom = {
	/**
	 * 判断文档是否加载完毕
	 * 
	 * @param {Function} 	func	要执行的函数
	 *
     * @method org.shen.Starfish.web.dom.domReady
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
	 * @param {Element}  elem	指定的元素
	 * 
	 * @return {Element} 前一个元素
     *
     * @method org.shen.Starfish.web.dom.prev
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
	 * @param {Element}   elem	指定的元素
	 * 
	 * @return {Element}  下一个元素
     *
     * @method org.shen.Starfish.web.dom.next
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
	 * @param {Element}   elem	指定的元素
	 *
	 * @return {Element}  第一个元素
     *
     * @method org.shen.Starfish.web.dom.first
	 */
	first: function(elem) {
		elem = elem.firstChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.next(elem) : elem;
	},

	/**
	 * 得到指定元素的子元素中最后一个元素
	 * 
	 * @param {Element}   elem	指定的元素
	 * 
	 * @return {Element}  最后一个元素
     *
     * @method org.shen.Starfish.web.dom.last
	 */
	last: function(elem) {
		elem = elem.lastChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.prev(elem) : elem;
	},

	/**
	 * 得到指定元素的父元素
	 * 
	 * @param {Element}  elem	指定的元素
	 * @param {int}		 num	父元素向上几级 默认为1	
	 * 
	 * @return {Element} 	父元素
     *
     * @method org.shen.Starfish.web.dom.parent
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
	 * 得到给定元素中的text
	 * 
	 * @param {Element} elem  给定元素
	 * 
	 * @return {String} 元素中的text
     *
     * @method org.shen.Starfish.web.dom.text
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
     * @param {String}   lab  元素类型字符串
     *
     * @return {Element}    创建的元素
     *
     * @method org.shen.Starfish.web.dom.elem
     */
    elem: function(lab) {
        return document.createElement(lab);
    }

};

// 为IE添加Node常量
if (!window.Node) {
	Node = {
		ELEMENT_NODE: 1,
		ATTRIBUTE_NODE: 2,
		TEXT_NODE: 3,
		COMMENT_NODE: 8,
		DOCUMENT_NODE: 9,
		DOCUMENT_FRAGMENT_NODE: 11
	};
}
