var menuTreesetting = {
	view: {
			addHoverDom: addHoverDom,
			removeHoverDom: removeHoverDom,
			selectedMulti: false,
			expandSpeed: "fast"
	},
	callback : {
		onClick : MenuzTreeOnClick
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

function addHoverDom(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
		+ "' title='add node' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_"+treeNode.tId);
	//为按钮绑定事件
	if (btn) btn.bind("click", function(){
		//1.获取表单，重置
		//2.将父节点置为当前节点值
		//$("#updateForm").clearForm(true);
		$('#updateForm').trigger("reset");
		$("#id").val("");
		var treeNodeName = treeNode.name;
		if(treeNode.id == '0'){
			treeNodeName = "";
		}
		$("#pname").val(treeNodeName);
		$("#pid").val(treeNode.id);
		return false;
	});
};

function removeHoverDom(treeId, treeNode) {
	$("#addBtn_"+treeNode.tId).unbind().remove();
};


$(document).ready(function() {

	jQuery.post(ctx+"/system/menu/list/json", function(_json) {
		if (_json.status == "success") {
			$.fn.zTree.init($("#menuListTree"), menuTreesetting, _json.data);
			var zTree =$.fn.zTree.getZTreeObj("menuListTree");
			zTree.expandAll(true);

		} else {
			layer.alert(_json.message);
		}
	});
	
	//为两个按钮绑定事件
	$('#subBtn').click(function(){
		jQuery.post($('#updateForm').attr('action'), $('#updateForm').serialize(),
				function(_json) {
					if (_json.status == "success") {
						layer.alert(_json.message, function() {
							window.location.href = ctx+'/system/menu/list';
						});
					} else {
						layer.alert(_json.message);
					}
				});
	});
	
	$('#delBtn').click(function(){
		var id = jQuery("#id").val();
		if (!id || id == "") {
			layer.alert("请选择你要删除的记录");
			return;
		} else {
			var _url = ctx+"/system/menu/delete?id=" + id;
			jQuery.post(_url, function(_json) {
				layer.alert(_json.message,function(){
					//回调刷新
					window.location.href = ctx+"/system/menu/list";
				});
				
			});
		}
	});
	
	//为父节点绑定点击事件
	/*
	$('#selectP').bind('click',function(){
		layer.open({
			type:2,
			area:['300px','330px'],
			fix:false,
			maxmin:true,
			content:ctx+'/system/menu/tree'
		});
	})
	*/

});

function MenuzTreeOnClick(event, treeId, treeNode) {
	showdata(treeNode);
};

function showdata(result) {
	$("#updateForm select ").each(function() {
		$(this).find('option:first').attr('selected', 'selected');
	});
	for ( var s in result) {
		set_val(s, result[s]);
	}

	var _pid = result["pid"];
	if ((!_pid) || _pid == null || _pid == "null" || _pid == "") {
		jQuery("#pid").val("");
	} else {
		jQuery("#pid").val(_pid);
	}

	var _pNode = result.getParentNode();
	if (_pNode) {
		jQuery("#pname").val(_pNode["name"]);
	} else {
		jQuery("#pname").val("");
	}
}
