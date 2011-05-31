/**
 * 分页栏
 * @param {object}  obj     要分页的数据
 * @param {element/string}  id    元素/元素id
 * @param {string}  func    翻页调用的方法名称
 * @param {int}     pp      每页个数 默认10 (可选)
 * @param {int}     cp      当前页数 默认1  (可选)
 * 使用:
 *      数据一般是从ajax返回的responseText或json.
 *      var result = responseText / eval(json); json是数组形式 [{...}, {...}, {...}]
 *      var length = result.split("xxx") / result.length;
 *      var page = new starfish.toolkit.page(result, "element", callback, 10, 1);
 *
 *      function callback(n) {
 *          page.cp = n;
 *          ...
 *          page.pagediv();
 *      }
 *
 * 需要: sf_web_dom.js
 */
starfish.toolkit.page = function(obj, id, fun, pp, cp) {
    this.elem = $(id);
    this.data = obj;
    this.total = obj.length; // 数据的总个数
    this.fun = fun;          // 翻页调用的方法名称
    this.pp = pp || 10;      // 每页个数
    this.cp = cp || 1;       // 当前页数
    this.tp = Math.floor((this.total + this.pp - 1) / this.pp); // 总页数
};

starfish.toolkit.page.prototype.paging = function() {
    var pp = this.pp;
    var cp = this.cp;
    if (cp == 0) {
        cp = 1;
    }
    var total = this.total; // 数据的总个数
    var tp = Math.floor((total + pp - 1) / pp); // 总页数
    var fun = this.fun; // 翻页调用的方法

    var strHtml = '', prevPage = cp - 1, nextPage = cp + 1, endPage;
    strHtml += '<span class="count">' + cp + ' / ' + tp + ' (' + total + ')' + '</span>';
    strHtml += '<span class="number">';
    if (prevPage < 1) {
        strHtml += '<span title="第 1 页">&#171;</span>';
        strHtml += '<span title="前一页">&#139;</span>';
    } else {
        strHtml += '<span title="第 1 页"><a href="javascript:' + fun + '(1);">&#171;</a></span>';
        strHtml += '<span title="前一页"><a href="javascript:' + fun + '(' + prevPage + ');">&#139;</a></span>';
    }

    if (cp != 1) {
        strHtml += '<span title="第 1 页"><a href="javascript:' + fun + '(1);">1</a></span>';
    }

    if (cp >= 4) {
        strHtml += '<span>...</span>';
    }

    if (tp > cp + 1) {
        endPage = cp + 1;
    } else {
        endPage = tp;
    }
    for (var i = cp - 1; i <= endPage; i++) {
        if (i > 0) {
            if (i == cp) {
                strHtml += '<span title="第 ' + i + ' 页"><s>' + i + '</s></span>';
            } else {
                if (i != 1 && i != tp) {
                    strHtml += '<span title="第 ' + i + ' 页"><a href="javascript:' + fun + '(' + i + ');">' + i + '</a></span>';
                }
            }
        }
    }
    if (cp + 2 < tp) {
        strHtml += '<span>...</span>';
    }
    if (cp != tp) {
        strHtml += '<span title="第 ' + tp + ' 页"><a href="javascript:' + fun + '(' + tp + ');">' + tp + '</a></span>';
    }

    if (nextPage > tp) {
        strHtml += '<span title="下一页">&#155;</span>';
        strHtml += '<span title="最后一页">&#187;</span>';
    } else {
        strHtml += '<span title="下一页"><a href="javascript:' + fun + '(' + nextPage + ');">&#155;</a></span>';
        strHtml += '<span title="最后一页"><a href="javascript:' + fun + '(' + tp + ');">&#187;</a></span>';
    }

    strHtml += '</span><br />';
    return strHtml;
};

/**
 * 构建page div
 */
starfish.toolkit.page.prototype.pagediv = function() {
    var div_page = starfish.web.dom.elem('div');
    div_page.id = this.elem.id + "_pages";
    div_page.className = "pages";

    div_page.innerHTML = this.paging();
    this.elem.appendChild(div_page);
};
