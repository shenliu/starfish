/**
 * web: 动画
 * 
 * 需要: sf_web_window.js
 * 
 */
starfish.web.fx = {
	/**
     * @Deprecate
	 * 伸展/收缩 slide in / slide out
	 * @param {element} 	elem	元素
	 * @param {object} 		opts 	选项
	  		opts = {
	  			slide: {
	  				width:	false, 			// horizontal 			(default: false)
		  			height: true 			// vertical	  			(default: true)
		  		},
		  		toggle: true/false			// 是slide还是改变size  true:slide  false:size
		  		to: [w, h],					// to size				要改变到的size
	  			last: [w, h],				// last size			上一次的size
	  			speed: 5,					// 变换速率	[1-10]		(default: 5)
	  			stylz: {					// 要改变的样式 		
	  				border: ""
	  				// ...
	  			}
	  		}
	 * 
	 */
	slide: function(elem, opts) {
		var web = starfish.web;
		
		var base = 30; // 速率基数
	
		var step = 5;  // 频率
		
		// toggle
		var toggle = opts.toggle ? true : false;
		
		// slide
		opts.slide.width = opts.slide.width || false;
		opts.slide.height = !opts.slide.height ? false : true;
		
		// last size
		var l_w = opts.last ? opts.last[0] : -1;
		var l_h = opts.last ? opts.last[1] : -1;
		
		// to size
		var to_w = opts.to ? opts.to[0] : -1;
		var to_h = opts.to ? opts.to[1] : -1;
		
		// frame	
		opts.speed = opts.speed || 5;
		var frame = base * opts.speed;
		
		// stylz
		var stylz = opts.stylz ? opts.stylz : null;
		
		if (stylz) {
			for (var style in stylz) {
				web.css(elem, style, stylz[style]);
			}			
		}
		
		// 显示的设定toggle为true,或to size为0,都为slide
		if (toggle || (to_w == 0 && to_h == 0)) { // slide in or slide out
			var cur; // 当前的
			var ival = 0; // 时间间隔
			var isOut; // in or out
			var f_w, f_h; // 元素的最大size
			
			if (web.css(elem, "display") != "none") { // slide out
				cur = frame;
				isOut = true;
				
				f_w = web.window.fullWidth(elem);
				f_h = web.window.fullHeight(elem);
				// 保留元素最后一次的size
				opts.last = [f_w, f_h];
				
			} else { // slide in
				cur = 0;
				isOut = false;
				opts.last = [];
				
				f_w = l_w != -1 ? l_w: to_w;
				f_h = l_h != -1 ? l_h: to_h;
				
				// 如果是从slide in开始,有没有提供to size就退出
				if (f_w == -1 || f_h == -1) {
					return;
				}
				
				// 设置元素width与/或height为0px
				for (var k in opts.slide) {
					if (opts.slide[k]) {
						web.css(elem, k.toString(), "0px");
					}
				}
			}
			
			// 显示元素
			web.window.show(elem);
			
			for (var i = 0; i <= frame; i += step) {
				(function() {
					var pos = cur;
					cur = isOut ? pos - step : i;
					ival = isOut ? (frame - pos + 1) * 10 : (pos + 1) * 10;
					setTimeout(function() {
						for (var k in opts.slide) { 
							if (opts.slide[k]) {
								var n =  k.toString() === "width" ? f_w : f_h;
								web.css(elem, k.toString(), (pos / frame * n) + "px");
							}	
						}
					}, ival);
				})();
			}
			
			// 如果是slide out则隐藏元素
			if (isOut) {
				setTimeout(function() {
					web.window.hide(elem);
				}, frame * 10);
			}
			
		} else { // change size
			
			// 如果没有提供to size就退出
			if (to_w === -1 || to_h === -1) {
				web.attr(elem, "__sliding__", "done");
				return;
			}
			
			if (web.css(elem, "display") != "none") { // 元素没有隐藏时执行
				var c_w, c_h; // 当前的
				var ival_w = 0, ival_h = 0; // 时间间隔
				var flag_w, flag_h; // smaller?
				
				// 起始size
				var fr_w = web.window.fullWidth(elem);
				var fr_h = web.window.fullHeight(elem);
				
				// size没有变化
				if (fr_w === to_w && fr_h === to_h) {
					web.attr(elem, "__sliding__", "done");
					return;
				}
				
				/*
				 * 	情况: (small < big)
				 * 		A. fr_w <= to_w	fr_h <= to_h
				 * 		B. fr_w <= to_w	fr_h >= to_h
				 * 		C. fr_w > to_w	fr_h > to_h
				 * 		D. fr_w > to_w	fr_h < to_h
				 */
				
				c_w = fr_w, c_h = fr_h;
				
				// 每次增加/减少的量
				var d_w = Math.floor((Math.abs(to_w - fr_w) / (frame / step)));
				var d_h = Math.floor((Math.abs(to_h - fr_h) / (frame / step)));

				d_w = d_w != 0 ? d_w : 1;
				d_h = d_h != 0 ? d_h : 1;
				
				if (fr_w <= to_w && fr_h <= to_h) { // A
					flag_w = false, flag_h = false;
				} else if (fr_w <= to_w && fr_h >= to_h) { // B
					flag_w = false, flag_h = true;
				} else if (fr_w >= to_w && fr_h >= to_h) { // C
					flag_w = true, flag_h = true;
				} else if (fr_w >= to_w && fr_h <= to_h) { // D
					flag_w = true, flag_h = false;
				}
				//console.log(d_w + "@@@" + d_h);
				for (var i = 0; i <= frame; i += step) {
					(function() {
						var _i = i;
						var pos_w = c_w, pos_h = c_h;
						
						c_w = flag_w ? pos_w - d_w : pos_w + d_w;
						c_h = flag_h ? pos_h - d_h : pos_h + d_h;
						
						setTimeout(function() {
							web.css(elem, "width", pos_w + "px");
							web.css(elem, "height", pos_h + "px");
							//console.log(pos_w + "=====" + pos_h);
						}, _i * 10);
					})();
				}
				
				// 修正一下 程序还不完善~~
				setTimeout(function() {
					web.css(elem, "width", to_w + "px");
					web.css(elem, "height", to_h + "px");
				}, frame * 11);
			}
		}
		
		setTimeout(function() {
			// 为元素保留opts
			web.attr(elem, "__opts__", opts);
		
			// 把__sliding__属性值改为done,表示slide已经完成
			web.attr(elem, "__sliding__", "done");
		}, frame * 12);
		
	},
	
	/**
     * @Deprecate
	 * 控制伸展/收缩 toggle slide in / slide out
	 * @param {element} 	elem	元素
	 * @param {array} 		params	与opts对象相同 (可选)
	 */
	toggle: function(elem, params) {
		var web = starfish.web;

		// 元素是否正在slide 防止在slide时再次点击toggle
		var sliding = web.attr(elem, "__sliding__");
		// 在元素没有__sliding__属性(第一次运行)和__sliding__值为done时,可以slide
		if (!sliding || sliding == "done") {
			web.attr(elem, "__sliding__", "doing");
		} else { // 元素正在slide,不能再次点击toggle
			return;
		}
		
		// 查找元素是否有__opts__属性
		var opts = web.attr(elem, "__opts__");
		if (!opts) { // 创建默认值的opts
			opts = {
	  			slide: {
	  				width:	true,
		  			height: true
		  		},
		  		stylz: {
		  			border: "4px dashed #227777",
		  			backgroundColor: "#333"
		  		}
	  		};
		}
		opts = Object.merge(opts, params);
		
		web.fx.slide(elem, opts);
	},
	
	/**
	 * 渐显/渐褪
	 * @param {element}  	elem	元素
	 * @param {object}	 	opts 	选项 
	 		opts = { // default
	 			begin: 0,		// 0 - 100
	  			end:   100,     // 0 - 100
	  			step:  5		// 5 - 20
	   		}
	 * 							
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
		var flag = opts.begin < opts.end ? true : false; // 渐显/渐褪
		
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
