(function(){
	var formCheck = {
		userNameReg:function(){
			return /^[a-zA-Z]{1}([\w-*]){4,14}|(^[\u4E00-\uFA29]{1}[\w-*\u4E00-\uFA29]{2,7})$/;
			//大小写字母开头包含字母数字下划线 和'-'0次或多次，共5到15位
			//汉字开头，包含字母数字下划线 和'-'0次或多次 和 汉字，共3到8位
		},
		passwordReg:function(){
		return /^(\w|\w*[~!@#$%^&*()+`\\\-\=\{\}:";'<>?,.\/\|]){6,16}$/;
			//字母数字下划线 或 特殊字符，共6到16位
		},
		emailReg:function(){
			return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			//part1:字母数字下划线 和 '-'0次或多次，和'.'领0次或多次   共一次或多次
			//part2:@
			//part3:字母数字下划线 和 '-'0次或一次，共一次或多次
			//part4:'.' 和 字母数字下划线，共大于等于2次
		},
		phoneNumberReg:function(){
			return /^1\d{10}$/;
			//1开头，共11位
		},
		telNumberReg:function(){
			return /^0\d{2,3}-?\d{7,8}$/;
			//区号+号码，区号以0开头，3位或4位
			//号码由7位或8位数字组成
			//区号与号码之间可以无连接符，也可以“-”连接
		},
		codeReg:function(){
			return /^[A-Za-z0-9]{4}$/i;
			//大小写字母，数字，共4次
		}
	}
	
	
	// 注册弹窗
	$('#registerbtn').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.out-box').css("display","block");
		$('.register-inf').css("display","block");
		$('.login-inf').css("display","none");
		// 提交注册
		$('#register').off('click').on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			//1.参数校验
  			//2.ajax提交
  			//3.成功弹出窗体，让其登陆
  			//4.失败显示失败原因
  			var account = $("#phone").val();
  			var email = $("#email").val();
  			var passFirst = $("#passFirst").val();
  			var passSecond = $("#passSecond").val();
  			var result = true;
  			if(!formCheck.phoneNumberReg().test(account)){
  				addErrorTips('phone','请输入正确的手机号');
  				result = result&&false;
  			}else{
  				//清空所有的提示框
  				removeTips('phone');
  			}
  			if(!formCheck.emailReg().test(email)){
  				addErrorTips('email','请输入正确的个人邮箱');
  				result = result&&false;
  			}else{
  				//清空所有的提示框
  				removeTips('email');
  			}
  			if(!formCheck.passwordReg().test(account)){
  				addErrorTips('passFirst','请输入正确的密码');
  				result = result&&false;
  			}else{
  				//清空所有的提示框
  				removeTips('passFirst');
  			}
  			if(passFirst!=passSecond){
  				addErrorTips('passSecond','确认密码和初始密码必须相等，且不能为空');
  				result = result&&false;
  			}else{
  				//清空所有的提示框
  				removeTips('passSecond');
  			}
  			if(!result){
  				return;
  			}
  			
  			//提交
  			jQuery.post(ctx + "/register", {
  				account : account,
  				email : email,
  				password : passFirst,
  				qpassword : passSecond
			}, function(_json) {
				if (_json.status == "success") {
					layer.alert(_json.message,function(){
						window.location.href = ctx+"/login";
					});
				} else {
					layer.alert(_json.message);
				}
			});
			console.log('注册');
		});
		$('.out-box').off('click').on('keydown', function(event){
			if(event.which==13){
				$('#register').trigger('click');
			}
		});
	});
	// 登录弹窗
	$('#loginbtn').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.out-box').css("display","block");
		$('.login-inf').css("display","block");
		$('.register-inf').css("display","none");
		// 提交登录
		$('#login').off('click').on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			//1.参数校验
  			//2.ajax提交
  			//3.成功弹出窗体，让其登陆
  			//4.失败显示失败原因
  			var account = $("#account").val();
  			var password = $("#password").val();
  			var result = true;
  			if(!formCheck.phoneNumberReg().test(account) && !formCheck.emailReg().test(account)){
  				addErrorTips('account','请输入正确的手机号');
  				result = result&&false;
  			}else{
  				//清空提示框
  				removeTips('account');
  			}
  			if(!formCheck.passwordReg().test(password)){
  				addErrorTips('password','请输入正确的密码');
  				result = result&&false;
  			}else{
  				//清空提示框
  				removeTips('password');
  			}
  			if(!result){
  				return;
  			}
  			//提交
  			jQuery.post(ctx + "/login", {
  				account : account,
  				password : password
			}, function(_json) {
				if (_json.status == "success") {
					window.location.href = ctx+"/index";
				} else {
					layer.alert(_json.message);
				}
			});
			console.log('登录');
		});
		$('.out-box').off('click').on('keydown', function(event){
			if(event.which==13){
				// 登录
				$('#login').trigger('click');
			}
		});
	});

	// 关闭按钮
	$('.close-btn').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.out-box').css("display","none");
		$('.register-inf').css("display","none");
		$('.login-inf').css("display","none");
		$('.out-box').find('input').each(function(index, el){
			$(this).val('');
		});
		removeTips('account');
		removeTips('phone');
		removeTips('email');
		removeTips('passFirst');
		removeTips('passSecond');
		removeTips('password');
	});
})();