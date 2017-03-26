(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.Mouse2drag = factory();
    }
}(this, function () {
    function Mouse2drag(options, fn){//fn 回调函数
		this.left = 0;
		this.top = 0;
		this.currentX = 0;
		this.currentY = 0;
		this.flag = options.flag || false;

		this.dragBar = options.dragBar;
		this.target = options.target;
		this.callback = fn;

		this.drag(this.dragBar, this.target, this.callback);
	}

	Mouse2drag.prototype.drag = function(dragBar, target, callback){
		var that = this;
		if(css(target, "left") !== "auto"){
			this.left = css(target, "left");
		}
		if(css(target, "top") !== "auto"){
			this.top = css(target, "top");
		}
		dragBar.onmousedown = function(event){
			that.flag = true;
			if(!event){
				event = window.event;
				//防止IE文字选中
				dragBar.onselectstart = function(){
					return false;
				}  
			}
			that.currentX = event.clientX;
			that.currentY = event.clientY;
		};
		document.onmouseup = function(){
			that.flag = false;	
			if(css(target, "left") !== "auto"){
				that.left = css(target, "left");
			}
			if(css(target, "top") !== "auto"){
				that.top = css(target, "top");
			}
		};
		document.onmousemove = function(event){
			var event = event ? event: window.event;
			if(that.flag){
				var nowX = event.clientX,
					nowY = event.clientY;

				var disX = nowX - that.currentX,
					disY = nowY - that.currentY;

				var targetX = parseInt(that.left) + disX,
					targetY = parseInt(that.top) + disY;

				target.style.cssText ='left:'+ targetX +'px; top:'+ targetY +'px;';
			}
			
			if (typeof callback == "function") {
				callback(targetX, targetY);
			}
		}
	}

	function css(el, key){// key 驼峰表达式
		return el.currentStyle? el.currentStyle[key] : document.defaultView.getComputedStyle(el, false)[key];
	}

    return Mouse2drag;
}));