/**
 *	web: event
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module event
 */
starfish.web.event = {
	/**
	 * 为每一个事件处理函数赋予一个独立ID
     *
     * @private
	 */
	_guid: 1,
	
	/**
	 * 为元素添加事件监听
	 * 
	 * @param {Element} 	element		元素
	 * @param {String} 		type		事件类型
	 * @param {Function}	handler		事件句柄(要执行的函数)
     * @param {Boolean}     useCapture  是否捕获 (默认false [bubbling方式])
	 *
     * @method org.shen.Starfish.web.event.addEvent
	 */
	addEvent: function(element, type, handler, useCapture) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, useCapture ? useCapture : false);
		} else {
			// 为每一个事件句柄赋予一个UID
			if (!handler.$$guid) {
				handler.$$guid = starfish.web.event._guid++;
			}
			
			// 为元素创建一个事件类型的散列表hash table
			if (!element.events) {
				element.events = {};
			}
			
			// 为每对元素/事件创建一个事件句柄的散列表
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				// 存储已有的事件句柄(如果已存在一个)
				if (element["on" + type]) {
					handlers[0] = element["on" + type];
				}
			}
			// 在散列表中存储事件句柄
			handlers[handler.$$guid] = handler;
			// 赋予一个全局事件句柄来处理所有工作
			element["on" + type] = starfish.web.event.handleEvent;
		}
	},
	
	/**
	 * 全局事件句柄
	 * @param {Object} 	 event	事件对象
	 * 
	 * @return {Boolean} 	执行结果
     *
     * @method org.shen.Starfish.web.event.handleEvent
	 */
	handleEvent: function(event) {
		var returnValue = true;
		// 获取事件对象(IE使用全局事件对象)
		event = starfish.web.event.fixEvent(event || ((this.ownerDocument || this.document || this).parentWindow
                || window).event);
		
		// 获取事件句柄散列表的引用 
		// 其中this指向element
		// events为addEvent中定义的element.events
		// event.type为事件类型(此处为load)
		var handlers = this.events[event.type];
		
		// 执行每个事件句柄
        for (var i in handlers) {
            if (handlers.hasOwnProperty(i)) {
                this.$$handleEvent = handlers[i];
                if (this.$$handleEvent(event) === false) {
                    returnValue = false;
                }
            }
        }
		return returnValue;
	},
	
	/**
	 * 增加IE事件对象的缺乏方法
	 * @param {Object} 	 event	事件对象
	 * 
	 * @return {Object}  事件对象
     *
     * @method org.shen.Starfish.web.event.fixEvent
	 */
	fixEvent: function(event) {
		// 添加W3C标准事件方法
		event.preventDefault = function() {
			this.returnValue = false;
		};
		event.stopPropagation = function() {
			this.cancelBubble = true;
		};
		return event;
	},
	
	/**
	 * 为元素删除事件监听
	 * 
	 * @param {Element} 	element		元素
	 * @param {String} 		type		事件类型
	 * @param {Function} 	handler		事件句柄(要执行的函数)
     * @param {Boolean}     useCapture  是否捕获 (默认false [bubbling方式])
	 *
     * @method org.shen.Starfish.web.event.removeEvent
	 */
	removeEvent: function(element, type, handler, useCapture) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, useCapture ? useCapture : false);
		} else {
			// 从散列表中删除事件句柄
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		}
	}
	
};
