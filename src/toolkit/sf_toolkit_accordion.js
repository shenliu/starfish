/**
 * accordion
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module accordion
 */
starfish.toolkit.accordion = function() {
    /**
     * accordion 类
     * @constructor
     * @param {String} name accordion的名称 此值要和返回的变量名一致. 如: var acc = new starfish.toolkit.accordion.accordion("acc");
     */
    function accordion(name) {
        this.name = name;
        this.accs = []; // 所有accrodion的数组
    }

    /**
     * 初始化
     *
     * @method init
     * @param {string}  id          ul的id值
     * @param {string}  capt_tag    li中caption的标签(tag) 一般为 &lt;h4&gt;
     * @param {int}     mode        0 - 不联动(可同时显示多个li) / 1 - 联动(只可以显示一个li)
     * @param {int}     n           初始要第几个li显示
     * @param {string}  cur_style   设定当前显示的li的style (可选)
     */
    accordion.prototype.init = function(id, capt_tag, mode, n, cur_style) {
        var elem = $(id), i = 0, s = 0, nodes = elem.childNodes, nodes_len = nodes.length, capt, section;
        this.cur_style = cur_style || 0;
        this.mode = mode || 0;
        for (; i < nodes_len; i++) {
            var node = nodes[i];
            if (node.nodeType != Node.TEXT_NODE /* or 3 */) { // 不是text node
                this.accs[s] = {};
                this.accs[s].capt = capt = $$(node, capt_tag)[0]; // caption <h4>
                this.accs[s].section = section = $$(node, 'div')[0]; // class="acc_section"
                capt.onclick = new Function(this.name + '.pr(0, ' + s + ')');
                if (n == s) { // 初始要第n个li显示
                    capt.className = this.cur_style;
                    section.style.height = 'auto';
                    section.status = 1; // 打开状态
                } else {
                    section.style.height = 0;
                    section.status = -1; // 关闭状态
                }
                s++;
            }
        }
        this.l = s
    };

    /**
     * 伸展/收缩
     *
     * @method pr
     * @param {int}  motion     动作代码 (-1 - 全关闭 / 1 - 全打开 / 0 - 默认)
     * @param {int}  idx        事件源的下标值(被点击的<h4>)
     */
    accordion.prototype.pr = function(motion, idx) {
        for (var i = 0; i < this.l; i++) {
            var capt = this.accs[i].capt, section = this.accs[i].section, height = section.style.height;
            height = height == 'auto' ? 1 : parseInt(height);
            clearInterval(section.time);
            if ((height != 1 && section.status == -1) && (motion == 1 || i == idx)) {
                section.style.height = '';
                section.height = section.offsetHeight;
                section.style.height = height + 'px';
                section.status = 1;
                capt.className = this.cur_style;
                su(section, 1);
            } else if (height > 0 && (motion == -1 || this.mode || i == idx)) {
                section.status = -1;
                capt.className = '';
                su(section, -1);
            }
        }
    };

    function su(section) {
        section.time = setInterval(function() {
            sl(section);
        }, 20);
    }

    function sl(section) {
        var h = section.offsetHeight, status = section.status == 1 ? section.height - h : h;
        section.style.height = h + (Math.ceil(status / 5) * section.status) + 'px';
        starfish.web.setOpacity(section, h / section.height * 100);
        if ((section.status == 1 && h >= section.height) || (section.status != 1 && h == 1)) {
            if (section.status == 1) {
                section.style.height = 'auto';
            }
            clearInterval(section.time);
        }
    }

    return accordion;
}();
