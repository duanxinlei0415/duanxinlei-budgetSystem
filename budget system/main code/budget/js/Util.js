(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.Util = factory();
    }
}(this, function () {
	// 配置文件
	var config = {
        regConfig: {
            moneyLargeReg: /^([1-9](\d){0,7}|0)(\.([\d]){0,2})?$/,   //万元金额的正则表达式
            moneySmallReg: /^([1-9](\d){0,9}|0)(\.([\d]){0,2})?$/,   //元金额的正则表达式
            amountReg: /^([1-9]){1}([0-9])*$/   //数量的正则表达式
        },
        lengthConfig: {
            length: 3000
        }
    };
    //工具类
	var Util = {
		insertHtmlAtCaret:function(html){//div控制光标位置
        	var selection, range;
	        if (window.getSelection || document.getSelection()) {
	            // IE9 和 w3c
	            selection = window.getSelection() || document.getSelection();
	            if (selection.getRangeAt && selection.rangeCount) {
	                range = selection.getRangeAt(0);// rangeCount 等于0或1
	                range.deleteContents();
	                var el = document.createElement('div');
	                el.innerHTML = html;
	                var frag = document.createDocumentFragment(),
	                    node,
	                    lastNode;
	                while ((node = el.firstChild)) {
	                    lastNode = frag.appendChild(node);
	                }
	                range.insertNode(frag);
	                if (lastNode) {
	                    range = range.cloneRange();
	                    range.setStartAfter(lastNode);
	                    range.collapse(true);
	                    selection.removeAllRanges();
	                    selection.addRange(range);
	                }
	            }
	        } else if (document.selection && document.selection.type != "Control") {
	            // IE < 9
	            document.selection.createRange().pasteHTML(html);
	        }
        },
		inputInvalidAndMoveEnd:function($element){//div内容替换并将光标置后(计算函数调用时监听用)
			var that = this;
        	var value = $element.html();
	        do {
	            value = value.slice(0, -1);
	        } while (!(value.match(config.regConfig.moneyLargeReg) || value.match(config.regConfig.moneySmallReg)
	        || value.match(config.regConfig.amountReg) || value == ''));
	        $element.html('');
	        that.insertHtmlAtCaret(value);
	        $element.focus();
        },
        moneyLarge: function ($largeMoney) {//万元金额输入限制
        	var that = this;
            $largeMoney.on('input', function (event) {//live方法报错，暂用on代替
                var text = $(this).text();
                if (!text.match(config.regConfig.moneyLargeReg)) {
                    that.inputInvalidAndMoveEnd($(this));
                }
            });
        },
        moneySmall: function ($smallMoney) {//元金额输入限制
        	var that = this;
            $smallMoney.on('input', function (event) {
                var text = $(this).text();
                if (!text.match(config.regConfig.moneySmallReg)) {
                    that.inputInvalidAndMoveEnd($(this));
                }
            });
        },
        amount: function ($amount) {//数量限制
        	var that = this;
            $amount.on('input', function (event) {
                var text = $(this).text();
                if (!text.match(config.regConfig.amountReg)) {
                    that.inputInvalidAndMoveEnd($(this));
                }
            });
        },
        lengthLimit:function(){
        	var that = this;
		        function bindEvent($el, type, fn) {
		            var selector = $el.selector;
		            $el.parent().delegate(selector, type, function (event) {
		                fn.call($el[0], event);//this >>> $el[0]
		            });
		        }
		        function fn($el, maxLength) {
		            $el.html().length > maxLength ? function () {
		                $el.html(function () {
		                    return $el.html().slice(0, maxLength + 1);
		                });
		                //光标置后
		                var value = $el.html().slice(0, -1);
		                $el.html('');
		                that.insertHtmlAtCaret(value);
		                $el.focus();
		            }() : function () {
		            }();
		        }
		        return {
		            bindEvent: bindEvent,
		            limit: fn
		        }
    	},
        lengthAndNotEditable: function (indexArray, notEditableIndex, maxLength) {//输入长度及不可编辑
        	var that = this;
            //长度限制
            $('.container table tbody tr').each(function (index, el) {
                for (var i = 0; i < indexArray.length; i++) {
                    var $elm = $(this).children('td').eq(indexArray[i]).children('div');

                    $('.container table tbody').delegate('div[contenteditable="true"]', 'input', function (event) {
                        var reg = /<div><br><\/div>/,
                            htmlValue = $(this).html();
                        $(this).html(function () {
                            return htmlValue.replace(reg, '<br>');
                        });
                    });
                    that.lengthLimit().bindEvent($elm, 'input', function () {
                        that.lengthLimit().limit($(this), maxLength);
                    })
                }
            });

            //某不可编辑
            $('.container table tbody tr').each(function (index, el) {
                for (var j = 0; j < notEditableIndex.length; j++) {
                    $(this).children('td').eq(notEditableIndex[j]).children('div').removeAttr('contenteditable').css("cursor", "not-allowed");
                }
            });
        },
        inputCusor:function() {//【暂时废弃不用】input控制光标的位置 
	        function getCursortPosition(ctrl) {
	            var CaretPos = 0;// IE Support
	            if (document.selection) {
	                ctrl.focus();
	                var Sel = document.selection.createRange();
	                Sel.moveStart('character', -ctrl.value.length);
	                CaretPos = Sel.text.length;
	            } else if (ctrl.selectionStart || ctrl.selectionStart == '0')
	                CaretPos = ctrl.selectionStart;
	            return (CaretPos);
	        }

	        function setCaretPosition(ctrl, pos) {
	            if (ctrl.setSelectionRange) {
	                ctrl.focus();
	                ctrl.setSelectionRange(pos, pos);
	            } else if (ctrl.createTextRange) {
	                var range = ctrl.createTextRange();
	                range.collapse(true);
	                range.moveEnd('character', pos);
	                range.moveStart('character', pos);
	                range.select();
	            }
	        }

	        return {
	            getCursortPosition: getCursortPosition,
	            setCaretPosition: setCaretPosition
	        }
    	},
    	backBlur:function(id, index){//背景
	        var className = 'back-blur';//结合css

	        function setUp(id){
	            var UID = null;
	            if(!id){ UID = className; }else{ UID = id; }
	            UID += UID + Math.random().toString().replace('.', '');
	            $('body').append('<div id="'+ UID +'" class="'+ className +'"></div>');
	            $('#'+UID).css({
	                width:Math.max($('body').width(), document.documentElement.clientWidth),
	                height:Math.max($('body').height(), document.documentElement.clientHeight),
	                position:'absolute',
	                zIndex:index,
	                top:0,
	                left:0
	            });
	        }
	        function kill(id){
	            $('#'+id).length>0 && $('#'+id).remove();
	        }
	        function killAll(){
	            $('.'+className).length>0 && $('.'+className).remove();
	        }

	        //返回API
	        return{
	            setUp:function(id){
	                setUp(id);
	            },
	            kill:function(id){
	                kill(id);
	            },
	            killAll:function(){
	                killAll();
	            }
	        }
	    },
	    center:function($el,zIndex,boolean){//居中
	    	var that = this;
	        var width = $el.outerWidth(),
	            height = $el.outerHeight(),
	            parentWidth = null,
	            parentHeight = null;
	        if(boolean){
	            parentWidth =  document.documentElement.clientWidth || document.body.clientWidth;//屏幕
	            parentHeight = document.documentElement.clientHeight || document.body.clientHeight;//屏幕
	        }else{
	            parentWidth = $el.offsetParent().width();//具有定位的父元素
	            parentHeight = $el.offsetParent().height();//具有定位的父元素
	        }
	        $el.css({
	            position: 'absolute',
	            left:(parentWidth - width)/2,
	            top:(parentHeight - height)/2,
	            zIndex:zIndex
	        });

	        if(boolean){
	            window.onresize = function(){
	                that.center($el,zIndex,boolean);
	                $('.back-blur').css({
	                    width:$('body').width(),
	                    height:$('body').height()
	                });
	            }
	        }

	        return $el;
	    }
    };

    return Util;
}));