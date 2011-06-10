/**
 * 动态表格
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module table
 * @requires Array window event dom
 */
starfish.toolkit.table = function() {
    var web = starfish.web;

    /**
     * 构造函数
     * @constructor
     * @param {String}  name  必须为'dyTable'
     * @param {String}  id  表格id
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
         totalrecid: 'totalrecords',     // {String} 所有条ID (可选)
         hoverid: 'selectedrow',         // {String} 所选条目ID (可选)
         pageddid: 'pagedropdown',       // {String} 页数下拉列表ID (可选)
         navid: 'tablenav',              // {String} Table Navigation ID (可选)
         sortcolumn: 1,                  // {int} 初始排序的列索引 (可选)
         sortdir: 1,                     // {int} 排序方向 (1 or -1)
         sum: [8],                       // {Array} 求和列索引 (可选)
         avg: [6,7,8,9],                 // {Array} 求平均列索引 (可选)
         columns: [
            {index:7, format:'%', decimals:1},
            {index:8, format:'$', decimals:0}
         ],                              // {Object} 特殊列设置 (可选)
         init: true                      // {Boolean} 初始化
     */
    function sorter(name, id, options) {
        this.name = name;
        this.id = id;
        this.options = options;
        if (this.options.init) {
            this.init();
        }
    }

    sorter.prototype = {
        /**
         * @method init
         */
        init: function() {
            this.set();
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
                        if (this.options.columns[x].index == i) {
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
                    o.innerHTML = $$(cell, 'h3')[0].innerHTML;
                    web.dom.insert(d, o);
                }
            }
            this.reset();
        },

        /**
         * @method reset
         */
        reset: function() {
            var t = this.table;
            t.t = t.rowsLen;
            for (var i = 0; i < t.rowsLen; i++) {
                t.arr[i] = {};
                t.arr[i].show = 1;
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
         * 
         * @param {int}  idx  要排序的列索引
         * @param {int}  f
         * @param {int}  z
         */
        sort: function(idx, f, z) {
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
            this.set();
            this.alt();
            if (this.options.paginate) {
                this.size(z);
            }
            this.sethover();
        },

        sethover: function() {
            if (this.options.hoverid) {
                for (var i = 0; i < this.table.rowsLen; i++) {
                    var r = this.table.rowz[i];
                    r.setAttribute('onmouseover', this.name + '.hover(' + i + ',1)');
                    r.setAttribute('onmouseout', this.name + '.hover(' + i + ',0)')
                }
            }
        },

        calc: function() {
            if (this.options.sum || this.options.avg) {
                var t = this.table, i = x = 0, f,r;
                if (!$$(t, 'tfoot')[0]) {
                    f = document.createElement('tfoot');
                    t.appendChild(f)
                } else {
                    f = $$(t, 'tfoot')[0];
                    while (f.hasChildNodes()) {
                        f.removeChild(f.firstChild)
                    }
                }
                if (this.options.sum) {
                    r = this.newrow(f);
                    for (i; i < t.colsLen; i++) {
                        var j = r.cells[i];
                        if (this.options.sum.contains(i)) {
                            var s = 0, m = t.columns[i].format || '';
                            for (x = 0; x < this.table.rowsLen; x++) {
                                if (t.arr[x].show) {
                                    s += parseFloat(t.rowz[x].cells[i].innerHTML.replace(/(\$|\,)/g, ''))
                                }
                            }
                            s = decimals(s, t.columns[i].decimals ? t.columns[i].decimals : 2);
                            s = isNaN(s) ? 'n/a' : m == '$' ? s = s.currency(t.columns[i].decimals) : s + m;
                            r.cells[i].innerHTML = s
                        } else {
                            r.cells[i].innerHTML = '&nbsp;'
                        }
                    }
                }
                if (this.options.avg) {
                    r = this.newrow(f);
                    for (i = 0; i < t.colsLen; i++) {
                        var j = r.cells[i];
                        if (this.options.avg.contains(i)) {
                            var s = c = 0, m = t.columns[i].format || '';
                            for (x = 0; x < this.table.rowsLen; x++) {
                                if (t.arr[x].show) {
                                    s += parseFloat(t.rowz[x].cells[i].innerHTML.replace(/(\$|\,)/g, ''));
                                    c++
                                }
                            }
                            s = decimals(s / c, t.columns[i].decimals ? t.columns[i].decimals : 2);
                            s = isNaN(s) ? 'n/a' : m == '$' ? s = s.currency(t.columns[i].decimals) : s + m;
                            j.innerHTML = s
                        } else {
                            j.innerHTML = '&nbsp;'
                        }
                    }
                }
            }
        },

        newrow: function(p) {
            var r = document.createElement('tr'), i = 0;
            p.appendChild(r);
            for (i; i < this.table.colsLen; i++) {
                r.appendChild(document.createElement('td'))
            }
            return r;
        },

        alt: function() {
            var t = this.table, i = x = 0;
            for (i; i < t.rowsLen; i++) {
                var r = t.rowz[i];
                if (t.arr[i].show) {
                    r.className = x % 2 == 0 ? this.options.evenclass : this.options.oddclass;
                    var cells = $$(r, 'td');
                    for (var z = 0; z < t.colsLen; z++) {
                        cells[z].className = t.idx == z ? x % 2 == 0 ? this.options.evenselclass : this.options.oddselclass : ''
                    }
                    x++
                }
                if (!t.arr[i].show) {
                    r.style.display = 'none';
                }
            }
        },

        page: function(s) {
            var t = this.table, i = x = 0, l = s + parseInt(this.options.size);
            if (this.options.totalrecid) {
                $(this.options.totalrecid).innerHTML = t.t
            }
            if (this.options.currentid) {
                $(this.options.currentid).innerHTML = this.g
            }
            if (this.options.startingrecid) {
                var b = ((this.g - 1) * this.options.size) + 1, m = b + (this.options.size - 1);
                m = m < t.rowsLen ? m : t.t;
                m = m < t.t ? m : t.t;
                $(this.options.startingrecid).innerHTML = t.t == 0 ? 0 : b;
                $(this.options.endingrecid).innerHTML = m
            }
            for (i; i < t.rowsLen; i++) {
                var r = t.rowz[i];
                if (t.arr[i].show) {
                    r.style.display = x >= s && x < l ? '' : 'none';
                    x++
                } else {
                    r.style.display = 'none'
                }
            }
        },

        move: function(d, m) {
            this.goto(d == 1 ? (m ? this.d : this.g + 1) : (m ? 1 : this.g - 1))
        },

        goto: function(s) {
            if (s <= this.d && s > 0) {
                this.g = s;
                this.page((s - 1) * this.options.size)
            }
        },

        size: function(s) {
            var t = this.table;
            if (s) {
                this.options.size = s;
            }
            this.g = 1;
            this.d = Math.ceil(this.table.t / this.options.size);
            if (this.options.navid) {
                $(this.options.navid).style.display = this.d < 2 ? 'none' : 'block';
            }
            this.page(0);
            if (this.options.totalid) {
                $(this.options.totalid).innerHTML = t.t == 0 ? 1 : this.d;
            }
            if (this.options.pageddid) {
                var d = $(this.options.pageddid), l = this.d + 1;
                d.setAttribute('onchange', this.name + '.goto(this.value)');
                while (d.hasChildNodes()) {
                    d.removeChild(d.firstChild)
                }
                for (var i = 1; i <= this.d; i++) {
                    var o = document.createElement('option');
                    o.value = i;
                    o.innerHTML = i;
                    d.appendChild(o);
                }
            }
        },

        showall: function() {
            this.size(this.table.t);
        },

        search: function(f) {
            var i = x = n = 0, k = -1, q = $(f).value.toLowerCase();
            if (this.options.colddid) {
                k = $(this.options.colddid).value
            }
            var s = (k == -1) ? 0 : k, e = (k == -1) ? this.table.colsLen : parseInt(s) + 1;
            for (i; i < this.table.rowsLen; i++) {
                var r = this.table.rowz[i], v;
                if (q == '') {
                    v = 1
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
                this.table.arr[i].show = v;
            }
            this.table.t = n;
            if (this.options.paginate) {
                this.size();
            }
            this.calc();
            this.alt();
        },

        hover: function(i, d) {
            this.table.rowz[i].id = d ? this.options.hoverid : '';
        },

        set: function() {
            var t = $(this.id);
            t.body = $$(t, 'tbody')[0];
            t.rowz = t.body.rows;
            this.table = t;
        }
    };

    Number.prototype.currency = function(c) {
        var n = this, d = n.toFixed(c).split('.');
        d[0] = d[0].split('').reverse().join('').replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('');
        return '$' + d.join('.')
    };

    function decimals(n, d) {
        return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
    }

    function cp(f, c) {
        var g,h;
        f = g = f.val.toLowerCase();
        c = h = c.val.toLowerCase();
        var i = parseFloat(f.replace(/(\$|\,)/g, '')), n = parseFloat(c.replace(/(\$|\,)/g, ''));
        if (!isNaN(i) && !isNaN(n)) {
            g = i,h = n
        }
        i = Date.parse(f);
        n = Date.parse(c);
        if (!isNaN(i) && !isNaN(n)) {
            g = i;
            h = n
        }
        return g > h ? 1 : (g < h ? -1 : 0)
    }

    return {
        dyTable: sorter
    }
}();
