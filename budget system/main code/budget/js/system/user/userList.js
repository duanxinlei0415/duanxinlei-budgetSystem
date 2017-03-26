var gridObj;
$(document).ready(function() {
	gridObj = $.fn.bsgrid.init('searchTable', {
		//autoLoad: false,
		url : ctx + '/system/user/list/json',
		pageSizeSelect : true,
		pageSize : 10,
		displayBlankRows : false
	});
	//绑定搜索
	$("#searchBtn").bind("click", function(){
		doSearch();
	});
});

function operate(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openEdit(\''
			+ gridObj.getRecordIndexValue(record, 'account') + '\');"><img src="'+imgUrl+'" title="编辑" width="14" height="14" border="0" /></a>';
}

function openEdit(account){
	if(!account){
		layer.msg("获取数据失败")
	}
	layer.open({
		type:2,
		area:['500px','400px'],
		fix:false,
		maxmin:true,
		content:ctx+'/system/user/updatePassword/pre?account='+account
	});
}

function doSearch() {
	gridObj.options.otherParames = $('#searchForm').serializeArray();
	gridObj.page(1);
}