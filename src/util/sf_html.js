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
    },

    /**
     * 合并单元格方法
     * @param tb        要合并单元格的表格
     * @param startCol  开始合并列
     * @param endCol    结束合并列
     * @param bool      合并方式(true:startCol与endCol之间合并;false:两边和并)
     * @param num       标记列(防止某些信息因为内容相同而合并.eg:姓名相同而编号不同的两个人)
     */
    uniteTable: function(tb, startCol, endCol, bool, num) {
        var end;
        var i = 0, j = 0;
        var rowCount = tb.rows.length;         //  行数
        var colCount = tb.rows[0].cells.length; // 列数
        var obj1 = null, obj2 = null;
        var n = 5;
        var count = [];
        for (i = 0; i < rowCount; i++) {
            for (j = 0; j < colCount; j++) {
                tb.rows[i].cells[j].id = "tb__" + i + "_" + j;
            }
        }
        //合并标记列，防止某些信息因为内容相同而合并（不需要时，可以不用传值）
        if (typeof(num) != 'undefined') {
            obj1 = $("tb__0_" + (num - 1));
            for (var t = 1; t < rowCount; t++) {
                obj2 = $("tb__" + t + "_" + (num - 1));
                if (obj1.innerHTML == obj2.innerHTML) {
                    obj1.rowSpan++;
                    obj2.parentNode.removeChild(obj2);
                } else {
                    count[t] = n;//当第一个人的名称合并结束时，给count[t]赋值做标记
                    obj1 = $("tb__" + t + "_" + (num - 1));
                }
            }

        }
        //如果endCol未定义，代码将最终一列定义为endCol
        //  if(typeof(endCol)=='undefined'){end=colCount;}else{end=endCol}
        for (i = 0; i < colCount; i++) {
            //bool:合并方式，true代表两边合并；false代表中间合并
            if (bool) {
                if (i + 1 < startCol || i + 1 > endCol) {
                    continue;
                }
            } else {
                if (i + 1 > startCol && i + 1 < endCol) {
                    continue;
                }
            }
            obj1 = $("tb__0_" + i);
            for (j = 1; j < rowCount; j++) {
                obj2 = $("tb__" + j + "_" + i);
                if (typeof(count[j]) != 'undefined') {
                    if (count[j] != n) {
                        if (obj1.innerHTML == obj2.innerHTML) {
                            obj1.rowSpan++;
                            obj2.parentNode.removeChild(obj2);
                        }
                        else {
                            obj1 = $("tb__" + j + "_" + i);
                        }
                    } else {
                        obj1 = $("tb__" + j + "_" + i);
                    }
                }
                else {
                    if (obj1.innerHTML == obj2.innerHTML) {
                        obj1.rowSpan++;
                        obj2.parentNode.removeChild(obj2);
                    }
                    else {
                        obj1 = $("tb__" + j + "_" + i);
                    }
                }
            }
        }
    }

};
