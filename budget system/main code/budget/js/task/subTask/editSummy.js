
$(document).ready(
		function() {
			//页面
			var index = parent.layer.getFrameIndex(window.name);
			//绑定校验
			var validator = $("#updateForm").validate({
				rules : {
					subTaskName : {
						required : true,
						maxlength : 50
					},
					respnoseCompanyName : {
						required : true,
						maxlength : 40
					},
					responsePerson : {
						required : true,
						maxlength : 20
					},
					subTaskTel : {
						required : true,
						isPhone:true,
						maxlength : 20
					},
					invitiCode : {
						maxlength : 50
					}
				}
			});
			
			// 绑定关闭
			$('#closeBtn').bind('click', function() {
				parent.window.location.href = ctx + '/task/subTask/subTaskList';
				parent.layer.close(index);
			});
			// 绑定保存
			var subBtn = $("#subBtn");
			if (subBtn.length>0) {
				subBtn.bind("click", function() {
					if (!validator.form()) {
						return;
					}
					$.ajax({
						type: "POST",
						url: $("#updateForm").attr('action'),
						data:$("#updateForm").serialize(),
						beforeSend:function(){
							subBtn.attr('disabled','true');
						},
						success:function(_json) {
							if (_json.status == "success") {
								parent.layer.msg(_json.message,
										{time: 1000},function(){
									window.location.href = ctx + '/task/subTask/subTaskDetail/pre?sTaskId='+_json.data;
								});
							} else {
								parent.layer.msg(_json.message,{time: 1000});
							}
						},
						complete:function(){
							subBtn.removeAttr("disabled");
						}
					});
				});
			}
			
		});