(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.config = factory();
    }
}(this, function () {
	// 配置文件
    var config = {
        regConfig: {
            moneyLargeReg: /^([1-9](\d){0,7}|0)(\.([\d]){0,2})?$/,   //万元金额的正则表达式
            moneySmallReg: /^([1-9](\d){0,9}|0)(\.([\d]){0,2})?$/,   //元金额的正则表达式
            amountReg: /^([1-9]){1}([0-9])*$/   //数量的正则表达式
        },
        lengthConfig: {
            length: 3000
        }
    };
    return config;
}));