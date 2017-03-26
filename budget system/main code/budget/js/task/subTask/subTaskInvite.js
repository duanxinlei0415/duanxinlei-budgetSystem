
$(document).ready(
		function() {
			
			//页面
			var index = parent.layer.getFrameIndex(window.name);
			//绑定校验
			var validator = $("#updateForm").validate({
				rules : {
					invitiCode : {
						required : true,
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