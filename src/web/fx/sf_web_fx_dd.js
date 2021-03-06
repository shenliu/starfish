/**
 * drag & drop
 *
 * @namespace org.shen.Starfish.web.fx
 * @submodule fx
 * @module dd
 */
starfish.web.fx.dd = {
    /**
     * 被拖放的当前元素
     * @property obj
     */
    obj: null,

    /**
     * 初始化
     *
     * @method init
     * @param {Element}     o        作为拖放处理的元素
     * @param {Element}        oRoot     被拖放的元素,不能再其上拖动 如为null则把处理函数作为拖放元素
     * @param {Object}      bound   可移动区域 包括：
     *          {int}  minX     可移动区域的水平最小值
     *          {int}  maxX       可移动区域的水平最大值
     *          {int}  minY        可移动区域的垂直最小值
     *          {int}  maxY        可移动区域的垂直最大值
     *
     * @param {Object}      coor    是否切换水平坐标/垂直坐标 包括:
     *          {Boolean}     horz    切换水平坐标系统
     *          {Boolean}     vert    切换垂直坐标系统
     *
     * @param {Object}   mapper    映射x/y坐标函数 包括:
     *          {Function}  x     映射x坐标函数
     *          {Function}  y    映射y坐标函数
     *
     * @param {Object}   dragfunc      用户自定义函数 包括：
     *          {Function}   dragstart   拖拽开始
     *          {Function}   dragging    拖拽中
     *          {Function}   dragend     拖拽结束
     */
    init: function(o, oRoot, bound, coor, mapper, dragfunc) {
        var web = starfish.web;
        // 监听拖放事件的开始
        starfish.web.event.addEvent(o, 'mousedown', web.fx.dd.start);

        // 得到使用中的坐标系统
        o.hmode = coor && coor.horz ? false : true;
        o.vmode = coor && coor.vert ? false : true;

        // 得到作为拖放处理函数的元素
        o.root = oRoot && oRoot != null ? oRoot : o;

        // 初始化使用的坐标系统
        if (o.hmode && isNaN(parseInt(o.root.style.left))) {
            web.css(o.root, 'left', web.window.pageX(o.root) + 'px');
            //o.root.style.left = "0px";
        }
        if (o.vmode && isNaN(parseInt(o.root.style.top))) {
            web.css(o.root, 'top', web.window.pageY(o.root) + 'px');
            //o.root.style.top = "0px";
        }
        if (!o.hmode && isNaN(parseInt(o.root.style.right))) {
            web.css(o.root, 'right', web.window.pageX(o.root) + web.window.getWidth(o.root) + 'px');
            //o.root.style.right = "0px";
        }
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) {
            web.css(o.root, 'bottom', web.window.pageY(o.root) + web.window.getHeight(o.root) + 'px');
            //o.root.style.bottom = "0px";
        }

        // 检查是否提供了可移动区域
        o.minX = bound && bound.minX || null;
        o.minY = bound && bound.minY || null;
        o.maxX = bound && bound.maxX || null;
        o.maxY = bound && bound.maxY || null;

        // 检查是否提供了x y坐标映射
        o.xMapper = mapper && mapper.x || null;
        o.yMapper = mapper && mapper.y || null;

        // 用户自定义函数 此处定义不做任何事情
        o.root.ondragstart = dragfunc && dragfunc.dragstart || new Function();
        o.root.ondrag = dragfunc && dragfunc.dragging || new Function();
        o.root.ondragend = dragfunc && dragfunc.dragend || new Function();
    },

    /**
     * 开始 拖拽
     *
     * @event start
     * @param {Event}   e   事件
     */
    start: function(e) {
        // 得到拖放中的对象 this指向拖放的元素
        var o = starfish.web.fx.dd.obj = this;

        // 标准化事件对象
        e = starfish.web.fx.dd.fixE(e);

        // 得到拖放元素当前x y坐标
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right);
        var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom);

        // 用户自定义
        o.root.ondragstart(x, y);

        // 得到鼠标开始位置
        o.lastMouseX = e.clientX;
        o.lastMouseY = e.clientY;

        if (o.hmode) { // 使用的为CSS坐标系统
            // 设置坐标的适当大小峰值
            if (o.minX != null) {
                o.minMouseX = e.clientX - x + o.minX;
            }
            if (o.maxX != null) {
                o.maxMouseX = o.minMouseX + o.maxX - o.minX;
            }
        } else { // 传统的数学坐标系统
            if (o.minX != null) {
                o.maxMouseX = -o.minX + e.clientX + x;
            }
            if (o.maxX != null) {
                o.minMouseX = -o.maxX + e.clientX + x;
            }
        }

        if (o.vmode) {
            if (o.minY != null) {
                o.minMouseY = e.clientY - y + o.minY;
            }
            if (o.maxY != null) {
                o.maxMouseY = o.minMouseY + o.maxY - o.minY;
            }
        } else {
            if (o.minY != null) {
                o.maxMouseY = -o.minY + e.clientY + y;
            }
            if (o.maxY != null) {
                o.minMouseY = -o.maxY + e.clientY + y;
            }
        }

        // 拖放中 与 拖放结束 事件
        starfish.web.event.addEvent(document, 'mousemove', starfish.web.fx.dd.drag);
        starfish.web.event.addEvent(document, 'mouseup', starfish.web.fx.dd.end);

        return false;
    },

    /**
     * 拖拽中
     *
     * @event drag
     * @param {Event}   e   事件
     */
    drag: function(e) {
        e = starfish.web.fx.dd.fixE(e);
        var o = starfish.web.fx.dd.obj;

        // 得到窗口内鼠标的位置
        var ex = e.clientX;
        var ey = e.clientY;

        // 得到拖放元素当前的x y坐标
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right);
        var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom);
        var nx, ny;

        // 如果设置了 可移动区域 则检查不要出界
        if (o.minX != null) {
            ex = o.hmode ? Math.max(ex, o.minMouseX) : Math
                .min(ex, o.maxMouseX);
        }
        if (o.maxX != null) {
            ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math
                .max(ex, o.minMouseX);
        }
        if (o.minY != null) {
            ey = o.vmode ? Math.max(ey, o.minMouseY) : Math
                .min(ey, o.maxMouseY);
        }
        if (o.maxY != null) {
            ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math
                .max(ey, o.minMouseY);
        }

        // 得到转换的新的x y坐标
        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        // 使用x y映射函数转换坐标
        if (o.xMapper) {
            nx = o.xMapper(y);
        } else if (o.yMapper) {
            ny = o.yMapper(x);
        }

        // 为拖放元素设置新的坐标
        o.root.style[o.hmode ? "left" : "right"] = nx + "px";
        o.root.style[o.vmode ? "top" : "bottom"] = ny + "px";

        // 得到鼠标最后的位置
        o.lastMouseX = ex;
        o.lastMouseY = ey;

        // 用户自定义
        o.root.ondrag(nx, ny);
        return false;
    },

    /**
     * 结束 拖拽
     *
     * @event end
     * @param {Event}   e   事件
     */
    end: function(e) {
        var dd = starfish.web.fx.dd;
        // 不再监听鼠标事件
        starfish.web.event.removeEvent(document, 'mousemove', starfish.web.fx.dd.drag);
        starfish.web.event.removeEvent(document, 'mouseup', starfish.web.fx.dd.end);

        // 用户自定义
        dd.obj.root.ondragend(parseInt(dd.obj.root.style[dd.obj.hmode ? "left"
            : "right"]), parseInt(dd.obj.root.style[dd.obj.vmode ? "top"
            : "bottom"]));
        dd.obj = null;
    },

    /**
     * 修复事件
     *
     * @method fixE
     * @param {Event}  e  事件
     * @return {Event} 修复的事件
     */
    fixE: function(e) {
        if (typeof e == 'undefined') { // IE
            e = window.event;
        }
        if (typeof e.layerX == 'undefined') {
            e.layerX = e.offsetX;
        }
        if (typeof e.layerY == 'undefined') {
            e.layerY = e.offsetY;
        }
        return e;
    }

};
