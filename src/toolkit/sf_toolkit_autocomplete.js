/**
 * 后台servlet的url
 * @property
 */
starfish.toolkit.AUTOCOMPLETE_SERVER_URL = "http://localhost:8080/webserver/webserver";

/**
 * AutoComplete 文本框的自动填充控件
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module autocomplete
 */
starfish.toolkit.autocomplete = function() {
    var w = starfish.web;
    var popOptions = {0: true, 1: false, 2: false};
    var curSuggestPos = null;   // 当前选择的suggest的list中li元素
    var curPopPos = null, curPopPosIdx; //  当前选择的popmenu的list中li元素及下标
    var history = [], curHistoryIdx = 0; // 历史查询记录 及下标

    return {
        /**
         * 初始化 popmenu
         *
         * @method initPopmenu
         */
        initPopmenu: function() {
            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            var lis = $$(popmenu_div, "li");
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                if (popOptions[i]) {    // 选项中的已选择的 '打钩'
                    li.className = li.className + " sf_tk_ac_popmenu_selected";
                }
            }
        },

        /**
         * 显示popmenu
         *
         * @method showPopmenu
         */
        showPopmenu: function() {
            starfish.toolkit.autocomplete.initPopmenu();
            starfish.toolkit.autocomplete.hideSuggest();
            var top = w.window.pageY($("sf_tk_ac_popmenu_a"));
            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            w.czz(popmenu_div, {
                display: "block",
                top: (top + 18) + "px"
            });
            $("sf_tk_ac_text").blur();   // text input失去焦点
        },

        /**
         * 隐藏popmenu
         *
         * @method hidePopmenu
         */
        hidePopmenu: function() {
            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            w.css(popmenu_div, "display", "none");
            $("sf_tk_ac_text").focus();  // text input得到焦点
        },

        /**
         * 注册popmenu的li事件
         *
         * @event addListenerPopmenu
         */
        addListenerPopmenu: function() {
            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            var lis = $$(popmenu_div, "li");
            for (var i = 0; i < lis.length; i++) {
                (function() {
                    var li = lis[i], n = i;
                    w.event.addEvent(li, "click", function() {   // 点击事件
                        starfish.toolkit.autocomplete.setPopmenuOption(li, n);
                    });
                })();

                // 鼠标移动进入
                w.event.addEvent(lis[i], "mouseover", function(e) {
                    this.className = this.className + " sf_tk_ac_popmenu_current";
                });

                // 鼠标移动出去
                w.event.addEvent(lis[i], "mouseout", function(e) {
                    this.className = this.className.replace(/sf_tk_ac_popmenu_current/g, "");
                });
            }
        },

        /**
         * popmenu设置
         *
         * @method setPopmenuOption
         * @param {Element}  elem    元素
         * @param {int}      idx     下标
         */
        setPopmenuOption: function(elem, idx) {
            if (popOptions[idx]) {
                elem.className = elem.className.replace(/sf_tk_ac_popmenu_selected/g, "");
            } else {
                elem.className = elem.className + " sf_tk_ac_popmenu_selected";
            }
            popOptions[idx] = !popOptions[idx];
        },

        /**
         * 注册popmenu <a>的点击事件
         *
         * @event addListenerOptions
         */
        addListenerOptions: function() {
            var popmenu_a = $("sf_tk_ac_popmenu_a");
            w.event.addEvent(popmenu_a, "click", function(e) {
                starfish.toolkit.autocomplete.showPopmenu();
            });

            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            var lis = $$(popmenu_div, "li");
            w.event.addEvent(popmenu_a, "keypress", function(e) {
                if (e.keyCode == 13) {    // 回车
                    starfish.toolkit.autocomplete.hidePopmenu();
                    return false;
                } else if (e.charCode == 32) {    // 空格
                    starfish.toolkit.autocomplete.setPopmenuOption(curPopPos, curPopPosIdx);
                    return false;
                } else if (e.keyCode == 38) {    // 上箭头
                    while (curPopPos && curPopPos.previousSibling && curPopPos.previousSibling.nodeType == Node.TEXT_NODE) {
                        curPopPos = curPopPos.previousSibling;
                    }
                    return starfish.toolkit.autocomplete.curPopmenuLi((curPopPos && curPopPos.previousSibling) || lis[lis.length - 1]);
                } else if (e.keyCode == 40) {    // 下箭头
                    while (curPopPos && curPopPos.nextSibling && curPopPos.nextSibling.nodeType == Node.TEXT_NODE) {
                        curPopPos = curPopPos.nextSibling;
                    }
                    return starfish.toolkit.autocomplete.curPopmenuLi((curPopPos && curPopPos.nextSibling) || lis[0]);
                }
            });

        },

        /**
         * 当前的popmenu list的li元素
         *
         * @method curPopmenuLi
         * @param {Element}  elem   li元素
         */
        curPopmenuLi: function(elem) {
            if (!elem) {
                return;
            }
            curPopPos = elem;
            var popmenu_div = w.className("sf_tk_ac_popmenu_div")[0];
            var lis = $$(popmenu_div, "li");
            for (var i = 0, j = lis.length; i < j; i++) {
                lis[i].className = lis[i].className.replace(/sf_tk_ac_popmenu_current/g, "");
                if (lis[i] === curPopPos) {
                    curPopPosIdx = i;
                }
            }
            elem.className = elem.className + " sf_tk_ac_popmenu_current";
            return false;
        },

        /* =========================================================== */

        /**
         * 注册text key事件
         *
         * @event addListenerText
         */
        addListenerText: function() {
            var text = $("sf_tk_ac_text");
            w.event.addEvent(text, "keyup", function(e) {
                if (e.keyCode != 13 && e.keyCode != 38 && e.keyCode != 40) {
                    starfish.toolkit.autocomplete.hideSuggest();
                    var v = this.value.toString().trim();
                    if (v.length > 0) {   // 大于两个字符才响应
                        /*
                         *  AJAX ~~
                         */
                        // 查询参数数组
                        var params = [];
                        params.push("?q=" + encodeURI(v));  // 查询的字词

                        if (popOptions[0]) { // 全部高亮(Highlight All)
                            params.push("&h=1");
                        }

                        if (popOptions[1]) { // 大小写匹配(Match Case)
                            params.push("&c=1");
                        }

                        if (popOptions[2]) { // 匹配整个字词(Match Whole Word)
                            params.push("&w=1");
                        }

                        starfish.ajax.getText(starfish.toolkit.AUTOCOMPLETE_SERVER_URL
                                + params.join(""), function(t) {
                            if (t.length > 0) {
                                starfish.toolkit.autocomplete.showSuggest(t, v);
                            }
                        });
                    }
                }
            });

            w.event.addEvent(text, "keypress", function(e) {
                var suggest_list = w.className("sf_tk_ac_suggest_list")[0];
                var lis = $$(suggest_list, "li");

                if (w.css($("sf_tk_ac_suggest"), "display") === "block") {  // suggest list显示时
                    if (e.keyCode == 13) {    // 回车
                        starfish.toolkit.autocomplete.setText(curSuggestPos);
                        return false;
                    } else if (e.keyCode == 38) {    // 上箭头
                        return starfish.toolkit.autocomplete.curSuggestLi((curSuggestPos && curSuggestPos.previousSibling) || lis[lis.length - 1]);
                    } else if (e.keyCode == 40) {    // 下箭头
                        return starfish.toolkit.autocomplete.curSuggestLi((curSuggestPos && curSuggestPos.nextSibling) || lis[0]);
                    }
                } else {
                    // 注册 快捷
                    if (e.keyCode == 13) {  // 选定了字词, 触发搜索事件 根据情况自定义
                        var v = $("sf_tk_ac_text").value.trim();  // 记录历史查询
                        if (v.length > 0) {
                            history.push(v);
                            ++curHistoryIdx;
                        }
                        // todo search();
                    }

                    if (e.altKey && e.charCode == 99) {   // alt+c    clearText
                        starfish.toolkit.autocomplete.clearText();
                    }

                    if (e.altKey && e.charCode == 111) {  // alt+o    showpopmenu
                        starfish.toolkit.autocomplete.showPopmenu();
                        $("sf_tk_ac_popmenu_a").focus();
                    }

                    if (e.altKey && e.charCode == 112) {  // alt+p    前一个
                        starfish.toolkit.autocomplete.showHistory(-1);
                    }

                    if (e.altKey && e.charCode == 110) {  // alt+n    下一个
                        starfish.toolkit.autocomplete.showHistory(1);
                    }
                }
            });

            w.event.addEvent(text, "focus", function() {
                starfish.toolkit.autocomplete.hidePopmenu();
            });
        },

        /**
         * 显示suggest的list
         *
         * @method showSuggest
         * @param {String}  html   suggest的innerHTML
         * @param {String}  query  查询的字词
         */
        showSuggest: function(html, query) {
            var suggest_list = w.className("sf_tk_ac_suggest_list")[0];
            suggest_list.innerHTML = html;

            var attr = "";  // RegExp对象的第二个参数 "g" or "i" or "gi"
            if (popOptions[0]) {
                attr += "g";
            }
            if (popOptions[1]) {
                attr += "i";
            }
            var lis = $$(suggest_list, "li");
            for (var i = 0, j = lis.length; i < j; i++) {
                var _s = lis[i].innerHTML;
                var pattern = new RegExp("(" + query + ")", attr);
                if (pattern.test(_s)) {
                    _s = _s.replace(new RegExp(query, "g"), function(t) {
                        return "<span class='sf_tk_ac_suggest_highlight'>" + t + "</span>";
                    });
                    lis[i].innerHTML = _s;
                }
            }

            // 显示suggest list
            var sf_tk_ac_inner_div = w.className("sf_tk_ac_inner_div")[0];
            var _y = w.window.pageY(sf_tk_ac_inner_div);
            var _h = w.window.getHeight(sf_tk_ac_inner_div);
            w.czz($("sf_tk_ac_suggest"), {
                top: (_y + _h - 5) + "px",
                display: "block"
            });

            starfish.toolkit.autocomplete.addListenerSuggestList();
        },

        /**
         * 选择suggest list的li元素, 并且显示到text input元素中, 隐藏suggest list
         *
         * @method setText
         * @param {Element} elem    选择的suggest list的li元素
         */
        setText: function(elem) {
            if (!elem) {
                return;
            }
            $("sf_tk_ac_text").value = elem.innerHTML.stripTags();
            starfish.toolkit.autocomplete.hideSuggest();
        },

        /**
         *  为suggest list的li元素注册事件监听
         *
         *  @event addListenerSuggestList
         */
        addListenerSuggestList: function() {
            var suggest_list = w.className("sf_tk_ac_suggest_list")[0];
            var lis = $$(suggest_list, "li");
            for (var i = 0, j = lis.length; i < j; i++) {
                (function() {
                    var _o = lis[i];
                    // 点击事件
                    w.event.addEvent(_o, "click", function(e) {
                        starfish.toolkit.autocomplete.setText(_o);
                    });
                })();

                // 鼠标移动进入
                w.event.addEvent(lis[i], "mouseover", function(e) {
                    this.className = this.className + " sf_tk_ac_suggest_list_current";
                });

                // 鼠标移动出去
                w.event.addEvent(lis[i], "mouseout", function(e) {
                    this.className = this.className.replace(/sf_tk_ac_suggest_list_current/g, "");
                });
            }
        },

        /**
         * 隐藏 suggest栏
         *
         * @method hideSuggest
         */
        hideSuggest: function() {
            var sf_tk_ac_suggest = $("sf_tk_ac_suggest");
            w.css(sf_tk_ac_suggest, "display", "none");
            $("sf_tk_ac_text").focus();
        },

        /**
         * 当前的suggest list的li元素
         *
         * @method curSuggestLi
         * @param {Element}  elem  li元素
         */
        curSuggestLi: function(elem) {
            if (!elem) {
                return;
            }
            curSuggestPos = elem;
            var suggest_list = w.className("sf_tk_ac_suggest_list")[0];
            var lis = $$(suggest_list, "li");
            for (var i = 0, j = lis.length; i < j; i++) {
                lis[i].className = lis[i].className.replace(/sf_tk_ac_suggest_list_current/g, "");
            }
            elem.className = elem.className + " sf_tk_ac_suggest_list_current";
            return false;
        },

        /**
         * 清空按钮点击事件
         *
         * @event addListenerClearText
         */
        addListenerClearText: function() {
            var clear = $("sf_tk_ac_clear");
            var text = $("sf_tk_ac_text");
            w.event.addEvent(clear, "click", function() {
                starfish.toolkit.autocomplete.clearText();
            });
        },

        /**
         * 清空text input
         *
         * @method clearText
         */
        clearText: function() {
            var text = $("sf_tk_ac_text");
            text.value = "";
            text.focus();
            starfish.toolkit.autocomplete.hidePopmenu();
            starfish.toolkit.autocomplete.hideSuggest();
        },

        /* =========================================================== */

        /**
         * history 按钮点击事件
         *
         * @event addListenerHistory
         */
        addListenerHistory: function() {
            var prev = $("sf_tk_ac_arrow_prev");
            var next = $("sf_tk_ac_arrow_next");

            w.event.addEvent(prev, "click", function() {
                starfish.toolkit.autocomplete.showHistory(-1);
            });

            w.event.addEvent(next, "click", function() {
                starfish.toolkit.autocomplete.showHistory(1);
            });
        },

        /**
         * 显示history查询的记录
         *
         * @method showHistory
         * @param {int}  n   1 - next  -1 - prev
         */
        showHistory: function(n) {
            if (history.length == 0) {
                return;
            }

            if (n === -1) {
                if (--curHistoryIdx === 0) {
                    curHistoryIdx = history.length - 1;
                }
            } else if (n === 1) {
                if (++curHistoryIdx === history.length) {
                    curHistoryIdx = 0;
                }
            }
            $("sf_tk_ac_text").value = history[curHistoryIdx];
        }

    }
}();
