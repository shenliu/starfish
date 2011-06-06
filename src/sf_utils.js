/**
 * 实用工具
 * 补充语言中没有的方法
 *
 * @namespace org.shen.Starfish
 * @module utils
 */
starfish.utils = {
    /**
     * 修复IE 6.0下PNG不透明的Bug
     * 使用前先确定客户端浏览器为IE 6.0 使用sf.client.browser.ie == 6
     *
     * @method correctPNG
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
     *
     * @method autoHeightIframe
     * @param {Object} id  iframe id
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
    },

    /**
     * 得到<select>选择的<option>的值
     *
     * @method getSelectValue
     * @param {Element} select  <select>元素对象
     * @return <select>选择的<option>的值
     */
    getSelectValue: function(select) {
        var idx = select.selectedIndex, option, value;
        if (idx > -1) {
            option = select.options[idx];
            value = option.attributes.value;
            return (value && value.specified) ? option.value : option.text;
        }
        return null;
    }

};
