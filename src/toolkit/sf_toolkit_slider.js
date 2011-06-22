/**
 * slider
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module slider
 */
starfish.toolkit.slider = function() {
    var web = starfish.web;
    /**
     * @method slider
     * @constructor
     * @param {String}  name     对象的名称
     * @param {Object}  options  选项
     *      options {
                id: 'slider',           // {String} Id
                auto: 4,                // {int} 间隔几秒自动翻动 或设置为'false'不自动
                resume: false,          // {Boolean} 暂停后是否自动翻动
                vertical: false,        // {Boolean} 翻动方向
                navid: 'pagination',    // {String} pagination的Id
                activeclass: 'current', // {String} 当前pagination的样式
                position: 0,            // {int} 初始化索引
                rewind: false,          // toggle "rewinding", else the slides will be continuous
                elastic: true,          // {Boolean} 翻动效果
                left: 'slideleft',      // {String} 向左nav的Id
                right: 'slideright'     // {String} 向右nav的Id
                height: 235,
                width: 558
            }
     */
    function slider(name, options) {
        this.name = name;
        this.init(options);
    }

    slider.prototype = {
        /**
         * @method init
         * @param {Object}  options  选项
         */
        init: function(options) {
            var s = this.x = $(options.id), u = this.u = $$(s, 'ul')[0],
                    c = this.m = $$(u, 'li'), l = c.length, i = this.l = this.c = 0;
            this.b = 1;
            if (options.navid && options.activeclass) {
                this.g = $$($(options.navid), 'li');
                this.s = options.activeclass;
            }
            this.a = options.auto || 0;
            this.p = options.resume || 0;
            this.r = options.rewind || 0;
            this.e = options.elastic || false;
            this.vertical = options.vertical || 0;
            
            web.css(s, 'overflow', 'hidden');
            for (i; i < l; i++) {
                if (c[i].parentNode == u) {
                    this.l++;
                }
            }

            if (this.vertical) {
                web.css(u, 'top', '0');
                this.h = options.height || c[0].offsetHeight;
                web.css(u, 'height', (this.l * this.h) + 'px');
            } else {
                web.css(u, 'left', '0');
                this.w = options.width || c[0].offsetWidth;
                web.css(u, 'width', (this.l * this.w) + 'px');
            }

            this.nav(options.position || 0);

            if (options.position) {
                this.pos(options.position || 0, this.a ? 1 : 0, 1)
            } else if (this.a) {
                this.auto();
            }
            
            if (options.left) {
                this.sel(options.left);
            }
            if (options.right) {
                this.sel(options.right);
            }
        },
        
        auto: function() {
            this.x.ai = setInterval(new Function(this.name + '.move(1,1,1)'), this.a * 1000);
        },

        move: function(d, a) {
            var n = this.c + d;
            if (this.r) {
                n = d == 1 ? n == this.l ? 0 : n : n < 0 ? this.l - 1 : n;
            }
            this.pos(n, a, 1);
        },

        pos: function(p, a, m) {
            var v = p;
            clearInterval(this.x.ai);
            clearInterval(this.x.si);
            if (!this.r) {
                if (m) {
                    if (p == -1 || (p != 0 && Math.abs(p) % this.l == 0)) {
                        this.b++;
                        for (var i = 0; i < this.l; i++) {
                            this.u.appendChild(this.m[i].cloneNode(1));
                        }
                        this.vertical ? this.u.style.height = (this.l * this.h * this.b) + 'px' : this.u.style.width = (this.l * this.w * this.b) + 'px';
                    }
                    if (p == -1 || (p < 0 && Math.abs(p) % this.l == 0)) {
                        this.vertical ? this.u.style.top = (this.l * this.h * -1) + 'px' : this.u.style.left = (this.l * this.w * -1) + 'px';
                        v = this.l - 1;
                    }
                } else if (this.c > this.l && this.b > 1) {
                    v = (this.l * (this.b - 1)) + p;
                    p = v;
                }
            }
            var t = this.vertical ? v * this.h * -1 : v * this.w * -1, d = p < this.c ? -1 : 1;
            this.c = v;
            var n = this.c % this.l;
            this.nav(n);
            if (this.e) {
                t = t - (8 * d);
            }
            this.x.si = setInterval(new Function(this.name + '.slider(' + t + ',' + d + ',1,' + a + ')'), 10);
        },

        nav: function(n) {
            if (this.g) {
                for (var i = 0; i < this.l; i++) {
                    this.g[i].className = i == n ? this.s : '';
                }
            }
        },

        slider: function(t, d, i, a) {
            var o = this.vertical ? parseInt(this.u.style.top) : parseInt(this.u.style.left);
            if (o == t) {
                clearInterval(this.x.si);
                if (this.e && i < 3) {
                    this.x.si = setInterval(new Function(this.name + '.slider(' + (i == 1 ? t + (12 * d) : t + (4 * d)) + ',' + (i == 1 ? (-1 * d) : (-1 * d)) + ',' + (i == 1 ? 2 : 3) + ',' + a + ')'), 10);
                } else {
                    if (a || (this.a && this.p)) {
                        this.auto();
                    }
                    if (this.b > 1 && this.c % this.l == 0) {
                        this.clear();
                    }
                }
            } else {
                var v = o - Math.ceil(Math.abs(t - o) * .1) * d + 'px';
                this.vertical ? this.u.style.top = v : this.u.style.left = v;
            }
        },

        clear: function() {
            var c = $$(this.u, 'li'), t = i = c.length;
            this.vertical ? this.u.style.top = 0 : this.u.style.left = 0;
            this.b = 1;
            this.c = 0;
            for (i; i > 0; i--) {
                var e = c[i - 1];
                if (t > this.l && e.parentNode == this.u) {
                    this.u.removeChild(e);
                    t--;
                }
            }
        },

        sel: function(i) {
            var e = $(i);
            e.onselectstart = e.onmousedown = function() {
                return false;
            }
        }
    };

    return slider;
}();
