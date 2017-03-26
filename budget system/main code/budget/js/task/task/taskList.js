var gridObj;
$(document).ready(function() {
	gridObj = $.fn.bsgrid.init('searchTable', {
		//autoLoad: false,
		url : ctx + '/task/task/list/json',
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

function operateSummy(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openSummy(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="概况编辑" width="14" height="14" border="0" /></a>';
}

function openSummy(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var index = layer.open({
		type:2,
		title:"课题管理",
		area:['500px','400px'],
		maxmin: false,
		content:ctx+'/task/task/edit/pre?id='+id
	});
	layer.full(index);
}

function operatePart(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openPart(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="概况编辑" width="14" height="14" border="0" /></a>';
}

function openPart(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var index = layer.open({
		type:2,
		title:"参与单位管理",
		area:['500px','400px'],
		maxmin: false,
		content:ctx+'/task/participant/listEdit?taskId='+id
	});
	layer.full(index);
}

function operateDetail(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openDetail(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="概况编辑" width="14" height="14" border="0" /></a>';
}

function openDetail(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	var index = layer.open({
		type:2,
		title:"课题分配管理",
		area:['500px','400px'],
		maxmin: false,
		content:ctx+'/task/task/taskDetail/pre?id='+id
	});
	layer.full(index);
}

function operateLoad(record, rowIndex, colIndex, options) {
	var imgUrl = ctx+"/images/gridImg/edit.gif";
	return '<a href="#" onclick="openLoad(\''
			+ gridObj.getRecordIndexValue(record, 'id') + '\');"><img src="'+imgUrl+'" title="概况编辑" width="14" height="14" border="0" /></a>';
}

function openLoad(id){
	if(!id){
		layer.msg("获取数据失败")
	}
	$("#downLoadIframe").attr("src",ctx+'/task/createDoc/load?taskId='+id);
}



function doSearch() {
	gridObj.options.otherParames = $('#searchForm').serializeArray();
	gridObj.page(1);
}