/**
 * 半透明覆盖层 overlay
 * 
 * 需要: sf_web_window.js	sf_web_dom.js
 * 
 */
starfish.toolkit.overlay = {
	init: function() {
		var overlay = document.createElement("div");
		overlay.id = "overlay";
		
		// 点击div该层隐藏
		overlay.onclick = starfish.toolkit.overlay.hide;
		
		document.body.appendChild(overlay);
	},
	
	hide: function() {
		starfish.web.hide($("overlay"));
	},
	
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
