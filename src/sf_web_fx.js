/**
 * web: 动画
 *
 * @namespace org.shen.Starfish.web
 * @submodule org.shen.Starfish.web
 * @class org.shen.Starfish.web.fx
 * @requires window
 *
 */
starfish.web.fx = {
    /**
     * 渐显/渐褪
     * @param {Element}   elem    元素
     * @param {Object}    opts    选项
            opts = {             // default
                 begin: 0,       // 0 - 100
                 end:   100,     // 0 - 100
                 step:  5        // 5 - 20
            }
     *
     * @method org.shen.Starfish.web.fx.fade
     */
    fade: function(elem, opts) {
        if (!opts) {
            opts = {
                begin: 0,
                end:   100,
                step:  5
            };
        } else {
            opts.begin = isNaN(opts.begin) ? 0
                    : (opts.begin < 0 || opts.begin > 100) ? 0
                    : opts.begin;
            opts.end = isNaN(opts.end) ? 0
                    : (opts.end < 0 || opts.end > 100) ? 0 : opts.end;
            opts.step = isNaN(opts.step) ? 5
                    : (opts.step < 5 || opts.step > 20) ? 5
                    : opts.step;
        }

        var win = starfish.web;
        win.setOpacity(elem, opts.begin);
        win.show(elem);

        var begin = Math.min(opts.begin, opts.end);
        var end = Math.max(opts.begin, opts.end);
        var step = opts.step;
        var current = end; // 当前的透明度
        var interval = 0; // 时间间隔
        var flag = opts.begin < opts.end; // 渐显/渐褪

        for (var i = begin; i <= end; i += step) {
            (function() {
                var pos = current;
                current = flag ? i : current - step;
                interval = flag ? (pos + 1) * 50 : (101 - pos) * 50;
                setTimeout(function() {
                    win.setOpacity(elem, pos);
                }, interval);
            })();
        }
    }

};
