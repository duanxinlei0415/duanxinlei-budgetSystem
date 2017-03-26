var gridObj;
$(document).ready(function() {
	gridObj = $.fn.bsgrid.init('searchTable', {
		//autoLoad: false,
		url : ctx + '/system/role/list/json',
		pageSizeSelect : true,
		pageSize : 10,
		displayBlankRows : false,
		event: {
			//
            customRowEvents: {
            	dblclick: function (record, rowIndex, trObj, options) {
                    //alert('click trObj:\n' + trObj.html());
            		var id = record.id;
            		layer.open({
            			type:2,
            			area:['500px','400px'],
            			fix:false,
            			maxmin:true,
            			content:ctx+'/system/role/look?id='+id
            		});
                }
            }
        }
	});
	//绑定批量删除
	$("#deleteAll").bind("click", function(){
		
		   layer.confirm('是否确认删除', {
			    btn: ['确定','删除'], //按钮
			    shade: false //不显示遮罩
			}, function(){
				var idsArray = gridObj.getCheckedValues('id');
				if(idsArray==""){
					layer.msg("未选择记录");
					return;
				}
				  $.ajax({
					type : "POST",
					url : ctx + '/system/role/delete/more',
					data : "records="+idsArray.join(","),
					success : function(msg) {
						layer.msg(msg.message);
						//重新加载
						doSearch();
					},
					error : function(){
						layer.msg("通信异常，请联系管理员")
					}
				});
			}, function(){});
		  
	});
	//绑定搜索
	$("#searchBtn").bind("click", function(){
		doSearch();
	});
	//绑定新增角色
	$('#addBtn').bind('click',function(){
		layer.open({
			type:2,
			area:['500px','400px'],
			fix:false,
			maxmin:true,
			content:ctx+'/system/role/update/pre'
		});
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
	layer.open({
		type:2,
		area:['500px','400px'],
		fix:false,
		maxmin:true,
		content:ctx+'/system/role/update/pre?id='+id
	});
}

function doSearch() {
	gridObj.options.otherParames = $('#searchForm').serializeArray();
	gridObj.page(1);
}