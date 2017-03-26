var gridObj;
$(document).ready(function() {
	
	var taskId = $('#taskId').val();
	//页面
	var index = parent.layer.getFrameIndex(window.name);
	
	gridObj = $.fn.bsgrid.init('searchTable', {
		//autoLoad: false,
		url : ctx + '/task/participant/list/json',
		pageSizeSelect : true,
		pageSize : 10,
		displayBlankRows : false,
		otherParames:{taskId:taskId}
	});
	
	//绑定参与单位信息
	$('#addBtn').bind('click',function(){
		var indexChild = layer.open({
			type:2,
			area:['800px','550px'],
			maxmin: false,
			content:ctx+'/task/participant/update/pre?taskId='+taskId
		});
		layer.full(indexChild);
	});
	// 绑定返回
	$('#closeBtn').bind('click', function() {
		parent.window.location.href = ctx + '/index';
		parent.layer.close(index);
	});
	
	// 绑定下一步
	$('#nextBtn').bind('click', function() {
		window.location.href=ctx + '/task/task/taskDetail/pre?id='+taskId;
	});
	
	// 绑定上一步
	$('#beforeBtn').bind('click', function() {
		window.location.href=ctx + '/task/task/update/pre?id='+taskId;
	});
});

function operate(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openEdit(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="编辑" width="14" height="14" border="0" /></a>';
}

function openEdit(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var indexChild = layer.open({
		type:2,
		area:['800px','550px'],
		fix:false,
		maxmin: false,
		content:ctx+'/task/participant/update/pre?id='+id
	});
	layer.full(indexChild);
}

function doSearch() {
	gridObj.options.otherParames = $('#searchForm').serializeArray();
	gridObj.page(1);
}