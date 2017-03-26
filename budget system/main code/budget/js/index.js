$(function(){
	//跳转到新建向导页
	$('#newBtn').click(function(){
		window.location.href = ctx + '/guide';
	});
	//绑定我牵头的课题
	$('.taskBtn').each(function(){
		$(this).click(function(){
			var id = $(this).attr('data-id');
			if(!id){
				layer.msg("获取数据失败")
			}
			var index = layer.open({
				type:2,
				title:"课题管理",
				area:['500px','400px'],
				maxmin: false,
				content:ctx+'/task/participant/list?taskId='+id
			});
			layer.full(index);
		});
	});
	
	//绑定我参与的课题
	$('.subTaskBtn').each(function(){
		$(this).click(function(){
			var id = $(this).attr('data-id');
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
		});
	});
	//绑定报表输出
	$('.loadBtn').each(function(){
		$(this).click(function(){
			var id = $(this).attr('data-id');
			$("#downLoadIframe").attr("src",ctx+'/subTask/createDoc/load?sTaskId='+id);
		});
		
	});
	//绑定报表输出
	$('.taskLoadBtn').each(function(){
		$(this).click(function(){
			var id = $(this).attr('data-id');
			$("#downLoadIframe").attr("src",ctx+'/task/createDoc/load?taskId='+id);
		});
		
	});
	
	
	$('#subTaskMore').click(function(){
		window.location.href = ctx + '/task/subTask/subTaskList';
	});
	
	$('#taskMore').click(function(){
		window.location.href = ctx + '/task/task/list';
	});
})