/**
 * 半透明覆盖层 overlay
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module overlay
 * @requires window event dom fade
 */
starfish.toolkit.overlay = {
    /**
     * @method init
     * @param {Boolean}  clickHide   点击是否隐藏overlay
     */
    init: function(clickHide) {
        var overlay = document.createElement("div");
        overlay.id = "overlay";

        if (clickHide) {
            // 点击div该层隐藏
            starfish.web.event.addEvent(overlay, "click", starfish.toolkit.overlay.hide);
        }
        starfish.web.event.addEvent(window, "resize", starfish.toolkit.overlay.show);

        document.body.appendChild(overlay);
    },

    /**
     * 隐藏overlay
     *
     * @method hide
     */
    hide: function() {
        starfish.web.hide($("overlay"));
    },

    /**
     * 显示 overlay
     *
     * @method show
     */
    show: function() {
        var w = starfish.web;
        var overlay = $("overlay");

        if (!overlay) {
            starfish.toolkit.overlay.init();
        }

        w.css(overlay, "width", w.window.docWidth() + "px");
        w.css(overlay, "height", w.window.docHeight() + "px");

        w.fx.fade(overlay, {
            begin: 0,
            end:   50,
            step:  5
        });
    }

};
