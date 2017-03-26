$(document).ready(
		function() {
			
			$('#closeBtn').bind('click', function() {
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			})

			// 绑定保存
			var saveBtn = $("#saveBtn");
			if (saveBtn.length>0) {
				saveBtn.bind("click", function() {
					jQuery.post($("#updateForm").attr('action'), $(
							"#updateForm").serialize(),
							function(_json) {
								if (_json.status == "success") {
									parent.layer.msg(_json.message);
									var index = parent.layer.getFrameIndex(window.name);
									parent.layer.close(index);
								} else {
									parent.layer.msg(_json.message);
								}
							});
				});
			}

		});