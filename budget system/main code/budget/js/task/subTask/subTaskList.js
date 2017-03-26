var gridObj;
$(document).ready(function() {
	gridObj = $.fn.bsgrid.init('searchTable', {
		//autoLoad: false,
		url : ctx + '/task/subTask/subTaskList/json',
		pageSizeSelect : true,
		pageSize : 10,
		displayBlankRows : false
	});
	//绑定搜索
	$("#searchBtn").bind("click", function(){
		doSearch();
	});
	//绑定返回
	$("#returnBtn").bind("click", function(){
		window.location.href = ctx+'/index';
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
	var index = layer.open({
		type:2,
		title:"参与单位管理",
		area:['500px','400px'],
		maxmin: false,
		content:ctx+'/task/subTask/updateSummy/pre?id='+id
	});
	layer.full(index);
}

function operateDetail(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openDetail(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="编辑" width="14" height="14" border="0" /></a>';
}

function openDetail(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var index = layer.open({
		type:2,
		title:"参与单位管理",
		area:['500px','400px'],
		maxmin: false,
		content:ctx+'/task/subTask/subTaskDetail/pre?sTaskId='+id
	});
	layer.full(index);
}

function operateInvite(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openInvite(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="编辑" width="14" height="14" border="0" /></a>';
}

function openInvite(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var index = layer.open({
		type:2,
		title:"参与单位管理",
		area:['400px','200px'],
		maxmin: false,
		content:ctx+'/task/subTask/subTaskInvite/pre?id='+id
	});
	//layer.full(index);
}

function operateDoc(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openDoc(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="编辑" width="14" height="14" border="0" /></a>';
}

function openDoc(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	$("#downLoadIframe").attr("src",ctx+'/subTask/createDoc/load?sTaskId='+id);
}

function doSearch() {
	gridObj.options.otherParames = $('#searchForm').serializeArray();
	gridObj.page(1);
}