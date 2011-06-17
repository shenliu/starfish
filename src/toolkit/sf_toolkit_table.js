/**
 * 动态表格
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module table
 * @requires String Array timez client window event dom
 */
starfish.toolkit.table = function() {
    var web = starfish.web;
    var currency = '￥';

    /**
     * 构造函数
     * @constructor
     * @param {String}  name     名称
     * @param {String}  id       表格id
     * @param {Object}  options  选项
     *
         headclass: 'head',              // {String} 表头样式
         ascclass: 'asc',                // {String} 升序样式
         descclass: 'desc',              // {String} 降序样式
         evenclass: 'evenrow',           // {String} 偶数行样式
         oddclass: 'oddrow',             // {String} 奇数行样式
         evenselclass: 'evenselected',   // {String} Even Selected Column Class
         oddselclass: 'oddselected',     // {String} Odd Selected Column Class
         paginate: true,                 // {Boolean} 是否分页
         size: 10,                       // {int} 每页显示的条目数
         colddid: 'columns',             // {String} 筛选下拉列表ID (可选)
         currentid: 'currentpage',       // {String} 当前页ID (可选)
         totalid: 'totalpages',          // {String} 所有页ID (可选)
         startingrecid: 'startrecord',   // {String} 起始条目ID (可选)
         endingrecid: 'endrecord',       // {String} 结束条目ID (可选)
         totalrecid: 'totalrecords',     // {String} 所有条目ID (可选)
         hoverid: 'selectedrow',         // {String} 所选条目ID (可选)
         pageddid: 'pagedropdown',       // {String} 页数下拉列表ID (可选)
         navid: 'tablenav',              // {String} 翻页按钮和页数下拉列表<div>ID (可选)
         sortcolumn: 1,                  // {int} 初始排序的列索引 (可选)
         sortdir: 1,                     // {int} 排序方向 (1 or -1)
         sum: [8],                       // {Array} 求和列索引 (可选) 不考虑有'选择列复选框'的情况
         avg: [6,7,8,9],                 // {Array} 求平均列索引 (可选) 不考虑有'选择列复选框'的情况
         columns: [
            {index:7, format:'%', decimals:1},
            {index:8, format:'$', decimals:0}
         ],                              // {Object} 特殊列设置 (可选)
         selectBox: true;                // {Boolean} 是否添加 选择列复选框
         init: true                      // {Boolean} 初始化
     */
    function dyTable(name, id, options) {
        this.name = name;
        this.id = id;
        this.options = options;
        if (this.options.init) {
            this.init();
        }
    }

    dyTable.prototype = {
        /**
         * @method init
         */
        init: function() {
            this._set();
            var t = this.table, i = 0, d = 0;
            t.header = $$(t, 'tr')[0];
            t.rowsLen = t.rowz.length; // 表格的所有行数
            t.colsLen = t.rowz[0].cells.length; // 列的个数
            t.arr = []; // 数组 {show: 是否显示  val: 值  ord: 顺序}
            t.columns = []; // 特殊列数组
            this.options.size_bk = this.options.size; // 备份每页显示的条目数

            // 有筛选下拉列表
            if (this.options.colddid) {
                d = $(this.options.colddid);
                var o = web.dom.elem('option');
                o.value = -1;
                o.innerHTML = '所有列';
                web.dom.insert(d, o);
            }

            // 遍历 表头
            for (i; i < t.colsLen; i++) {
                var cell = t.header.cells[i];
                cell.setAttribute('unselectable', 'on'); // opera 不选定文本
                t.columns[i] = {};
                if (cell.className != 'nosort') {
                    cell.className = this.options.headclass;
                    web.event.addEvent(cell, "click", new Function(this.name + '.sort(' + i + ')'));
                    web.event.addEvent(cell, "mousedown", function() {return false;});
                }

                // 特殊列设置
                if (this.options.columns) {
                    var l = this.options.columns.length, x = 0;
                    for (x; x < l; x++) {
                        if (this.options.columns[x].index == i - this.isSelectBox() ? 1 : 0) {
                            var g = this.options.columns[x];
                            t.columns[i].format = g.format == null ? 1 : g.format;
                            t.columns[i].decimals = g.decimals == null ? 2 : g.decimals;
                        }
                    }
                }

                // 有筛选下拉列表 添加选项
                if (d) {
                    o = web.dom.elem('option');
                    o.value = i;
                    var h = $$(cell, 'h3');
                    if (h.length) {
                        o.innerHTML = h[0].innerHTML;
                        web.dom.insert(d, o);
                    }
                }
            }
            this.reset();
        },

        /**
         * @method _set
         */
        _set: function() {
            var t = $(this.id);
            t.body = $$(t, 'tbody')[0];
            t.rowz = t.body.rows;
            this.table = t;
        },

        /**
         * @method reset
         */
        reset: function() {
            var t = this.table;
            t.total = t.rowsLen;
            for (var i = 0; i < t.rowsLen; i++) {
                t.arr[i] = {};
                t.arr[i].show = true;
            }
            if (this.options.sortcolumn != undefined) {
                // 按照初始排序的列索引 排序
                this.sort(this.options.sortcolumn, 1, this.options.size_bk);
            } else {
                if (this.options.paginate) {  // 如果分页
                    this.size();
                }
                this.alt();
                this.sethover();
            }
            this.calc();
        },

        /**
         * @method sort
         * @param {int}  idx   要排序的列索引
         * @param {int}  f     排序方向
         * @param {int}  size  每页显示的条目
         */
        sort: function(idx, f, size) {
            var t = this.table;
            t.idx = idx;
            var x = t.header.cells[t.idx], i = 0, tbody = web.dom.elem('tbody');

            for (i; i < t.rowsLen; i++) {
                t.arr[i].ord = i;
                var v = t.rowz[i].cells[t.idx];
                web.css(t.rows[i], 'display', '');
                while (v.hasChildNodes()) {
                    v = v.firstChild;
                }
                t.arr[i].val = v.nodeValue ? v.nodeValue : '';
            }

            for (i = 0; i < t.colsLen; i++) {
                var c = t.header.cells[i];
                if (c.className != 'nosort') {
                    c.className = this.options.headclass;
                }
            }

            if (t.p == t.idx && !f) { // 在同一列上排序
                t.arr.reverse();
                x.className = t.d ? this.options.ascclass : this.options.descclass;
                t.d = !t.d;
            } else { // 在不同列上排序
                t.p = t.idx;
                f && this.options.sortdir == -1 ? t.arr.sort(cp).reverse() : t.arr.sort(cp);
                t.d = false;
                x.className = this.options.ascclass;
            }

            // 替换整个tbody
            for (i = 0; i < t.rowsLen; i++) {
                var r = t.rowz[t.arr[i].ord].cloneNode(true);
                web.dom.insert(tbody, r);
            }
            t.replaceChild(tbody, t.body);

            this._set();
            this.alt();
            if (this.options.paginate) {
                this.size(size);
            }
            this.sethover();
        },

        /**
         * 设置 鼠标在行上划过时的样式
         *
         * @method sethover
         */
        sethover: function() {
            if (this.options.hoverid) {
                for (var i = 0, l = this.table.rowsLen; i < l; i++) {
                    var r = this.table.rowz[i];
                    if (starfish.client.browser.ie != 6) {
                        web.event.addEvent(r, "mouseover", new Function(this.name + '.hover(' + i + ',true)'));
                        web.event.addEvent(r, "mouseout", new Function(this.name + '.hover(' + i + ',false)'));
                    }
                }
            }
        },

        /**
         * 设置鼠标在行上划过时的样式
         *
         * @method hover
         * @param {int}  i  行索引
         * @param {Boolean}  d  over or out?
         */
        hover: function(i, d) {
            this.table.rowz[i].id = d ? this.options.hoverid : '';
        },

        /**
         * 计算特殊列 求和及平均数
         *
         * @method calc
         */
        calc: function() {
            if (this.options.sum || this.options.avg) {
                var t = this.table, i = 0, x = 0, f, r;
                f = $$(t, 'tfoot')[0];
                if (!f) {
                    f = starfish.web.dom.elem('tfoot');
                    starfish.web.dom.insert(t, f);
                } else {
                    while (f.hasChildNodes()) {
                        f.removeChild(f.firstChild);
                    }
                }

                // 求和
                if (this.options.sum) {
                    r = this.newrow(f);
                    // 判断是否有 选择列复选框
                    var b = this.isSelectBox() ? 1 : 0;
                    var sum = this.options.sum.map(function(item, index){
                        return item + b;
                    });
                    
                    for (i; i < t.colsLen; i++) {
                        var j = r.cells[i];
                        if (sum.contains(i)) {
                            var s = 0, m = t.columns[i].format || '';
                            for (x = 0; x < this.table.rowsLen; x++) {
                                if (t.arr[x].show) {
                                    s += parseFloat(t.rowz[x].cells[i].innerHTML.replace(/(\$|,)/g, ''));
                                }
                            }
                            s = decimals(s, t.columns[i].decimals ? t.columns[i].decimals : 2);
                            r.cells[i].innerHTML = isNaN(s) ? 'n/a' : m == currency ? s = s.currency(t.columns[i].decimals) : s + m;
                        } else {
                            r.cells[i].innerHTML = '&nbsp;';
                        }
                    }
                }

                // 平均数
                if (this.options.avg) {
                    r = this.newrow(f);
                    // 判断是否有 选择列复选框
                    var avg = this.options.avg.map(function(item, index){
                        return item + b;
                    });
                    
                    for (i = 0; i < t.colsLen; i++) {
                        j = r.cells[i];
                        if (avg.contains(i)) {
                            var c = 0;
                            s = 0, m = t.columns[i].format || '';
                            for (x = 0; x < this.table.rowsLen; x++) {
                                if (t.arr[x].show) {
                                    s += parseFloat(t.rowz[x].cells[i].innerHTML.replace(/(\$|,)/g, ''));
                                    c++;
                                }
                            }
                            s = decimals(s / c, t.columns[i].decimals ? t.columns[i].decimals : 2);
                            j.innerHTML = isNaN(s) ? 'n/a' : m == currency ? s = s.currency(t.columns[i].decimals) : s + m;
                        } else {
                            j.innerHTML = '&nbsp;';
                        }
                    }
                }
            }
        },

        /**
         * 插入一行
         *
         * @method newrow
         * @param {Element}  p  在哪里插入这一行
         * @return {Element}  新插入的行
         */
        newrow: function(p) {
            var r = starfish.web.dom.elem('tr'), i = 0;
            for (i; i < this.table.colsLen; i++) {
                r.appendChild(starfish.web.dom.elem('td'));
            }
            starfish.web.dom.insert(p, r);
            return r;
        },

        /**
         * 为行列添加样式
         *
         * @method alt
         */
        alt: function() {
            var t = this.table, i = 0, x = 0;
            for (i; i < t.rowsLen; i++) {
                var row = t.rowz[i];
                if (t.arr[i].show) {
                    // 判断本行奇偶性
                    row.className = x % 2 == 0 ? this.options.evenclass : this.options.oddclass;

                    // 为排序列的每一个td加样式
                    var cells = $$(row, 'td');
                    for (var z = 0; z < t.colsLen; z++) {
                        cells[z].className = t.idx == z ? // 该cell是否为排序的列中的cell?
                                (x % 2 == 0 ? this.options.evenselclass : this.options.oddselclass) : '';
                    }
                    x++;
                } else {
                    starfish.web.css(row, 'display', 'none');
                }
            }
        },

        /**
         * @method page
         * @param {int}  s  第几页
         */
        page: function(s) {
            var t = this.table, i = 0, x = 0, l = s + parseInt(this.options.size);
            // 显示 '所有条目'
            if (this.options.totalrecid) {
                $(this.options.totalrecid).innerHTML = t.total;
            }

            // 显示 '当前页'
            if (this.options.currentid) {
                $(this.options.currentid).innerHTML = this.curPage;
            }

            // 显示 '起始条目' 和 '结束条目'
            if (this.options.startingrecid) {
                var b = ((this.curPage - 1) * this.options.size) + 1, m = b + (this.options.size - 1);
                m = m < t.total ? m : t.total;
                $(this.options.startingrecid).innerHTML = t.total == 0 ? 0 : b;
                $(this.options.endingrecid).innerHTML = m;
            }

            // 隐藏不属于本页的行
            for (i; i < t.rowsLen; i++) {
                var r = t.rowz[i];
                if (t.arr[i].show) {
                    r.style.display = x >= s && x < l ? '' : 'none';
                    x++;
                } else {
                    starfish.web.css(r, 'display', 'none');
                }
            }
        },

        /**
         * 翻页按钮和页数下拉列表
         *
         * @method size
         * @param {int}  s  每页显示的条目数
         */
        size: function(s) {
            var w = starfish.web;
            var t = this.table;
            if (s) {
                this.options.size = s;
            }
            this.curPage = 1; // 当前页数
            this.totalPages = Math.ceil(this.table.total / this.options.size); // 总页数

            this.page(0);

            // 如果总页数大于2 则显示翻页按钮和页数下拉列表 (ie6 不隐藏)
            if (this.options.navid) {
                w.css($(this.options.navid), 'display', this.totalPages < 2 && starfish.client.browser.ie != 6 ? 'none' : 'block');
            }

            // 显示'所有页'
            if (this.options.totalid) {
                $(this.options.totalid).innerHTML = t.total == 0 ? 1 : this.totalPages;
            }

            // 显示'页数下拉列表'
            if (this.options.pageddid) {
                var d = $(this.options.pageddid), l = this.totalPages + 1;
                w.event.addEvent(d, 'change', new Function(this.name + '.goto(this.value)'));
                while (d.hasChildNodes()) {
                    d.removeChild(d.firstChild);
                }
                for (var i = 1; i < l; i++) {
                    var o = w.dom.elem('option');
                    o.value = i;
                    o.innerHTML = i;
                    w.dom.insert(d, o);
                }
            }

            // 改变 '每页显示条目数下拉列表'的显示
            var perpage = $('perpage');
            for (i = 0; i < perpage.options.length; i++) {
                var cv = parseInt(perpage.options[i].value);
                if (cv > this.options.size) {
                    perpage.options[i == 0 ? 0 : i - 1].selected = true;
                    break;
                }
            }
        },

        /**
         * 显示所有行
         *
         * @method showall
         */
        showall: function() {
            this.size(this.table.total);
        },

        /**
         * 翻页
         *
         * @method move
         * @param {int}  d  1为向后  -1为向前
         * @param {Boolean}  m  true为到第一页或最后一页
         */
        move: function(d, m) {
            this.goto(d == 1 ? (m ? this.totalPages : this.curPage + 1) : (m ? 1 : this.curPage - 1))
        },

        /**
         * 翻页
         *
         * @method goto
         * @param {int}  s  翻到第几页
         */
        goto: function(s) {
            if (s > 0 && s <= this.totalPages) {
                this.curPage = s;
                this.page((s - 1) * this.options.size);
            }

            // 改变 页数下拉列表的显示
            if (this.options.pageddid) {
                var d = $(this.options.pageddid);
                for (var i = 0; i < d.options.length; i++) {
                    if (d.options[i].value == s) {
                        d.options[i].selected = true;
                        break;
                    }
                }
            }
        },

        /**
         * 筛选
         *
         * @method search
         * @param {String}  f  筛选输入框id
         */
        search: function(f) {
            var i = 0, x = 0, n = 0, k = -1, q = $(f).value.toLowerCase(); // 筛选条件

            // 筛选下拉列表
            if (this.options.colddid) {
                k = $(this.options.colddid).value;
            }
            
            var s = (k == -1) ? 0 : k, e = (k == -1) ? this.table.colsLen : parseInt(s) + 1;
            for (i; i < this.table.rowsLen; i++) {
                var r = this.table.rowz[i], v;
                if (q.trim() == '') {
                    v = 1;
                } else {
                    for (x = s; x < e; x++) {
                        var b = r.cells[x].innerHTML.toLowerCase();
                        if (b.indexOf(q) == -1) {
                            v = 0;
                        } else {
                            v = 1;
                            break;
                        }
                    }
                }
                if (v) {
                    n++;
                }
                
                this.table.arr[i].show = Boolean(v);
            }
            
            this.table.total = n;
            if (this.options.paginate) {
                this.size();
            }
            this.calc();
            this.alt();
        },

        /**
         * 是否添加 选择列复选框
         */
        isSelectBox: function() {
            return this.options.selectBox;
        }

    };

    /**
     * 为数字添加隔位符 (三位一个','),并显示为货币形式
     *
     * @method currency
     * @param {int}  c  小数位数
     * @return {String}  数字的货币表现形式
     */
    Number.prototype.currency = function(c) {
        var n = this, d = n.toFixed(c).split('.');
        d[0] = d[0].split('').reverse().join('').replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('');
        return currency + d.join('.');
    };

    /**
     * 保留小数位数
     *
     * @method decimals
     * @private
     * @param {Number}  n  要保留小数的数字
     * @param {int}  d  要保留几位
     * @return {Number}  数字
     */
    function decimals(n, d) {
        return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
    }

    /**
     * 排序方法
     *
     * @method cp
     * @param {Element}  f  比较的两个元素
     * @param {Element}  c  比较的两个元素
     */
    function cp(f, c) {
        var g, h;

        // 字符串
        f = g = f.val.toLowerCase();
        c = h = c.val.toLowerCase();

        // 日期
        var reg = /(\d{4}).{1}(\d{1,2}).{1}(\d{1,2}).?/;
        if (reg.test(f.toString()) && reg.test(c.toString())) {
            return starfish.timez.parseDateReverse(g).localeCompare(starfish.timez.parseDateReverse(h));
        }

        // 中文字符串
        if (f.isChinese() && c.isChinese()) {
            return g.localeCompare(h);
        }

        // 数字
        var i = parseFloat(f.replace(/(\$|,)/g, '')), n = parseFloat(c.replace(/(\$|,)/g, ''));
        if (!isNaN(i) && !isNaN(n)) {
            return i - n;
        }

        return g.localeCompare(h);
    }

    return dyTable;
}();

