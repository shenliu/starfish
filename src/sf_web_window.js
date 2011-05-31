/**
 * web: window
 * 
 * 需要: sf_web_dom.js
 * 
 */
starfish.web.window = {
    /**
     * 得到元素的水平位置
     * @param {element}	 elem	元素
     * 
     * @return {int} 	水平位置
     * 
     */
    pageX: function(elem) {
		return elem.offsetParent ? elem.offsetLeft
				+ starfish.web.window.pageX(elem.offsetParent)
				: elem.offsetLeft;
	},
	
	/**
     * 得到元素的垂直位置
     * @param {element}	 elem	元素
     * 
     * @return {int} 	垂直位置
     * 
     */
    pageY: function(elem) {
		return elem.offsetParent ? elem.offsetTop
				+ starfish.web.window.pageY(elem.offsetParent)
				: elem.offsetTop;
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 得到元素相对于起父元素的水平位置
	 * @param {element}	 elem	元素
	 * 
	 * @return {int}	水平位置
	 * 
	 */
	parentX: function(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetLeft
				: starfish.web.window.pageX(elem)
						- starfish.web.window.pageX(elem.parentNode);
	},
	
	/**
	 * 得到元素相对于起父元素的垂直位置
	 * @param {element}	 elem	元素
	 * 
	 * @return {int}	垂直位置
	 * 
	 */
	parentY: function(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetTop
				: starfish.web.window.pageY(elem)
						- starfish.web.window.pageY(elem.parentNode);
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 得到元素左端位置
	 * @param {element}  elem  元素
	 * 
	 * @return {int} 	左端位置
	 * 
	 */
	getX: function(elem) {
		var x = starfish.web.css(elem, "left");
		if (isNaN(x)) { // 有可能得到auto值
			x = starfish.web.window.pageX(elem);
		}
		return parseInt(x);
	},
	
	/**
	 * 得到元素顶端位置
	 * @param {element}  elem	元素
	 * 
	 * @return {int} 	顶端位置
	 * 
	 */
	getY: function(elem) {
		var y = starfish.web.css(elem, "top");
		if (isNaN(y)) { // 有可能得到auto值
			y = starfish.web.window.pageY(elem);
		}
		return parseInt(y);
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 设置元素水平位置
	 * @param {element} elem  元素
	 * @param {int} 	pos	  水平数值
	 * 
	 */
	setX: function(elem, pos) {
		starfish.web.css(elem, "left", pos + "px");
	},
	
	/**
	 * 设置元素垂直位置
	 * @param {element}  elem	元素
	 * @param {int}  pos	垂直数值
	 * 
	 */
	setY: function(elem, pos) {
		starfish.web.css(elem, "top", pos + "px");
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 元素在水平位置上增加像素距离
	 * @param {element} elem  元素
	 * @param {int} 	pos	  增加的数值
	 * 
	 */
	addX: function(elem, pos) {
		var w = starfish.web.window;
		w.setX(w.getX(elem) + pos);
	},
	
	/**
	 * 元素在垂直位置上增加像素距离
	 * @param {element}  elem	元素
	 * @param {int}  pos  增加的数值
	 * 
	 */
	addY: function(elem, pos) {
		var w = starfish.web.window;
		w.setY(w.getY(elem) + pos);
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 得到元素宽度
	 * @param {element}  elem	元素
	 * 
	 * @return {int}   宽度
	 * 
	 */
	getWidth: function(elem) {
		var w = starfish.web.css(elem, 'width');
		if (w === "auto") {
			//w = starfish.web.window._autoWidth(elem);
		}
		return parseInt(w);
	},
	
	/**
	 * 得到元素高度
	 * @param {element}  elem	元素
	 * 
	 * @return {int}   高度
	 * 
	 */
	getHeight: function(elem) {
		var h = starfish.web.css(elem, 'height');
		if (h === "auto") {
			//h = starfish.web.window._autoHeight(elem);
		}
		return parseInt(h);
	},

	// -------------------------------------------------------------- //
	
	/**
	 * 得到元素完整的 可能的宽度
	 * @param {element}  elem	元素
	 * 
	 * @return {int} 	宽度
	 * 
	 */
	fullWidth: function(elem) {
		var w = starfish.web;
		// 如果元素是显示(display)的,使用offsetWidth得到宽度.
		// 如果没有offsetWidth,则使用getWidth()
		if (w.css(elem, 'display') != 'none') {
			return elem.offsetWidth || w.window.getWidth(elem);
		}
		
		// 元素为display='none'时,重置它的CSS属性
		var old = w.czz(elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		
		// 使用clientWidth得到元素完整的宽度,否则使用getWidth()
		var width = elem.clientWidth || w.window.getWidth(elem);
		
		// 恢复CSS的原有属性
		w.czz(elem, old);
		
		return width;
	},
	
	/**
	 * 得到元素完整的 可能的高度
	 * @param {element}   elem	元素
	 * 
	 * @return {int}  高度
	 * 
	 */
	fullHeight: function(elem) {
		var w = starfish.web;
		// 如果元素是显示(display)的,使用offsetHeight得到高度.
		// 如果没有offsetHeight,则使用getHeight()
		if (w.css(elem, 'display') != 'none') {
			return elem.offsetHeight || w.window.getHeight(elem);
		}
		
		// 元素为display='none'时,重置它的CSS属性
		var old = w.czz(elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		
		// 使用clientHeight得到元素完整的高度,否则使用getHeight()
		var height = elem.clientHeight || w.window.getHeight(elem);
		// 恢复CSS的原有属性
		w.czz(elem, old);
		
		return height;
	},

	// ------------------------ 鼠标事件 -------------------------------- //

	/**
	 * 得到鼠标相对于整个页面的水平位置
	 * @param {object} 	e	事件
	 * 
	 * @return {int}	水平位置
	 * 
	 */
	getX: function(e) {
		e = e || window.event;
		// W3C有pageX || IE
		return e.pageX || e.clientX + document.body.scrollLeft - document.body.clientLeft;
	},
	
	/**
	 * 得到鼠标相对于整个页面的垂直位置
	 * @param {object} 	e	事件
	 * 
	 * @return {int}	垂直位置
	 * 
	 */
	getY: function(e) {
		e = e || window.event;
		// W3C有pageY || IE
		return e.pageY || e.clientY + document.body.scrollTop - document.body.clientTop;
	},
	
	// -------------------------------------------------------------- //

	/**
	 * 得到鼠标相对于当前元素(事件对象e的target属性)的水平位置
	 * @param {object} 	e	事件
	 * 
	 * @return {int}	 相对水平位置
	 * 
	 */
	getElementX: function(e) {
        e = e || window.event;
		// W3C || IE
		return e.layerX || e.offsetX;
	},
	
	/**
	 * 得到鼠标相对于当前元素(事件对象e的target属性)的垂直位置
	 * @param {object} 	e	事件
	 * 
	 * @return {int}	 相对垂直位置
	 * 
	 */
	getElementY: function(e) {
        e = e || window.event;
		// W3C || IE
		return e.layerY || e.offsetY;
	},
	
	// ------------------------ 以下是窗口的函数 ------------------------------ //
	
	/**
     * 得到浏览器左上角在屏幕上的水平坐标 (屏幕坐标)
     * 
     * @return {int} 	水平坐标
     */
	windowX: function() {
        // W3C || IE
    	return window.screenX || window.screenLeft;
	},
	
	/**
     * 得到浏览器左上角在屏幕上的垂直坐标 (屏幕坐标)
     * 
     * @return {int} 	垂直坐标
     */
	windowY: function() {
        // W3C || IE
		return window.screenY || window.screenTop;
	},
	
	// -------------------------------------------------------------- //

	/**
	 * 得到文档document的宽度 (文档坐标)
	 * 
	 * @return {int}  宽度
	 * 
	 */
	docWidth: function() {
		var de = document.documentElement;
		return (de && de.scrollWidth) || document.body.scrollWidth;
		//return document.documentElement.clientWidth || document.body.clientWidth;
	},
	
	/**
	 * 得到文档document的高度 (文档坐标)
	 * 
	 * @return {int}  高度
	 * 
	 */
	docHeight: function() {
		var de = document.documentElement;
		return (de && de.scrollHeight) || document.body.scrollHeight;
		//return document.documentElement.clientHeight || document.body.clientHeight;
	},
	
	// -------------------------------------------------------------- //

	/**
	 * 得到浏览器滚动条的水平位置
	 * 
	 * @return {int} 	水平滚动位置
	 * 
	 */
	scrollX: function() {
		// 应用在IE6的Strict Mode方式(有DOCTYPE)
		var de = document.documentElement;
		
		// W3C pageXOffset || 根节点的左端滚动偏移量 || body元素的左端滚动偏移量
		return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
	},
	
	/**
	 * 得到浏览器滚动条的垂直位置
	 * 
	 * @return {int} 	垂直滚动位置
	 * 
	 */
	scrollY: function() {
		// 应用在IE6的Strict Mode方式(有DOCTYPE)
		var de = document.documentElement;
		
		// W3C pageYOffset || 根节点的顶端滚动偏移量 || body元素的顶端滚动偏移量
		return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
	},
	
	// -------------------------------------------------------------- //

	/**
	 * 得到视口(viewport)的宽度 随浏览器大小变动 (窗口坐标)
	 * 
	 * @return {int} 	宽度
	 * 
	 */
	vpWidth: function() {
		// 应用在IE6的Strict Mode方式(有DOCTYPE)
		var de = document.documentElement;

		// W3C innerWidth || 根节点宽度偏移量 || body元素宽度偏移量
		return	self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	},
	
	/**
	 * 得到视口(viewport)的高度 随浏览器大小变动 (窗口坐标)
	 * 
	 * @return {int} 	高度
	 * 
	 */
	vpHeight: function() {
		// 应用在IE6的Strict Mode方式(有DOCTYPE)
		var de = document.documentElement;
		
		// W3C innerHeight || 根节点高度偏移量 || body元素高度偏移量
		return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
	},
	
	// -------------------------------------------------------------- //
	
	/**
	 * 屏幕的宽度
	 * 
	 * @return {int}  宽度
	 */
	screenWidth: function() {
		return screen.width;
	},
	
	/**
	 * 屏幕的高度
	 * 
	 * @return {int}  高度
	 */
	screenHeight: function() {
		return screen.height;
	},
	
	/**
	 * 屏幕的可用宽度 
	 * 
	 * @return {int}  宽度 (一般不包括windows应用程序的快捷栏)
	 */
	screenAvailWidth: function() {
		return screen.availWidth;
	},
	
	/**
	 * 屏幕的可用高度 (一般不包括windows任务栏)
	 * 
	 * @return {int}  高度
	 */
	screenAvailHeight: function() {
		return screen.availHeight;
	}
    
};
