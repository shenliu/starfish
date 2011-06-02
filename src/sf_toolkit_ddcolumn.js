/**
 * 拖拽column
 */
starfish.toolkit.ddcolumn = function() {
    var mouseOffset = null;

    // 鼠标是否点下
    var isMouseDown = false;

    // 上一次鼠标状态
    var lastMouseState = false;

    var dds = [];
    
    var curTarget = null, lastTarget = null;

    var dragging = null;
    
    var rootParent = null, rootSibling = null;

    var w = starfish.web;

    return {
        init: function() {
            dragging = document.createElement('div');
            dragging.className = 'ddc_dragging';
            document.body.appendChild(dragging);

            w.event.addEvent(document, "mousedown", starfish.toolkit.ddcolumn.mouseDown);
            w.event.addEvent(document, "mousemove", starfish.toolkit.ddcolumn.mouseMove);
            w.event.addEvent(document, "mouseup", starfish.toolkit.ddcolumn.mouseUp);
        },

        createDragContainer: function() {
            var cDrag = dds.length;
            dds[cDrag] = [];

            for (var i = 0; i < arguments.length; i++) {
                var cObj = arguments[i];
                dds[cDrag].push(cObj);
                cObj.setAttribute('unselectable', 'on'); // opera 不选定文本

                for (var j = 0; j < cObj.childNodes.length; j++) {
                    if (cObj.childNodes[j].nodeName == '#text') {
                        continue;
                    }
                    cObj.childNodes[j].className = 'ddc_col_item';
                    cObj.childNodes[j].setAttribute('dragObj', cDrag);
                    cObj.childNodes[j].setAttribute('unselectable', 'on'); // opera 不选定文本
                }
            }
        },

        mouseDown: function() {
            isMouseDown = true;
            return false;
        },

        mouseMove: function(ev) {
            ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            var mousePos = {
                x: w.window.getX(ev),
                y: w.window.getY(ev)
            };

            if (lastTarget && (target != lastTarget)) {
                lastTarget.className = lastTarget.className.replace(/ddc_col_over/g, "");
            }

            var dragObj = target.getAttribute('dragObj');
            if (dragObj != null) {
                if (target != lastTarget) {
                    target.className += " ddc_col_over";
                }

                if (isMouseDown && !lastMouseState) {
                    curTarget = target;

                    rootParent = w.dom.parent(curTarget);
                    rootSibling = w.dom.next(curTarget);

                    mouseOffset = {
                        x: w.window.getX(ev) - w.window.pageX(target),
                        y: w.window.getY(ev) - w.window.pageY(target)
                    };

                    dragging.innerHTML = '';

                    dragging.appendChild(curTarget.cloneNode(true));
                    w.css(dragging, 'width', w.window.fullWidth(curTarget) + "px");
                    w.css(dragging, 'display', 'block');

                    w.dom.first(dragging).className += " ddc_col_dd";
                    w.dom.first(dragging).removeAttribute('dragObj');

                    curTarget.setAttribute('startWidth', parseInt(w.window.fullWidth(curTarget)));
                    curTarget.setAttribute('startHeight', parseInt(w.window.fullHeight(curTarget)));

                    var curDD = dds[dragObj];
                    for (var ii = 0; ii < curDD.length; ii++) {
                        var dragCont = curDD[ii];
                        dragCont.setAttribute('startWidth', parseInt(w.window.fullWidth(dragCont)));
                        dragCont.setAttribute('startHeight', parseInt(w.window.fullHeight(dragCont)));
                        dragCont.setAttribute('startLeft', w.window.pageX(dragCont));
                        dragCont.setAttribute('startTop', w.window.pageY(dragCont));

                        for (var j = 0; j < dragCont.childNodes.length; j++) {
                            var child = dragCont.childNodes[j];
                            if ((child.nodeName == '#text') || (child == curTarget)) {
                                continue;
                            }
                            child.setAttribute('startWidth', parseInt(w.window.fullWidth(child)));
                            child.setAttribute('startHeight', parseInt(w.window.fullHeight(child)));
                            child.setAttribute('startLeft', w.window.pageX(child));
                            child.setAttribute('startTop', w.window.pageY(child));
                        }
                    }
                }
            }

            if (curTarget) {
                w.css(dragging, 'top', (mousePos.y - mouseOffset.y) + "px");
                w.css(dragging, 'left', (mousePos.x - mouseOffset.x) + "px");

                var dragConts = dds[curTarget.getAttribute('dragObj')];
                var activeCont = null;

                var xPos = mousePos.x - mouseOffset.x + (parseInt(curTarget.getAttribute('startWidth')) / 2);
                var yPos = mousePos.y - mouseOffset.y + (parseInt(curTarget.getAttribute('startHeight')) / 2);

                for (var k = 0; k < dragConts.length; k++) {
                    var cur = dragConts[k];
                    if ((parseInt(cur.getAttribute('startLeft')) < xPos) &&
                            (parseInt(cur.getAttribute('startTop')) < yPos) &&
                            ((parseInt(cur.getAttribute('startLeft')) + parseInt(cur.getAttribute('startWidth'))) > xPos) &&
                            ((parseInt(cur.getAttribute('startTop')) + parseInt(cur.getAttribute('startHeight'))) > yPos)) {
                        activeCont = cur;
                        break;
                    }
                }

                if (activeCont) {
                    var beforeNode = null;

                    for (var i = activeCont.childNodes.length - 1; i >= 0; i--) {
                        var ac = activeCont.childNodes[i];
                        if (ac.nodeName == '#text') {
                            continue;
                        }

                        if (curTarget != ac &&
                                ((parseInt(ac.getAttribute('startLeft')) + parseInt(ac.getAttribute('startWidth'))) > xPos) &&
                                ((parseInt(ac.getAttribute('startTop')) + parseInt(ac.getAttribute('startHeight'))) > yPos)) {
                            beforeNode = ac;
                        }
                    }

                    if (beforeNode) {
                        if (beforeNode != w.dom.next(curTarget)) {
                            activeCont.insertBefore(curTarget, beforeNode);
                        }
                    } else {
                        if ((w.dom.next(curTarget)) || (w.dom.parent(curTarget) != activeCont)) {
                            activeCont.appendChild(curTarget);
                        }
                    }

                    delay(function() {
                        activeCont.setAttribute('startWidth', parseInt(w.window.fullWidth(activeCont)));
                        activeCont.setAttribute('startHeight', parseInt(w.window.fullHeight(activeCont)));
                        activeCont.setAttribute('startLeft', w.window.pageX(activeCont));
                        activeCont.setAttribute('startTop', w.window.pageY(activeCont));
                    }, 5);

                    if (curTarget.className.search(/ddc_hiddenBorder/) == -1) {
                        curTarget.className += " ddc_hiddenBorder";
                    }

                    if (w.css(curTarget, 'display') == 'none') {
                        w.css(curTarget, 'display', 'block');
                        w.css(curTarget, 'visibility', 'visible');
                    }
                } else {
                    if (w.css(curTarget, 'display') != 'none') {
                        w.css(curTarget, 'display', 'none');
                    }
                }
            }
            lastMouseState = isMouseDown;
            lastTarget = target;

            return false;
        },

        mouseUp: function() {
            isMouseDown = false;
            if (curTarget) {
                w.css(dragging, 'display', 'none');
                if (w.css(curTarget, 'display') == 'none') {
                    if (rootSibling) {
                        rootParent.insertBefore(curTarget, rootSibling);
                    } else {
                        rootParent.appendChild(curTarget);
                    }
                }
                curTarget.className = curTarget.className.replace(/ddc_hiddenBorder/g, "");
                w.css(curTarget, 'display', 'block');
                w.css(curTarget, 'visibility', 'visible');
            }
            curTarget = null;
        }

    }

}();
