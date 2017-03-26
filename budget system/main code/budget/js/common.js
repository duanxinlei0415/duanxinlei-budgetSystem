/* 赋值 */
function set_val(name, val) {
	//判断对应的控件是否存在，不存在则直接返回
	if(!$("#" + name)){
		return;
	}
	if ($("#" + name + " option").length > 0) {
		$("#" + name).val(val);
		return;
	}

	if (($("#" + name).attr("type")) === "checkbox") {
		if (val == 1) {
			$("#" + name).attr("checked", true);
			return;
		}
	}
	if ($("." + name).length > 0) {
		if (($("." + name).first().attr("type")) === "checkbox") {
			var arr_val = val.split(",");
			for ( var s in arr_val) {
				$("input." + name + "[value=" + arr_val[s] + "]").attr(
						"checked", true);
			}
		}
	}
	if (($("#" + name).attr("type")) === "text") {
		$("#" + name).val(val);
		return;
	}
	if (($("#" + name).attr("type")) === "hidden") {
		$("#" + name).val(val);
		return;
	}
	if (($("#" + name).attr("rows")) > 0) {
		$("#" + name).val(val);
		return;
	}
}

/**
 * 为控件设置错误提示信息
 * @param id 控件ID
 * @param msg 错误提示信息
 */
function addErrorTips(id,msg){
	var $elem = $('#'+id);  
    var corners = ['center right' ,'left center'];
    var flipIt = $elem.parents('span.right').length > 0;
	if($elem){
		$elem.first().qtip({  
            overwrite: false,  
            content: msg,  
            position: {  
                my: corners[ flipIt ? 0 : 1 ],  
                at: corners[ flipIt ? 1 : 0 ],  
                viewport: $(window)  
            },  
            show: {  
                event: false,  
                ready: true  
            },  
            hide: false,  
            style: {  
                classes: 'qtip-blue' // Make it red  
            }
        //If we have a tooltip on this element already, just update its content
        }).qtip('option', 'content.text', msg); 
	}
}
/**
 * 销毁错误提示信息
 * @param id 控件ID
 */
function removeTips(id){
	var $elem = $('#'+id);
	if($elem){
		$elem.qtip('destroy');
	}
}