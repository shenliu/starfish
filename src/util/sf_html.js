/**
 * 网页程序小片段
 * 
 * @namespace org.shen.Starfish
 * @module html
 */
starfish.html = {
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
     * 提取URL中的参数 ?a=x&b=y&c=z
     *
     * @method parseParameter
     * @return {Object} 对象 其属性名为参数名 属性值为参数值
     */
    parseParameter: function() {
        var args = {};
        var query = location.search.substring(1);
        var pairs = query.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var arg_name = pairs[i].substring(0, pos);
            var arg_value = pairs[i].substring(pos + 1);
            arg_value = decodeURIComponent(arg_value);
            args[arg_name] = arg_value;
        }
        return args;
    },

    /**
     * 得到&lt;select&gt;选择的&lt;option&gt;的值
     *
     * @method getSelectValue
     * @param {Element} select  &lt;select&gt;元素对象
     * @return &lt;select&gt;选择的&lt;option&gt;的值
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
