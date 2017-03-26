(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.map = factory();
    }
}(this, function () {
    
    var map = {
        equipmentPurchasePost:{
        	downLoad:'/taskUpData/equipmentPurchasePost/save/json',
            upLoad:'/taskUpData/equipmentPurchasePost/save',
            helpDownload:'/json/help/equipmentPurchasePost_help.json'
        },
        trialProductionEquipmentCost:{
        	downLoad:'/taskUpData/trialProductionEquipmentCost/save/json',
            upLoad:'/taskUpData/trialProductionEquipmentCost/save',
            helpDownload:'/json/help/trialProductionEquipmentCost_help.json'
        },
        rentalFee:{
        	downLoad:'/taskUpData/rentalFee/save/json',
            upLoad:'/taskUpData/rentalFee/save',
            helpDownload:'/json/help/rentalFee_help.json'
        },
        materialsExpense:{
        	downLoad:'/taskUpData/materialsExpense/save/json',
            upLoad:'/taskUpData/materialsExpense/save',
            helpDownload:'/json/help/materialsExpense_help.json'
        },
        testFee:{
        	downLoad:'/taskUpData/testFee/save/json',
            upLoad:'/taskUpData/testFee/save',
            helpDownload:'/json/help/testFee_help.json'
        },
        fuelAndPowerCost:{
        	downLoad:'/taskUpData/fuelAndPowerCost/save/json',
            upLoad:'/taskUpData/fuelAndPowerCost/save',
            helpDownload:'/json/help/fuelAndPowerCost_help.json'
        },
        trivialExpense:{
        	downLoad:'/taskUpData/trivialExpense/save/json',
            upLoad:'/taskUpData/trivialExpense/save',
            helpDownload:'/json/help/trivialExpense_help.json'
        },
        conferenceExpenses:{
        	downLoad:'/taskUpData/conferenceExpenses/save/json',
            upLoad:'/taskUpData/conferenceExpenses/save',
            helpDownload:'/json/help/conferenceExpenses_help.json'
        },
        internationalCooperationExchangeFee:{
        	downLoad:'/taskUpData/internationalCooperationExchangeFee/save/json',
            upLoad:'/taskUpData/internationalCooperationExchangeFee/save',
            helpDownload:'/json/help/internationalCooperationExchangeFee_help.json'
        },
        publishingFee:{
        	downLoad:'/taskUpData/publishingFee/save/json',
            upLoad:'/taskUpData/publishingFee/save',
            helpDownload:'/json/help/publishingFee_help.json'
        },
        serviceFee:{
        	downLoad:'/taskUpData/serviceFee/save/json',
            upLoad:'/taskUpData/serviceFee/save',
            helpDownload:'/json/help/serviceFee_help.json'
        },
        expertConsultingFee:{
        	downLoad:'/taskUpData/expertConsultingFee/save/json',
            upLoad:'/taskUpData/expertConsultingFee/save',
            helpDownload:'/json/help/expertConsultingFee_help.json'
        },
        otherExpense:{
            downLoad:'/taskUpData/otherFee/save/json',
            upLoad:'/taskUpData/otherFee/save',
            helpDownload:'/json/help/otherExpense_help.json'
        },
        indirectExpenditure:{
        	downLoad:'#',
            upLoad:'/taskUpData/otherFee/indirectExpenditureSave',
            helpDownload:'/json/help/indirectExpenditure_help.json'
        },
        performanceFee:{
        	downLoad:'#',
            upLoad:'/taskUpData/otherFee/performanceFeeSave',
            helpDownload:'/json/help/performanceFee_help.json'
        },
        moneyType:{
        	downLoad:'/taskUpData/taskUpData/list/json'
        }
    }
    return map;
}));