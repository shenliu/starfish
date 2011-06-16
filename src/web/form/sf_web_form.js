/**
 * 表单
 *
 * @namespace org.shen.Starfish.web
 * @submodule web
 * @module form
 */
starfish.web.form = {
    validate: {
        // required
        required: {
            msg: "This field is required.",
            check: function(obj, load) {
                return obj.value.length > 0 || load
                        || (obj.value != "" && obj.value == obj.defaultValue);
            }
        },

        // email address
        email: {
            msg: "Not a valid email address.",
            check: function(obj) {
                return !obj.value || /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/i
                        .test(obj.value);
            }
        },

        // phone number
        phone: {
            msg: "Not a valid phone number.",
            check: function(obj) {
                var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec(obj.value);
                if (m) {
                    obj.value = "(" + m[1] + ") " + m[2] + "-" + m[3];
                }
                return !obj.value || m;
            }
        },

        // date YYYY-MM-DD
        date: {
            msg: "Not a valid date. YYYY-MM-DD",
            check: function(obj) {
                return !obj.value || /^\d{2,4}-\d{2}-\d{2}$/.test(obj.value);
            }
        },

        // URL
        url: {
            msg: "Not a valid URL.",
            check: function(obj) {
                return !obj.value || obj.value == 'http://' ||
                        /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(obj.value);
            }
        }
    },
	
	/**
	 * 验证表单所有元素
     *
     * @method validateForm
	 * @param {Object} 		form	表单元素
	 * @param {Boolean} 	load	页面加载执行还是动态执行
	 * @return {Boolean}	是否提交表单
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
	hideErrors:	function(elem) {
		// 得到当前字段的下一个元素
		var next = starfish.web.dom.next(elem);

		// 如果该元素是一个ul,并有className='error' 则删除掉
		if (next && next.nodeName == "UL" && next.className == "errors") {
			starfish.web.dom.dispose(next);
		}
	},
	
	/**
	 * 显示字段的错误信息
     *
     * @method showErrors
	 * @param {Element}  elem  字段
	 * @param {Array}  errors  错误信息数组
	 */
	showErrors:	function(elem, errors) {
        var dom = starfish.web.dom;
		// 得到当前字段的下一个元素
		var next = elem.nextSibling;
		
		// 如果该元素不是一个ul,并且没有className='error' 则创建一个
		if (!next || (next.nodeName != "UL" || next.className != "errors")) {
			next = dom.elem("ul");
			next.className = "errors";
            dom.insert(elem, next, "after");
		}

		// 添加li,并显示错误信息
		for (var i = 0; i < errors.length; i++) {
			var li = dom.elem("li");
			li.innerHTML = errors[i];
            dom.insert(next, li);
		}
	}

};