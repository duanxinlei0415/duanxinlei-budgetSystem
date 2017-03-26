
$(document).ready(
		function() {
			showdata();
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
						isPhone:true,
						maxlength : 20
					}
				}
			});
			
			// 绑定关闭
			$('#closeBtn').bind('click', function() {
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
									parent.window.gridObj.page(1);
									parent.layer.close(index);
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

function showdata() {
	var id = $("#id").val();
	if (id) {
		// 编辑页面
		// 获取项目需求信息
		jQuery.post(ctx + "/task/subTask/editSummy/json", {
			id : id
		}, function(_json) {
			if (_json.status == "success") {
				for ( var s in _json.data) {
					set_val(s, _json.data[s]);
				}
			} else {
				parent.layer.msg(_json.message);
			}
		});
	}
}