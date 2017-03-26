var menuShowSelectSetting = {
	check : {
		enable : true
	},
	data : {
		simpleData : {
			enable : true,
			idKey : "id",
			pIdKey : "pid",
			rootPId : "0"
		}
	}
};
var tree = null;
$(document).ready(
		function() {

			$('#closeBtn').bind('click', function() {
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			})

			// 加载树形结构
			jQuery.post(ctx + "/system/menu/list/json", function(_json) {
				if (_json.status == "success") {
					tree = $.fn.zTree.init($("#menuShowTree"),menuShowSelectSetting, _json.data);
					if(!tree){
						setTimeout('getData(tree)',30);
					}else{
						getData(tree);
					}
					
				} else {
					parent.layer.msg(_json.message);
				}
			});

			// 绑定新增
			var saveBtn = $("#saveBtn");
			if (saveBtn) {
				saveBtn.bind("click", function() {
					var nodesArray = tree.getCheckedNodes(true);
					var idsArray = new Array();
					for ( var node in nodesArray) {
						idsArray.push(nodesArray[node].id);
					}

					$("#menuIds").val(idsArray.join(","));
					jQuery.post($("#updateForm").attr('action'), $(
							"#updateForm").serialize(),
							function(_json) {
								if (_json.status == "success") {
									parent.layer.msg(_json.message);
									parent.window.gridObj.page(1);
									var index = parent.layer.getFrameIndex(window.name);
									parent.layer.close(index);
									
								} else {
									parent.layer.msg(_json.message);
								}
							});
				});
			}

		});

function showdata(result, treeObj) {
	for ( var s in result.data) {
		set_val(s, result.data[s]);
	}
	jQuery(result.data.menus).each(function(i, obj) {
		var treeNode = treeObj.getNodeByParam("id", obj.id, null);
		treeObj.checkNode(treeNode, true, false);
	});
	var rootNode = treeObj.getNodeByParam("id", "0", null);

}

function getData(treeObj){
	var id = $("#id").val();
	if (id) {
		// 编辑页面
		// 获取角色信息
		jQuery.post(ctx + "/system/role/look/json", {
			id : id
		}, function(_json) {
			if (_json.status == "success") {
				// 获取所有已选的菜单信息
				showdata(_json, treeObj);
			} else {
				parent.layer.msg(_json.message);
			}
		});
	}
}