/**
 * 提示框
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module tips
 * @requires event web dom window client
 */
starfish.toolkit.tips = function() {
    var id = 'tt';       // (string) tips ID
    var top = 3;         // (integer) tips到光标的像素高度
    var left = 3;        // (integer) tips到光标的右边像素值
    var maxw = 300;      // (integer) tips的最大宽度
    var speed = 10;      // (integer) tips透明度变化的速度
    var timer = 20;      // (integer) fade函数执行间隔
    var endalpha = 95;   // (integer) tips最终的透明度
    var alpha = 0;       // (integer) tips当前的透明度
    var tt, tt_top, tt_cont, tt_bottom, height;
    var ie = starfish.client.browser.ie ? true : false; // 是否为IE?
    var web = starfish.web;
    return {
        /**
         * @method show
         * @param  {String}  html  tips内容
         * @param  {int}  width  (可选) 宽度
         */
        show: function(html, width) {
            if (tt == null) {
                tt = web.dom.elem('div');
                tt.setAttribute('id', id);

                tt_top = web.dom.elem('div');
                tt_top.setAttribute('id', id + 'top');

                tt_cont = web.dom.elem('div');
                tt_cont.setAttribute('id', id + 'cont');

                tt_bottom = web.dom.elem('div');
                tt_bottom.setAttribute('id', id + 'bot');

                web.dom.insert(tt, tt_top);
                web.dom.insert(tt, tt_cont);
                web.dom.insert(tt, tt_bottom);
                web.dom.insert(document.body, tt);
                web.css(tt, "opacity", 0);
                web.css(tt, "filter", 'alpha(opacity=0)');
                web.event.addEvent(document, 'mousemove', this.pos);
            }
            web.css(tt, "display", 'block');
            tt_cont.innerHTML = html;
            web.css(tt, "width", width ? width + 'px' : 'auto');
            if (!width && ie) {
                web.css(tt_top, "display", 'none');
                web.css(tt_bottom, "display", 'none');
                web.css(tt, "width", tt.offsetWidth);
                web.css(tt_top, "display", 'block');
                web.css(tt_bottom, "display", 'block');
            }
            if (tt.offsetWidth > maxw) {
                web.css(tt, "width", maxw + 'px');
            }
            height = parseInt(tt.offsetHeight);
            clearInterval(tt.timer);
            tt.timer = setInterval(function() {
                starfish.toolkit.tips.fade(1);
            }, timer);
        },

        /**
         * @event pos
         * @param  {Event}  e  鼠标事件
         */
        pos: function(e) {
            var u = web.window.mouseY(e);
            var l = web.window.mouseX(e);
            web.css(tt, "top", (u - height + top) + 'px');
            web.css(tt, "left", (l + left) + 'px');
        },

        /**
         * @method fade
         * @param  {int}  d  方向 1 -- 显示   / -1 -- 隐藏
         */
        fade: function(d) {
            var a = alpha;
            if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
                var i = speed;
                if (endalpha - a < speed && d == 1) {
                    i = endalpha - a;
                } else if (alpha < speed && d == -1) {
                    i = a;
                }
                alpha = a + (i * d);
                web.css(tt, "opacity", alpha * .01);
                web.css(tt, "filter", 'alpha(opacity=' + alpha + ')');
            } else {
                clearInterval(tt.timer);
                if (d == -1) {
                    web.css(tt, "display", 'none');
                }
            }
        },

        /**
         * @method hide
         */
        hide: function() {
            clearInterval(tt.timer);
            tt.timer = setInterval(function() {
                starfish.toolkit.tips.fade(-1)
            }, timer);
        }
    };
}();
