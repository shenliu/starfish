/**
 * web: document
 * 
 * 需要: sf_web_event.js
 * 
 */
starfish.web.dom = {
	/**
	 * 判断文档是否加载完毕
	 * 
	 * @param {func} 	fun		要执行的函数		
	 * @return {TypeName} 
	 */
	domReady: function(fun) {
		var web = starfish.web.dom;
		if (web.domReady.done) {
			return fun();
		}	
		if (web.domReady.timer) {
			web.domReady.ready.push(fun);
		} else {
			starfish.web.event.addEvent(window, "load", web._isDOMReady);
			web.domReady.ready = [ fun ];
			web.domReady.timer = setInterval(web._isDOMReady, 10);
		}
	},
	
	_isDOMReady: function() {
		var web = starfish.web.dom;
		if (web.domReady.done) {
			return false;
		}	
		if (document && document.getElementsByTagName && document.getElementById
				&& document.body) {
			web.domReady.done = true;
			clearInterval(web.domReady.timer);
			web.domReady.timer = null;
			for ( var i = 0; i < web.domReady.ready.length; i++) {
				web.domReady.ready[i]();
			}
			web.domReady.ready = null;
		}
	},
	
	/**
	 * 得到指定元素的前一个元素
	 * 
	 * @param {element} elem	指定的元素
	 * 
	 * @return {element} 	前一个元素
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
	 * @param {element} elem	指定的元素
	 * 
	 * @return {element} 	下一个元素
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
	 * @param {element} elem	指定的元素
	 * 
	 * @return {element} 	第一个元素
	 */
	first: function(elem) {
		elem = elem.firstChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.next(elem) : elem;
	},

	/**
	 * 得到指定元素的子元素中最后一个元素
	 * 
	 * @param {element} elem	指定的元素
	 * 
	 * @return {element} 	最后一个元素
	 */
	last: function(elem) {
		elem = elem.lastChild;
		return elem && elem.nodeType != 1 ? starfish.web.dom.prev(elem) : elem;
	},

	/**
	 * 得到指定元素的父元素
	 * 
	 * @param {element} elem	指定的元素
	 * @param {int}		 num	父元素向上几级 默认为1	
	 * 
	 * @return {element} 	父元素
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
	 * @param {element} elem  给定元素
	 * 
	 * @return {string} 元素中的text
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
     * @param {string} lab  元素类型字符串
     *
     * @return {element}    创建的元素
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
