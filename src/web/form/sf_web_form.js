/**
 * 表单
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module form
 */
starfish.web.form = {
    validate: {
        /**
         * 必填
         */
        required: {
            msg: "请输入值",
            check: function(obj, load) {
                return obj.value.length > 0 || load
                        || (obj.value != "" && obj.value == obj.defaultValue);
            }
        },

        validate_email: {
            msg: "请输入正确的电子邮件地址",
            check: function(obj) {
                return !obj.value || /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/i
                        .test(obj.value);
            }
        },

        validate_phone: {
            msg: "请输入正确的电话号码",
            check: function(obj) {
                var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec(obj.value);
                if (m) {
                    obj.value = "(" + m[1] + ") " + m[2] + "-" + m[3];
                }
                return !obj.value || m;
            }
        },

        /**
         * YYYY-MM-DD
         */
        validate_date: {
            msg: "请输入正确的日期。如: 2011-02-10",
            check: function(obj) {
                // 应该再判断是不是合理的日期值~~
                return !obj.value || /^\d{2,4}-\d{2}-\d{2}$/.test(obj.value);
            }
        },

        /**
         * hh:mm
         */
        validate_time: {
            msg: "请输入正确的时间。如: 06:10",
            check: function(obj) {
                // 应该再判断是不是合理的时间值~~
                return !obj.value || /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/.test(obj.value);
            }
        },

        validate_url: {
            msg: "请输入正确的url地址",
            check: function(obj) {
                return !obj.value || obj.value == 'http://' ||
                        /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(obj.value);
            }
        },

        validate_ip: {
            msg: "请输入正确的IP地址",
            check: function(obj) {
                return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(obj.value);
            }
        },

        validate_number: {
            msg: "请输入有效的数字",
            check: function(obj) {
                return (!isNaN(obj.value) && !/^\s+$/.test(obj.value));
            }
        },

        validate_digits: {
            msg: "请输入数字",
            check: function(obj) {
                return !/^[-]?[^\d]/.test(obj.value);
            }
        },

        validate_alpha: {
            msg: "请输入英文字母",
            check: function(obj) {
                return /^[a-zA-Z]+$/.test(obj.value);
            }
        },

        validate_alphanum: {
            msg: "请输入英文字母或数字",
            check: function(obj) {
                return /^[a-zA-Z0-9]+$/.test(obj.value);
            }
        },

        validate_integer: {
            msg: "请输入正确的整数",
            check: function(obj) {
                return /^[-+]?[1-9]\d*$|^0$/.test(obj.value);
            }
        },

        validate_positive: {
            msg: "请输入非负数",
            check: function(obj) {
                return /^\d+(\.?\d+){0,1}$/.test(obj.value);
            }
        },

        validate_2digits: {
            msg: "最多允许输入2位小数",
            check: function(obj) {
                return /^[-+]?[1-9]\d*(\.?\d{1,2}){0,1}$/.test(obj.value);
            }
        },

        // todo~~
        validate_pattern: {
            msg: "输入的值不匹配",
            check: function(obj) {

            }
        },

        ///////////////////////////////////////////////////

        /**
         * 选择有效值
         */
        select_validate_value: {
            msg: "请选择/输入有效值",
            check: function(obj) {
                var v;
                if (obj.type == "select") {
                    v = obj.options[obj.selectedIndex].value;
                } else {
                    v = obj.value;
                }
                return !((v == null) || (v == 0) || (v.length == 0) || /^[\s|\u3000]+$/.test(v));
            }
        },

        select_value: {
            msg: "请选择",
            check: function(obj) {
                return obj.options ? obj.selectedIndex > 0 : !((obj.value == null) || (obj.value.length == 0));
            }
        },

        // todo~~
        select_one_required: {
            msg: "请至少选择一个选项",
            check: function(obj) {

            }
        },

        /**
         *  重复值
         *  @attribute repeatURL
         *  @return 'ok'表示有重复值
         */
        repeat_value: {
            msg: "已经存在该值",
            check: function(obj) {
                var url = obj.getAttribute("repeat");   // ajax的路径
                if (url) {
                    url += obj.value;
                    var flag = null;
                    starfish.web.ajax.get(encodeURI(url), function(result) {
                        flag = result.trim() == "ok";
                    }, {}, "sync");    // 同步调用
                    return flag;
                }
            }
        },

        // 非中文
        no_chinese: {
            msg: "不能输入中文",
            check: function(obj) {
                return !/[\u4e00-\u9fa5]/.test(obj.value);
            }
        },

        chinese: {
            msg: "请输入中文",
            check: function(obj) {
                return /[\u4e00-\u9fa5]/.test(obj.value);
            }
        },

        /**
         * @attribute maxLen
         */
        maxLen:  {
            msg: "最多只能输入{0}个字",
            check: function(obj) {
                var len = obj.getAttribute("maxLen");
                if (len) {
                    this.msg = this.msg.replace("{0}", len);
                    return obj.value.length <= parseInt(len);
                }
            }
        },

        /**
         * @attribute minLen
         */
        minLen: {
            msg: "最少要输入{0}个字",
            check: function(obj) {
                var len = obj.getAttribute("minLen");
                if (len) {
                    this.msg = this.msg.replace("{0}", len);
                    return obj.value.length >= parseInt(len);
                }
            }
        },

        /**
         * @attribute maxValue
         */
        maxValue: {
            msg: "最大值为{0}",
            check: function(obj) {
                var val = obj.getAttribute("maxValue");
                if (val) {
                    this.msg = this.msg.replace("{0}", val);
                    return obj.value <= parseInt(val);
                }
            }
        },

        /**
         * @attribute minValue
         */
        minValue: {
            msg: "最小值为{0}",
            check: function(obj) {
                var val = obj.getAttribute("minValue");
                if (val) {
                    this.msg = this.msg.replace("{0}", val);
                    return obj.value >= parseInt(val);
                }
            }
        },

        /**
         * 需要 validate_integer
         * @attribute rang [min_max]
         */
        rang_int: {
            msg: "请输入{0}至{1}的整数",
            check: function(obj) {
                var rang = obj.getAttribute("rang");
                if (rang) {
                    var val = rang.split("_");
                    this.msg = this.msg.replace("{0}", val[0]).replace("{1}", val[1]);
                    return parseInt(obj.value) >= parseInt(val[0])
                            && parseInt(obj.value) <= parseInt(val[1]);
                }
            }
        },

        /**
         * 需要 validate_number
         * @attribute rang [min_max]
         */
        rang_number: {
            msg: "请输入{0}至{1}的数字",
            check: function(obj) {
                var rang = obj.getAttribute("rang");
                if (rang) {
                    var val = rang.split("_");
                    this.msg = this.msg.replace("{0}", val[0]).replace("{1}", val[1]);
                    return parseFloat(obj.value) >= parseFloat(val[0])
                            && parseFloat(obj.value) <= parseFloat(val[1]);
                }
            }
        },

        /**
         * @attribute rang [min_max]
         */
        rang_length: {
            msg: "输入值的长度应该在{0}至{1}之间",
            check: function(obj) {
                var rang = obj.getAttribute("rang");
                if (rang) {
                    var val = rang.split("_");
                    this.msg = this.msg.replace("{0}", val[0]).replace("{1}", val[1]);
                    return obj.value.length >= parseInt(val[0])
                            && obj.value.length <= parseInt(val[1]);
                }
            }
        },

        /////////////////////////////////////////////

        /**
         * @attribute equals 相比较的控件的name属性值
         */
        equals: {
            msg: "两次输入不一致，请重新输入",
            check: function(obj) {
                var equals = obj.getAttribute("equals");
                if (equals) {
                    var form = obj.form;
                    return obj.value == form.elements[equals].value;
                }
            }
        },

        /**
         * 小于
         * @attribute lt [name_desc] 相比较的控件的name属性值_描述文字
         */
        lt: {
            msg: "请输入小于{0}的值",
            check: function(obj) {
                var lt = obj.getAttribute("lt");
                if (lt) {
                    var form = obj.form;
                    var desc = lt.split(" ")[1];
                    this.msg = this.msg.replace("{0}", desc);
                    var name = lt.split(" ")[0];
                    var val = form.elements[name].value;
                    if (isNaN(obj.value.trim()) && isNaN(val.trim())) { // 非数字
                        return obj.value < val;
                    } else {
                        return parseFloat(obj.value) < parseFloat(val);
                    }
                }
            }
        },

        /**
         * 小于等于
         * @attribute le [name_desc] 相比较的控件的name属性值_描述文字
         */
        le: {
            msg: "请输入小于或等于{0}的值",
            check: function(obj) {
                var le = obj.getAttribute("le");
                if (le) {
                    var form = obj.form;
                    var desc = le.split(" ")[1];
                    this.msg = this.msg.replace("{0}", desc);
                    var name = le.split(" ")[0];
                    var val = form.elements[name].value;
                    if (isNaN(obj.value.trim()) && isNaN(val.trim())) { // 非数字
                        return obj.value < val || obj.value == val;
                    } else {
                        return parseFloat(obj.value) <= parseFloat(val);
                    }
                }
            }
        },

        /**
         * 大于
         * @attribute gt [name_desc] 相比较的控件的name属性值_描述文字
         */
        gt: {
            msg: "请输入大于{0}的值",
            check: function(obj) {
                var gt = obj.getAttribute("gt");
                if (gt) {
                    var form = obj.form;
                    var desc = gt.split(" ")[1];
                    this.msg = this.msg.replace("{0}", desc);
                    var name = gt.split(" ")[0];
                    var val = form.elements[name].value;
                    if (isNaN(obj.value.trim()) && isNaN(val.trim())) { // 非数字
                        return obj.value > val;
                    } else {
                        return parseFloat(obj.value) > parseFloat(val);
                    }
                }
            }
        },

        /**
         * 大于等于
         * @attribute ge [name_desc] 相比较的控件的name属性值_描述文字
         */
        ge: {
            msg: "请输入大于或等于{0}的值",
            check: function(obj) {
                var ge = obj.getAttribute("ge");
                if (ge) {
                    var form = obj.form;
                    var desc = ge.split(" ")[1];
                    this.msg = this.msg.replace("{0}", desc);
                    var name = ge.split(" ")[0];
                    var val = form.elements[name].value;
                    if (isNaN(obj.value.trim()) && isNaN(val.trim())) { // 非数字
                        return obj.value > val || obj.value == val;
                    } else {
                        return parseFloat(obj.value) >= parseFloat(val);
                    }
                }
            }
        },

        ////////////////////////////////////////////////

        // 中国专有

        cn_id: {
            msg: "请输入有效的身份证号码",
            check: function(obj) {

            }
        },

        cn_phone: {
            msg: "请输入有效的电话号码",
            check: function(obj) {

            }
        },

        cn_mobile: {
            msg: "请输入有效的手机号码",
            check: function(obj) {

            }
        },

        cn_zip: {
            msg: "请输入有效的邮政编码",
            check: function(obj) {

            }
        }

    },

    /**
     * 验证表单所有元素
     *
     * @method validateForm
     * @param {Object}         form    表单元素
     * @param {Boolean}     load    页面加载执行还是动态执行
     * @return {Boolean}    是否提交表单
     */
    validateForm: function(form, load) {
        var f = starfish.web.form;
        var valid = true;

        // 遍历表单中的所有字段 form.elements是包含表单所有字段的数组
        var elems = form.elements;
        for (var i = 0, j = elems.length; i < j; i++) {
            var t = elems[i].type;
            if (t == "text" || t == "textarea" || t == "checkbox" || t == "password"
                    || t == "radio" || t == "file" || t == "hidden") {
                // 先隐藏任何错误的信息
                f.hideErrors(elems[i]);

                // 检查字段是否正确
                if (f.validateField(elems[i], load)) {
                    valid = false;
                }
            }
        }
        return valid;
    },

    /**
     * 验证单个字段的内容
     *
     * @method validateField
     * @param {Element}  elem  字段
     * @param {Boolean}  load  页面加载执行还是动态执行
     * @return {Boolean}  字段是否符合要求
     */
    validateField: function(elem, load) {
        var f = starfish.web.form;
        var errors = [];

        // 遍历所有可能的验证方法
        for (var name in f.validate) {
            var re = new RegExp("(^|\\s)" + name + "(\\s|$)");

            // 检查字段是否有错误类型指定的className属性,如果有则传递给验证函数
            if (re.test(elem.className) && !f.validate[name].check(elem, load)) {
                // 如果验证失败,则把错误信息添加到数组中
                errors.push(f.validate[name].msg);
            }
        }

        // 显示错误信息
        if (errors.length) {
            f.showErrors(elem, errors);
        } else {
            f.hideErrors(elem);
        }

        // 有错误 返回true
        return errors.length > 0;
    },

    /**
     * 隐藏当前字段正显示的错误信息
     *
     * @method hideErrors
     * @param {Element}  elem  当前字段
     */
    hideErrors: function(elem) {
        // 得到当前字段父元素的最后一个元素
        //var parent = starfish.web.dom.parent(elem);
        //var last = starfish.web.dom.last(parent);

        var next = starfish.web.dom.next(elem);

        // 如果该元素是一个ul,并有className='error' 则删除掉
        if (next && next.nodeName == "UL" && next.className == "errors") {
            starfish.web.dom.dispose(next);
        }
        starfish.web.removeClass(elem, "error");
    },

    /**
     * 显示字段的错误信息
     *
     * @method showErrors
     * @param {Element}  elem  字段
     * @param {Array}  errors  错误信息数组
     */
    showErrors: function(elem, errors) {
        var dom = starfish.web.dom;
        // 得到当前字段父元素的最后一个元素
        //var parent = dom.parent(elem);
        //var last = dom.last(parent);

        var next = starfish.web.dom.next(elem);

        // 如果该元素不是一个ul,并且没有className='error' 则创建一个
        if (!next || (next.nodeName != "UL" || next.className != "errors")) {
            next = dom.elem("ul");
            next.className = "errors";
            dom.insert(elem, next, "after");
        }

        next.innerHTML = "";
        // 添加li,并显示错误信息
        for (var i = 0; i < errors.length; i++) {
            var li = dom.elem("li");
            li.innerHTML = errors[i];
            dom.insert(next, li);
        }
        starfish.web.addClass(elem, "error");
    },

    /**
     * 添加 必填字段的'星'
     * @param  {Element}  form  表单
     * @param  {Boolean}  showTip  是否显示字段tip
     */
    showRequired: function(form, showTip) {
        var web = starfish.web;
        var requireds = web.className("required", form);
        for (var i = 0, j = requireds.length; i < j; i++) {
            var lab = web.dom.prev(requireds[i]); // 得到前面的<label>元素
            if (!lab) {  // 前面没有<label>时，添加一个<label>
                var par = web.dom.parent(requireds[i]);
                lab = web.dom.elem("label");
                web.dom.insert(par, lab, "top");
            }
            // 添加'*'
            var span = web.dom.parseDOM("<span class='require'>*</span>")[0];
            web.dom.insert(lab, span);
            if (showTip) {
                web.css(lab, "cursor", "help");
                web.event.addEvent(lab, 'mouseover', function() {
                    starfish.toolkit.tips.show(w.form.validate.required.msg);
                });

                web.event.addEvent(lab, 'mouseout', function() {
                    starfish.toolkit.tips.hide();
                });
            }
        }
    },

    /**
     * 添加 输入框等 得到焦点和失去焦点的事件
     * @param  {Element}  form  表单
     */
    addFocusStyle: function(form) {
        var web = starfish.web;
        var elems = form.elements;
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            if (elem.type == "button") {
                continue;
            }
            (function(o) {
                web.event.addEvent(o, "focus", function() {
                    starfish.web.form.hideErrors(o);
                });

                web.event.addEvent(o, "blur", function() {
                    if (!starfish.web.form.validateField(o, false)) { // 没有错误
                        web.addClass(o, "validate");
                    }
                });
            })(elem);
        }
    }

};
