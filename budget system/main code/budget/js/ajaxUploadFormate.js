(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.uploadFormate = factory();
    }
}(this, function () {
    
    var map = {  }

    // 购置设备费
	var equipmentPurchasePost={
		/*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		equipmentName:"",//设备名称
		functionAndTechnology:""//功能和技术指标
		unitPrice:"",//单价
		quantity:"",//数量
		totalPrice:"",//总金额
		purchaseCompany:"",//购置单位
		setCompany:"",//安置单位
		remark:""//备注*/
		feildList:['equipmentName','functionAndTechnology', 'unitPrice', 'quantity', 'totalPrice', 'purchaseCompany', 'setCompany', 'remark']
	}
	// 试制设备费
	var trialProductionEquipmentCost={
		/*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		equipmentName:"",//设备名称
		functionAndTechnology:"",//功能和技术指标
		unitPrice:"",//单价
		quantity:"",//数量
		totalPrice:"",//总金额
		trialCompany:"",//试制单位
		setCompany:"",//安置单位
		remark:""//备注*/
		feildList:['equipmentName', 'functionAndTechnology', 'unitPrice', 'quantity', 'totalPrice', 'trialCompany', 'setCompany', 'remark']
	}
	// 设备改造与租赁费
	var rentalFee={
		/*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		equipmentName:"",//设备名称
		totalPrice:"",//总金额
		remark:""//备注(可无)*/
		feildList:['equipmentName', 'totalPrice', 'remark']
	}
	// 材料费
	var materialsExpense={
		/*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		materialName:"",//材料名称
		unitPrice:"",//单价
		quantity:"",//数量
		totalPrice:"",//总金额
		remark:""//备注*/
		feildList:['materialName', 'unitPrice', 'quantity', 'totalPrice', 'remark']
	}
	// 测试化验加工费
	var testFee={
	    /*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		detail:"",//测算化验加工内容
		company:"",//测算化验加工单位
		unit:"",//单位
		unitPrice:"",//单价
		quantity:"",//数量
		totalPrice:"",//总金额
		remark:""//备注*/
		feildList:['detail','company', 'unit', 'unitPrice', 'quantity', 'totalPrice', 'remark']
	}
	// 燃料动力费
	var fuelAndPowerCost = {
	    /*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		equipmentName:"",//项目
		unit:"",//单位
		unitPrice:"",//单价
		quantity:"",//数量
		totalPrice:"",//总金额
		remark:""//备注*/
		feildList:['equipmentName', 'unitPrice', 'unit', 'quantity', 'totalPrice', 'remark']
	}
	// 差旅费
	var trivialExpense = {
	    /*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		times:"",//次数
		personQuantity:"",//人数
		days:"",//天数
		paymentStandards:"",//标准
		trivialFee:"",//往返交通费
		totalPrice:"",//总金额
		remark:""//备注*/
		feildList:['times', 'personQuantity', 'days', 'paymentStandards', 'trivialFee', 'totalPrice', 'remark']
	}
	// 会议费
	var conferenceExpenses = {
	    /*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		name:"",//(会议名称)table DOM获取
		times:"",//(会议次数)table DOM获取
		personQuantity:"",//(人数)table DOM获取
		days:"",//(天数)table DOM获取
		PaymentStandards:"",//(标准  元/人/天)table DOM获取
		totalPrice:"",//（总金额/万元）table DOM
		remark:""//(备注)table DOM获取*/
		feildList:['name', 'times', 'days', 'personQuantity', 'PaymentStandards', 'totalPrice', 'remark']
	}
	// 国际合作与交流费
	var internationalCooperationExchangeFee = {
	    /*sTaskId :"",// (子课题id)VELOCITY全局获取
		itemEnglishName:"",//(款项的英文标识)DOM获取
		moneyType:"",//(0：国拨；1：自筹)DOM获取
		calculateExplain:"",//DOM获取

		countryName:"",//国家
		personQuantity:"",//人数
		days:"",//天数
		LiveChangeTotalPrice:"",//住宿工咋等总计
		internalTrivalFee:"",//国际差旅费（可输入，初始化值为json值）
		totalPrice:"",//总计
		remark:""//备注*/
		feildList:['countryName', 'personQuantity', 'days', 'LiveChangeTotalPrice', 'internalTrivalFee', 'totalPrice', 'remark']
	}
	// 出版/……/知识产权
	var publishingFee = {
		/*sTaskId:'',// VELOCITY全局获取 (子课题id)
		itemEnglishName:'',//DOM获取 (类似id)(款项的英文标识)
		moneyType:'',// (0：国拨；1：自筹)——DOM获取
		calculateExplain:'',// DOM获取

		name:'',// 项目
		quantity:'',// 数量
		unitPrice:'',// 单价
		totalPrice:'',// 总金额
		remark:''// 备注*/
		feildList:['name', 'unitPrice', 'quantity', 'totalPrice', 'remark']
	}
	// 劳务费
	var serviceFee = {
		/*sTaskId:'',// VELOCITY全局获取 (子课题id)
		itemEnglishName:'',//DOM获取 (类似id)(款项的英文标识)
		moneyType:'',// (0：国拨；1：自筹)——DOM获取
		calculateExplain:'',// DOM获取

		peopleWithoutSalary:'',// 没有工资性收入人员
		quantity:'',// 人数
		days:'',// 时间（已月计数）
		unitPrice:'',// 报酬标准
		totalPrice:'',// 费用合计
		remark:''// 备注*/
		feildList:['peopleWithoutSalary', 'quantity', 'days', 'unitPrice', 'totalPrice', 'remark']
	}
	// 专家咨询费
	var expertConsultingFee = {
		/*sTaskId:'',// VELOCITY全局获取 (子课题id)
		itemEnglishName:'',//DOM获取 (类似id)(款项的英文标识)
		moneyType:'',// (0：国拨；1：自筹)——DOM获取
		calculateExplain:'',// DOM获取

		conferenceName:'',// 会议名城
		times:'',// 次数
		numberOfExpert:'',// 专家人数
		expertType:'',//会议 或 咨询
		experts:'',// 专家人次
		days:'',// 天数
		unitPrice:'',// 费用标准
		totalPrice:'',// 总金额
		remark:''// 备注*/
		feildList:['conferenceName','expertType', 'times', 'days', 'numberOfExpert', 'unitPrice', 'totalPrice']
	}
	// 其他费用
	var otherExpense = {
		/*sTaskId:'',// VELOCITY全局获取 (子课题id)
		itemEnglishName:'',//DOM获取 (类似id)(款项的英文标识)
		moneyType:'',// (0：国拨；1：自筹)——DOM获取
		calculateExplain:'',// DOM获取

		content:'',// 支出内容
		total:'',// 金额(万元)
		remark:''// 备注*/
		feildList:['content','total']
	}
    

    // 统一入口
    map.equipmentPurchasePost = equipmentPurchasePost;
    map.trialProductionEquipmentCost = trialProductionEquipmentCost;
    map.rentalFee = rentalFee;
    map.materialsExpense = materialsExpense;
    map.testFee = testFee;
    map.fuelAndPowerCost = fuelAndPowerCost;
    map.trivialExpense = trivialExpense;
    map.conferenceExpenses = conferenceExpenses;
    map.internationalCooperationExchangeFee = internationalCooperationExchangeFee;
    map.publishingFee = publishingFee;
    map.serviceFee = serviceFee;
    map.expertConsultingFee = expertConsultingFee;
    map.otherExpense = otherExpense;

    return map;
}));