/**
 * 兼容 IE 和 Mozilla 等浏览器的解析XML
 * 
 * 需要: sf_client.js
 * 
 */
starfish.xml = {
   /**
 	*	返回XML DOM
 	*/
	xmlDom: function() {
		if (window.ActiveXObject) {
			var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
			for (var i = 0; i < arrSignatures.length; i++) {
				try {
					var oXmlDom = new ActiveXObject(arrSignatures[i]);
					return oXmlDom;
				} catch (oError) {
					//ignore
				}
			}
			throw new Error("MSXML is not installed on your system.");
		} else if (document.implementation && document.implementation.createDocument) {
			var oXmlDom = document.implementation.createDocument("", "", null);
			oXmlDom.parseError = {
				valueOf: function() {
					return this.errorCode;
				},
				toString: function() {
					return this.errorCode.toString();
				}
			};
			oXmlDom.__initError__();
			oXmlDom.addEventListener("load", function() {
				this.__checkForErrors__();
				this.__changeReadyState__(4);
			}, false);
			return oXmlDom;
		} else {
			throw new Error("Your browser doesn't support an XML DOM object.");
		}
	},
	
	/**
	 * 异步的载入一个url指定的xml文档
	 * @param {string} 	url			xml的url
	 * @param {func} 	callback	回调函数
	 * 
	 */
	load: function(url, callback) {
	    var xmldoc = starfish.xml.xmlDom();
	
	    if (document.implementation && document.implementation.createDocument) {
	        xmldoc.onload = function() { 
	        	callback(xmldoc); 
	        };
	    } else {
	        xmldoc.onreadystatechange = function() {
	            if (xmldoc.readyState == 4) {
	            	callback(xmldoc);
	            }
	        };
	    }
	    xmldoc.load(url);
	},
		
	/**
 	* 装载字符串式的xml 返回XML DOM
 	* @param {string} text	字符串式的xml
 	* 
 	* @return {object} xml
 	*/
	parse: function(text) {
		var oXmlDom;
		if (starfish.client.browser.ie) {
			oXmlDom = starfish.xml.xmlDom();
			oXmlDom.async = false;
			oXmlDom.preserveWhiteSpace = true;
			oXmlDom.loadXML(text);
		} else {
			oXmlDom = new DOMParser().parseFromString(text, 'text/xml');
		}
		return oXmlDom;
	}
	
};

/**
 * 添加模拟IE DOM的方法
 * 为Moziila等浏览器添加兼容IE的方法
 * 
 * 初始运行！
 */
(function() {
	// 非IE
	if (!starfish.client.browser.ie) {
		Document.prototype.readyState = 0;
		Document.prototype.onreadystatechange = null;

		/**
 		* 载入xml字符串,返回XML DOM
 		* @param {string} sXml		xml字符串
 		*/
		Document.prototype.loadXML = function(sXml) {
			this.__initError__();
			this.__changeReadyState__(1);
			var oParser = new DOMParser();
			var oXmlDom = oParser.parseFromString(sXml, "text/xml");
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
			for (var i = 0; i < this.childNodes.length; i++) {
				var oNewNode = this.importNode(this.childNodes[i], true);
				this.appendChild(oNewNode);
			}
			this.__checkForErrors__();
			this.__changeReadyState__(4);
		};
		
		/**
 		* 给Element类添加selectNodes方法以模拟IE中同名方法
 		*
 		* 用法:
 		* 		var nodes = oXmlDom.documentElement.selectNodes("root/names");
 		*
 		* @param {string} sXPath	匹配模式
 		* 
 		* @return {array}
 		*/
		Element.prototype.selectNodes = function(sXPath) {
			var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

			var aNodes = new Array;

			if (oResult != null) {
				var oElement = oResult.iterateNext();
				while (oElement) {
					aNodes.push(oElement);
					oElement = oResult.iterateNext();
				}
			}

			return aNodes;
		};
		
		/**
 		* 方法同上 返回匹配模式的第一个元素
 		* @param {string} sXPath	匹配模式
 		* 	
 		* @return {element}
 		*/
		Element.prototype.selectSingleNode = function(sXPath) {
			var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

			if (oResult != null) {
				return oResult.singleNodeValue;
			} else {
				return null;
			}
		};
		/**
 		* 用于XSLT
 		* @param {object} oXslDom	XML Dom
 		*/
		Node.prototype.transformNode = function(oXslDom) {
			var oProcessor = new XSLTProcessor();
			oProcessor.importStylesheet(oXslDom);

			var oResultDom = oProcessor.transformToDocument(this);
			var sResult = oResultDom.xml;

			if (sResult.indexOf("<transformiix:result") > -1) {
				sResult = sResult.substring(sResult.indexOf(">") + 1, sResult.lastIndexOf("<"));
			}

			return sResult;
		};
		
		Document.prototype.__changeReadyState__ = function(iReadyState) {
			this.readyState = iReadyState;
			if (typeof this.onreadystatechange == "function") {
				this.onreadystatechange();
			}
		};
		
		Document.prototype.__initError__ = function() {
			this.parseError.errorCode = 0;
			this.parseError.filepos = -1;
			this.parseError.line = -1;
			this.parseError.linepos = -1;
			this.parseError.reason = null;
			this.parseError.srcText = null;
			this.parseError.url = null;
		};
		
		Document.prototype.__checkForErrors__ = function() {
			if (this.documentElement.tagName == "parsererror") {
				var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number (\d+), Column (\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;
				reError.test(this.xml);
				this.parseError.errorCode = -999999;
				this.parseError.reason = RegExp.$1;
				this.parseError.url = RegExp.$2;
				this.parseError.line = parseInt(RegExp.$3);
				this.parseError.linepos = parseInt(RegExp.$4);
				this.parseError.srcText = RegExp.$5;
			}
		};
		
		Document.prototype.__load__ = Document.prototype.load;

		Document.prototype.load = function(sURL) {
			this.__initError__();
			this.__changeReadyState__(1);
			this.__load__(sURL);
		};
		
		Node.prototype.__defineGetter__("xml", function() {
			var oSerializer = new XMLSerializer();
			return oSerializer.serializeToString(this, "text/xml");
		});
	}
	
})();
