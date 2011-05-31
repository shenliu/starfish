/**
 * 实用工具
 * 补充语言中没有的方法
 */
starfish.utils = {
	/**
 	* 修复IE 6.0下PNG不透明的Bug
 	* 使用前先确定客户端浏览器为IE 6.0 使用sf.client.browser.ie == 6
 	*/
	correctPNG: function() {
		for (var i = 0; i < document.images.length; i++) {
			var img = document.images[i];
			var imgName = img.src.toUpperCase();
			if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
				var imgID = (img.id) ? "id='" + img.id + "' " : "";
				var imgClass = (img.className) ? "class='" + img.className + "' " : "";
				var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
				var imgStyle = "display:inline-block;" + img.style.cssText;
				if (img.align == "left")
					imgStyle = "float:left;" + imgStyle;
				if (img.align == "right")
					imgStyle = "float:right;" + imgStyle;
				if (img.parentElement.href)
					imgStyle = "cursor:hand;" + imgStyle;
				var strNewHTML = "<span " + imgID + imgClass + imgTitle +
					" style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" +
					"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
					"(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
				img.outerHTML = strNewHTML;
			}
		}
	},
	/**
	 * iframe高度自适应
	 * @param {object} id  iframe id
	 */
	autoHeightIframe: function(id) {
	    var iframe = $(id);
		var idoc = iframe.contentWindow && iframe.contentWindow.document
				|| iframe.contentDocument;
		var callback = function() {
			var iheight = Math.max(parseInt(idoc.body.scrollHeight),
					parseInt(idoc.documentElement.scrollHeight));
            starfish.web.css(iframe, "height", iheight + "px");
		};
        starfish.web.event.addEvent(iframe, "load", callback);
	}

};
