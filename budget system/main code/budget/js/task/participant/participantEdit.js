
$(document).ready(
		function() {
			showdata();
			//页面
			var index = parent.layer.getFrameIndex(window.name);
			//绑定校验
			var validator = $("#updateForm").validate({
				rules : {
					participantName : {
						required : true,
						maxlength : 50
					},
					participant : {
						required : true,
						maxlength : 50
					},
					tel : {
						required : true,
						isPhone:true,
						maxlength : 20
					},
					email : {
						required : true,
						email:true,
						maxlength : 50
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
		jQuery.post(ctx + "/task/participant/update/json", {
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