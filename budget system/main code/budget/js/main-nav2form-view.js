require.config({
    paths: {
        jquery: 'jquery-1.12.1.min',
        map: 'ajaxRouteMap',
        config: 'config',
        Util: 'Util',
        Big: 'Big',
        uploadFormate: 'ajaxUploadFormate'
    },
    shim: {
        'jquery': {
            deps: ['jquery-1.12.1.min'],
            exports: 'jquery'
        }
    }
});

define(['jquery', 'map', 'config', 'Util', 'Big', 'uploadFormate'], function ($, map, config, Util, Big, uploadFormate) {
    //返回 国拨或自筹 ——(0：国拨；1：自筹)
    function getMoneyType() {
        // 初始为选中对应国拨 checked===false
        // 点击选中对应自筹 checked===true
        var type = 0;
        $('.i-check input')[0].checked === true ? type = 1 : type = 0;
        return type;
    }

    // 返回velocity获取的子课题ID
    function getTaskId() {
        console.log(window.top.sTaskId);
        return window.top.sTaskId;//iframe啊啊啊
    }

    // 返回当前data-nav-type
    function getNavType() {
        return $('.main-nav a.nav-current').data('navType');
    }

    // 获取4种金额（国拨分配、国拨预算、自筹分配、自筹预算）
    function getMoney(sTaskId) {
        var $grantBudgetList = $('.nav-wrap .main-nav').eq(0).children('.ui-nav-list'),//国拨分配
            $grantSettledList = $('.nav-wrap .main-nav').eq(1).children('.ui-nav-list'),//国拨预算
            $raiseBudgetList = $('.nav-wrap .main-nav').eq(2).children('.ui-nav-list'),//自筹分配
            $raiseSettledList = $('.nav-wrap .main-nav').eq(3).children('.ui-nav-list');//自筹预算
        //经费支出 0
        //购置设备费 3
        //其他支出 15
        //间接费用 16
        //绩效指出 17
        $.ajax({
            // type: "POST",
            url: ctx + map.moneyType.downLoad,//ajax地址
            dataType: 'json',
            data: {'sTaskId': sTaskId}
        }).done(function (msg) {
            // renderDOM($grantBudgetList, msg.map.countryCaseBase);
            countryRenderDOM($grantBudgetList, msg.map.countryCaseBase);//国拨分配
            renderDOM($grantSettledList, msg.map.countryCase);//国拨预算
            selfRenderDOM($raiseBudgetList, msg.map.selfCaseBase);//自筹分配
            renderDOM($raiseSettledList, msg.map.selfCase);//自筹预算
        }).done(function(msg){//判断国拨分配 和 国拨预算的金额是否相等
            var indexArray = [];
            if(msg.map.countryCaseBase[0] != msg.map.countryCase[0]){
               indexArray.push(0);
            }
            if(msg.map.countryCaseBase[3] != msg.map.countryCase[3]){
               indexArray.push(3);
            }
            if(msg.map.countryCaseBase[15] != msg.map.countryCase[15]){
               indexArray.push(15);
            }
            if(msg.map.countryCaseBase[16] != msg.map.countryCase[16]){
               indexArray.push(16);
            }
            if(msg.map.countryCaseBase[17] != msg.map.countryCase[17]){
               indexArray.push(17);
            }

            for (var i = 0; i < indexArray.length; i++) {
                $grantBudgetList.find('input')[indexArray[i]].style.cssText='border-color:red';
                $grantSettledList.find('input')[indexArray[i]].style.cssText='border-color:red';
            }
        });

        function renderDOM($wrap, valueArray) {
            $wrap.find('input').each(function (index, el) {
                if ($(this).val() != valueArray[index]) {
                    $(this).val(function () {
                        return valueArray[index];
                    });
                }
            });
        }

        function countryRenderDOM($wrap, valueArray) {
            $wrap.children('li').each(function (index, el) {
                if (index == 0) {//加载经费支出
                    $(this).find('input').val(valueArray[index]);
                } else if (index == 3) {//加载购置设备费
                    $(this).find('input').val(valueArray[index]);
                } else if (index == 15) {//加载其他费用
                    $(this).find('input').val(valueArray[index]);
                } else if (index == 16) {//加载间接费用
                    $(this).find('input').val(valueArray[index]);
                } else if (index == 17) {//加载绩效支出
                    $(this).find('input').val(valueArray[index]);
                } else {
                    $(this).find('input').attr('disabled', 'disabled');
                    $(this).find('input').removeAttr('placeholder');
                }
            });
        }

        function selfRenderDOM($wrap, valueArray) {
            $wrap.children('li').each(function (index, el) {
                if (index == 0) {//加载经费支出
                    $(this).find('input').val(valueArray[index]);
                } else {
                    $(this).find('input').attr('disabled', 'disabled');
                    $(this).find('input').removeAttr('placeholder');
                }
            });
        }
        function noEqualTip(el){
            el.style.cssText='border-color:red';
        }
    };
    // ajax获取数据
    function ajaxRenderDom(options) {
        // 其他费用 和 间接经费 和 绩效支出
        if (options.data.itemEnglishName == 'otherExpense' || options.data.itemEnglishName == 'indirectExpenditure' || options.data.itemEnglishName == 'performanceFee') {
            var $extraPop = $('.extra-pop');
            // 关闭弹层逻辑
            $extraPop.undelegate('.close', 'click').delegate('.close', 'click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $extraPop.hide();
                $('.back-blur').hide();
                // $('.main-nav a[data-nav-type]').removeClass('nav-current');
            });

            // 监听 input
            $extraPop.find('input').off('input').on('input', function (event) {
                var reg = /^([1-9](\d){0,7}|0)(\.([\d]){0,2})?$/;//input 监听功能的实现 还是有bug 能输入1. 没办法的事啊，总比可以输入一大堆0好看
                var value = $(this).val();
                console.log(value);
                if (value.match(reg)) {
                    // 
                } else {
                    $(this).val(function () {
                        return value.slice(0, -1);
                    });
                }
            });

            /*$.ajax({
             // type: "POST",
             url: options.url,
             dataType: options.dataType,
             data: options.data
             }).done(function(msg){//拉取数据*/
            //构造弹层
            Util.backBlur(null, 100).setUp();
            //构造数据显示层
            // getMoneyType() == 0 ? function(){
            //     if(options.data.itemEnglishName=='indirectExpenditure' || options.data.itemEnglishName=='performanceFee'){

            //     }
            //     $extraPop.children('.title').html(msg.map.table.title + '<span style="font-size:12px;"> / 国拨（'+ '万元' +'）</span>');
            // }() : function(){
            //     $extraPop.children('.title').html(msg.map.table.title + '<span style="font-size:12px;"> / 自筹（'+ '万元' +'）</span>');
            // }();

            $extraPop.children('.value').find('input').val(function () {
                if (options.data.itemEnglishName == 'otherExpense' && (getMoneyType() == 0)) {//国拨分配——其他支出
                    $extraPop.children('.title').html('其他支出' + '<span style="font-size:12px;"> / 国拨（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(1).children('.ui-nav-list').children().eq(15).find('input').val() || '';
                } else if (options.data.itemEnglishName == 'otherExpense' && (getMoneyType() == 1)) {//自筹分配——其他支出
                    $extraPop.children('.title').html('其他支出' + '<span style="font-size:12px;"> / 自筹（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(1).children('.ui-nav-list').children().eq(15).find('input').val() || '';
                } else if (options.data.itemEnglishName == 'indirectExpenditure' && (getMoneyType() == 0)) {// 国拨分配——间接费用
                    $extraPop.children('.title').html('间接费用' + '<span style="font-size:12px;"> / 国拨（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(1).children('.ui-nav-list').children().eq(16).find('input').val() || '';
                } else if (options.data.itemEnglishName == 'performanceFee' && (getMoneyType() == 0)) {// 国拨分配——绩效支出
                    $extraPop.children('.title').html('绩效支出' + '<span style="font-size:12px;"> / 国拨（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(1).children('.ui-nav-list').children().eq(17).find('input').val() || '';
                } else if (options.data.itemEnglishName == 'indirectExpenditure' && (getMoneyType() == 1)) {//自筹——间接费用
                    $extraPop.children('.title').html('间接费用' + '<span style="font-size:12px;"> / 自筹（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(3).children('.ui-nav-list').children().eq(16).find('input').val() || '';
                } else if (options.data.itemEnglishName == 'performanceFee' && (getMoneyType() == 1)) {//自筹——绩效支出
                    $extraPop.children('.title').html('绩效支出' + '<span style="font-size:12px;"> / 自筹（' + '万元' + '）</span>');
                    return $('.nav-wrap .main-nav').eq(3).children('.ui-nav-list').children().eq(17).find('input').val() || '';
                }
                // return msg.map.table.listValue[0] || '';
            });
            Util.center($extraPop, 501, true).show();
            // }).done(function(msg){//提交数据
            $extraPop.undelegate('.btn-success', 'click').delegate('.btn-success', 'click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                // 获取金额
                options.data.value = parseFloat($extraPop.find('input').val()) || 0;
                $.ajax({
                    type: 'POST',
                    url: ctx + map[options.data.itemEnglishName].upLoad,//ajax地址
                    data: options.data
                }).done(function (msg) {
                    console.log(JSON.stringify(options.data));
                    // 判断 若提交成功 就关闭弹层
                    $extraPop.find('.close').trigger('click');
                    // 刷新左侧 金额
                    getMoney(options.data.sTaskId);
                }).fail(function () {
                    console.log(arguments[0]);
                    console.log(arguments[1]);
                });
            });
            // });
            return;
        }

        // 默认ajax加载
        $.ajax({
            // type: "POST",
            url: options.url,
            dataType: options.dataType,
            data: options.data
        }).done(function (msg) {//测算说明
            if (msg.statusCode != 200) {
                alert('ajax出错');
                return;
            }
            var contentInfor = msg.map.info;
            $('.content-infor h3').html(contentInfor.title);

            var content = contentInfor.content || '',
                placeholder = contentInfor.placeholder || '请输入' + contentInfor.title;

            $('.content-infor textarea').val(content);
            $('.content-infor textarea').get(0).placeholder = placeholder;
        }).done(function (msg) {//加载相应样式
            if (options.url.match(/equipmentPurchasePost/)) {
                matchId("equipmentPurchasePost");
            } else if (options.url.match(/trialProductionEquipmentCost/)) {
                matchId("trialProductionEquipmentCost");
            } else if (options.url.match(/rentalFee/)) {
                matchId("rentalFee");
            } else if (options.url.match(/materialsExpense/)) {
                matchId("materialsExpense");
            } else if (options.url.match(/testFee/)) {
                matchId("testFee");
            } else if (options.url.match(/fuelAndPowerCost/)) {
                matchId("fuelAndPowerCost");
            } else if (options.url.match(/trivialExpense/)) {
                matchId("trivialExpense");
            } else if (options.url.match(/conferenceExpenses/)) {
                matchId("conferenceExpenses");
            } else if (options.url.match(/internationalCooperationExchangeFee/)) {
                matchId("internationalCooperationExchangeFee");
            } else if (options.url.match(/publishingFee/)) {
                matchId("publishingFee");
            } else if (options.url.match(/serviceFee/)) {
                matchId("serviceFee");
            } else if (options.url.match(/expertConsultingFee/)) {
                matchId("expertConsultingFee");
            }
            ;
        }).done(function () {//取消弹层
            $('.location-wrap').css({'display': 'none'});
            $('.radio-type-wrap').css({'display': 'none'});
        }).done(function (msg) {//table
            var table = msg.map.table;
            //表头
            $('.container table caption').html(table.title + ' 合计：<span></span>（' + table.unit + '）/ <span style="color:red">*金额以最终打印输出的结果为准。输入大段文字时按下enter键即可在任意处换行。</span>');
            //表字段
            var thHTML = '<th></th>',
                tableField = table.list.split(','),
                feildLength = tableField.length;
            thHTML += '<th><span style="color:red;">*</span>' + tableField[0] + '</th>';//第一个字段必填项 加*
            for (var i = 1; i < feildLength; i++) {
                thHTML += '<th>' + tableField[i] + '</th>';
            }
            $('.container table thead tr').html(thHTML);
            //数据行 给每个td增加了索引类
            var listValue = table.listValue,
                listLength = listValue.length,
                valuArray = null,
                tbodyHTML = '';
            for (var n = 0; n < listLength; n++) {
                valuArray = listValue[n].split(',');
                tbodyHTML += '<tr><td class="td-item-' + 0 + '"><span class="glyphicon glyphicon-minus"></span></td>';//删除按钮
                for (var j = 0; j < feildLength; j++) {
                    if (!!valuArray[j]) {
                        tbodyHTML += '<td class="td-item-' + parseFloat(j + 1) + '"><div contenteditable="true">' + valuArray[j] + '</div></td>';
                    } else {
                        tbodyHTML += '<td class="td-item-' + parseFloat(j + 1) + '"><div contenteditable="true"></div></td>';
                    }
                }
                tbodyHTML += '</tr>';
            }
            // 插入数据行 并监听input过滤div
            $('.container table tbody').html(tbodyHTML)
                .delegate('div[contenteditable="true"]', 'input', function (event) {
                    var reg = /<div><br><\/div>/,
                        htmlValue = $(this).html();
                    $(this).html(function () {
                        return htmlValue.replace(reg, '<br>');
                    });
                });

            // 新增按钮
            /*$('.container table tfoot tr td').html(function () {
                return '<span class="glyphicon glyphicon-plus"></span>';
            });*/
            // 表格操作
            // 删除当前行
            /*$('table').undelegate('click').delegate('.glyphicon.glyphicon-minus', 'click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                // $(this).parent().parent().remove();
                //删除时更新总计
                if (options.url.match(/equipmentPurchasePost/)) {
                    //unit控制单位 0为单位统一，1为单位不统一
                    updateTableTotal(5, unit);
                } else if (options.url.match(/trialProductionEquipmentCost/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/rentalFee/)) {
                    updateTableTotal(2, unit);
                } else if (options.url.match(/materialsExpense/)) {
                    updateTableTotal(4, unit);
                } else if (options.url.match(/testFee/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/fuelAndPowerCost/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/trivialExpense/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/conferenceExpenses/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/internationalCooperationExchangeFee/)) {
                    var unit = 1;
                    updateTableTotal(6, unit);
                } else if (options.url.match(/publishingFee/)) {
                    updateTableTotal(4, unit);
                } else if (options.url.match(/serviceFee/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/expertConsultingFee/)) {
                    updateTableTotal(7, unit);
                }
            });*/
            // 新增
            /*$('table tfoot tr .glyphicon.glyphicon-plus').off('click').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var str = '<tr><td><span class="glyphicon glyphicon-minus"></span>';
                for (var k = 0; k < feildLength; k++) {
                    str += '<td><div contenteditable="true"></div></td>';
                }
                str += '</tr>';
                $('table tbody').append(str);
            });*/

            // 国际交流与合作 增加国家选择（默认处于第一个）********************************
            /*if (options.url.match(/internationalCooperationExchangeFee/)) {
                var td = null;
                $('.container tbody').undelegate('mouseenter').delegate('td', 'mouseenter', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var index = $(this).index();
                    if (index !== 1) {
                        return;
                    }
                    td = this;
                    $('.location-list').each(function (index, el) {
                        ( el.scrollTop > 0 ) && ( el.scrollTop = 0 );
                    });
                    var offset = $(this).offset(),
                        height = $(this).outerHeight(true);
                    $('.location-wrap').css({
                        top: offset.top + height,
                        left: offset.left,
                        display: 'block'
                    });

                    // 取消地址弹层
                    $('.location-wrap').off('mouseleave').on('mouseleave', function (event) {
                        $(this).css({
                            display: 'none'
                        });
                    });
                    // 取消地址弹层
                    $(document).on('click', function (event) {
                        var target = event.target;
                        if (target === td || target === $(td).children('div')[0]) {
                            return;
                        }
                        $('.location-wrap').trigger('mouseleave');
                    });
                });
                // 地址层选择国家
                $('.location-wrap .location-list.country').undelegate('click').delegate('li', 'click', function (evnet) {
                    event.preventDefault();
                    event.stopPropagation();
                    // this指代li
                    $(td).children('div').html($(this).html().replace(/(^\s*)|(\s*$)/g, ''));
                    // console.log($(this).data('listValue'));//0国际旅费参考值 | 1住宿费 | 2伙食费 | 3公杂费 | 4参考汇率
                    var listValue = $(this).data('listValue');
                    $(td).children('div').attr('data-list-value', listValue);
                    listArray = listValue.split(',');
                    //0国际旅费参考值 | 1住宿费 | 2伙食费 | 3公杂费 | 4参考汇率
                    //更新国际旅费并重新计算住宿工杂合计、总额、更新合计
                    var trIndex = $(td).parent().index();
                    var $thisTrChildrenTd = $('.container table tbody tr').eq(trIndex).children('td');//获取本行td
                    var sumIndex = 6;//总额索引
                    var elementsObj = {//获取本行对象
                        $peoplenum: $thisTrChildrenTd.eq(2).children('div'),
                        $days: $thisTrChildrenTd.eq(3).children('div'),
                        $miscellaneousfee: $thisTrChildrenTd.eq(4).children('div'),
                        $travelprice: $thisTrChildrenTd.eq(5).children('div'),
                        $sum: $thisTrChildrenTd.eq(6).children('div')
                    };
                    $thisTrChildrenTd.eq(5).children('div').html(function () {//更新国际旅费
                        return listArray[0];
                    });
                    var elementsInfo = {//获取本行对象信息
                        peoplenum: parseInt(elementsObj.$peoplenum.text()) || 0,
                        days: parseInt(elementsObj.$days.text()) || 0,
                        travelprice: parseFloat(elementsObj.$travelprice.text()) || 0
                    };
                    elementsObj.$miscellaneousfee.html(function () {//重新计算住宿工杂费
                        return internationalCooperationExchangeFeeCalc(sumIndex).getMiscellaneousFee(elementsInfo.peoplenum, elementsInfo.days, elementsObj);
                    });
                    elementsObj.$sum.html(function () {//重新计算总额
                        return internationalCooperationExchangeFeeCalc(sumIndex).getTotal(elementsInfo.peoplenum, elementsInfo.days, elementsInfo.travelprice, elementsObj);
                    });
                    updateTableTotal(sumIndex, 1);
                });
            } else if (options.url.match(/expertConsultingFee/)) {// 专家咨询费 增加类别选择（会议 或 通讯）
                var td = null;
                $('.container tbody').undelegate('mouseenter').delegate('td', 'mouseenter', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var index = $(this).index();
                    if (index !== 2) {
                        return;
                    }
                    td = this;
                    var offset = $(this).offset(),
                        height = $(this).outerHeight(true);
                    $('.radio-type-wrap').css({
                        top: offset.top + height,
                        left: offset.left,
                        display: 'block'
                    });

                    // 取消专家类别选择
                    $('.radio-type-wrap').off('mouseleave').on('mouseleave', function (event) {
                        $(this).css({
                            display: 'none'
                        });
                        $(this).children().children('li').removeClass('current');
                    });
                    // 取消专家类别选择弹层
                    $(document).on('click', function (event) {
                        var target = event.target;
                        if (target === td || target === $(td).children('div')[0]) {
                            return;
                        }
                        $('.radio-type-wrap').trigger('mouseleave');
                    });
                });
                // 地址层选择类别
                $('.radio-type-wrap ul').undelegate('click').delegate('li', 'click', function (evnet) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).addClass('current').siblings().removeClass('current');
                    // this指代li
                    $(td).children('div').html($(this).html().replace(/(^\s*)|(\s*$)/g, ''));
                    console.log($(td)[0]);
                    var trIndex = $(td).parent().index();
                    var $thisTrChildrenTd = $('.container table tbody tr').eq(trIndex).children('td');//获取本行td
                    var sumIndex = 7;//总额索引
                    var elementsObj = {//获取本行对象
                        $type: $thisTrChildrenTd.eq(2).children('div'),
                        $count: $thisTrChildrenTd.eq(3).children('div'),
                        $days: $thisTrChildrenTd.eq(4).children('div'),
                        $expertnum: $thisTrChildrenTd.eq(5).children('div'),
                        $standard: $thisTrChildrenTd.eq(6).children('div'),
                        $sum: $thisTrChildrenTd.eq(7).children('div')
                    };
                    var elementsInfo = {//获取本行对象信息
                        count: parseInt(elementsObj.$count.text()) || 0,
                        days: parseInt(elementsObj.$days.text()) || 0,
                        expertnum: parseInt(elementsObj.$expertnum.text()) || 0,
                        standard: parseFloat(elementsObj.$standard.text()) || 0
                    };
                    if (elementsObj.$type.text() == "会议") {
                        var fee = 800;
                        Util.inputInvalidAndMoveEnd(elementsObj.$days);
                        elementsObj.$days.css("cursor", "default").attr('contenteditable', 'true');
                        elementsObj.$standard.html(function () {//更新费用标准
                            return fee;
                        });
                        elementsObj.$sum.html(function () {//重新计算总额
                            return expertConsultingFeeCalc(sumIndex).getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, fee);
                        });
                    } else if (elementsObj.$type.text() == "通讯") {
                        var fee = 400;
                        elementsObj.$days.text('');
                        elementsObj.$days.removeAttr('contenteditable').css("cursor", "not-allowed");
                        elementsObj.$standard.html(function () {//更新费用标准
                            return fee;
                        });
                        elementsObj.$sum.html(function () {//重新计算总额
                            return expertConsultingFeeCalc(sumIndex).getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, fee);
                        });
                    }
                    updateTableTotal(sumIndex, 0);
                });
                //加载到通讯类别时禁用天数
                $('.container tbody tr').each(function (index, element) {
                    var typeText = $(this).children('td').eq(2).children('div').text();
                    if (typeText == "会议") {
                        $(this).children('td').eq(4).children('div').css("cursor", "default").attr('contenteditable', 'true');
                    } else if (typeText == "通讯") {
                        $(this).children('td').eq(4).children('div').removeAttr('contenteditable').css("cursor", "not-allowed");
                    }
                })
            } else {
                $('.radio-type-wrap').css({display: 'none'});
                $('.container tbody').undelegate('mouseenter');
                $('.radio-type-wrap ul').undelegate('click');
                $('.radio-type-wrap').off('mouseleave');

                //++++++++++++//
                $('.location-wrap').css({display: 'none'});
                $('.container tbody').undelegate('mouseenter');
                $('.location-wrap .location-list.country').undelegate('click');
                $('.location-wrap').off('mouseleave');
            }*/

            var updateTotalOnEntry = function () {
                if (options.url.match(/equipmentPurchasePost/)) {
                    //unit控制单位 0为单位统一，1为单位不统一
                    updateTableTotal(5, unit);
                } else if (options.url.match(/trialProductionEquipmentCost/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/rentalFee/)) {
                    updateTableTotal(2, unit);
                } else if (options.url.match(/materialsExpense/)) {
                    updateTableTotal(4, unit);
                } else if (options.url.match(/testFee/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/fuelAndPowerCost/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/trivialExpense/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/conferenceExpenses/)) {
                    updateTableTotal(6, unit);
                } else if (options.url.match(/internationalCooperationExchangeFee/)) {
                    var unit = 1;
                    updateTableTotal(6, unit);
                } else if (options.url.match(/publishingFee/)) {
                    updateTableTotal(4, unit);
                } else if (options.url.match(/serviceFee/)) {
                    updateTableTotal(5, unit);
                } else if (options.url.match(/expertConsultingFee/)) {
                    updateTableTotal(7, unit);
                }
            };
            updateTotalOnEntry();

        }).done(function (msg) {//滑动层
            var flow = msg.map.description;
            list = flow.list;
            $('.flow-container .main-bar').eq(0).html(flow.title_desc);
            $('.flow-container .main-content').eq(0).html(flow.description);
            $('.flow-container .main-bar').eq(1).html(flow.title_list);
            var listHTML = '<ul>';
            for (var x = 0, length = list.length; x < length; x++) {
                listHTML += '<li>' + list[x] + '</li>';
            }
            $('.flow-container .main-content').eq(1).html(listHTML);
        }).done(function () {//计算
            if (options.url.match(/equipmentPurchasePost/)) {// 购置设备费
                var unit = 0;//0为单位统一   1为单位不统一
                var sumIndex = 5;//总额所在索引位置
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(3).children('div'),
                            $number = $(this).children('td').eq(4).children('div'),
                            $sum = $(this).children('td').eq(5).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    //indexArray是长度限制数组
                    //notEditableIndex是不可编辑数组
                    //maxLength是限制长度
                    var indexArray = [1, 2, 6, 7];
                    var notEditableIndex = [5];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/trialProductionEquipmentCost/)) {//试制设备费
                var unit = 0;
                var sumIndex = 5;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(3).children('div'),
                            $number = $(this).children('td').eq(4).children('div'),
                            $sum = $(this).children('td').eq(5).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    var indexArray = [1, 2, 6, 7];
                    var notEditableIndex = [5];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/rentalFee/)) {//改造与租赁设备费{
                var sumIndex = 2;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $fee = $(this).children('td').eq(2).children('div');
                        rentalFeeCalc(sumIndex).fee2total($fee);
                        Util.moneyLarge($fee);
                    });
                    var indexArray = [1];
                    var notEditableIndex = [];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/materialsExpense/)) {//材料费
                var unit = 0;
                var sumIndex = 4;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(2).children('div'),
                            $number = $(this).children('td').eq(3).children('div'),
                            $sum = $(this).children('td').eq(4).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    var indexArray = [1, 5];
                    var notEditableIndex = [4];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/testFee/)) {//测试化验加工费
                var unit = 1;
                var sumIndex = 6;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(4).children('div'),
                            $number = $(this).children('td').eq(5).children('div'),
                            $sum = $(this).children('td').eq(6).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    var indexArray = [1, 2, 3, 7];
                    var notEditableIndex = [6];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/fuelAndPowerCost/)) {//燃料动力费
                var unit = 1;
                var sumIndex = 5;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(2).children('div'),
                            $number = $(this).children('td').eq(4).children('div'),
                            $sum = $(this).children('td').eq(5).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    var indexArray = [1, 3, 6];
                    var notEditableIndex = [5];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/trivialExpense/)) {//差旅费
                var sumIndex = 6;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var elementsObj = {
                            $count: $(this).children('td').eq(1).children('div'),
                            $peoplenum: $(this).children('td').eq(2).children('div'),
                            $days: $(this).children('td').eq(3).children('div'),
                            $standard: $(this).children('td').eq(4).children('div'),
                            $commutefee: $(this).children('td').eq(5).children('div'),
                            $sum: $(this).children('td').eq(6).children('div')
                        }
                        trivialExpenseCalc(sumIndex).count2total(elementsObj);
                        trivialExpenseCalc(sumIndex).peoplenum2total(elementsObj);
                        trivialExpenseCalc(sumIndex).days2total(elementsObj);
                        trivialExpenseCalc(sumIndex).standard2total(elementsObj);
                        trivialExpenseCalc(sumIndex).commutefee2total(elementsObj);
                        Util.amount(elementsObj.$count);
                        Util.amount(elementsObj.$peoplenum);
                        Util.amount(elementsObj.$days);
                        Util.moneyLarge(elementsObj.$standard);
                        Util.moneyLarge(elementsObj.$commutefee);
                    });
                    var indexArray = [7];
                    var notEditableIndex = [6];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/conferenceExpenses/)) {//会议费
                var sumIndex = 6;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var elementsObj = {
                            $count: $(this).children('td').eq(2).children('div'),
                            $days: $(this).children('td').eq(3).children('div'),
                            $peoplenum: $(this).children('td').eq(4).children('div'),
                            $standard: $(this).children('td').eq(5).children('div'),
                            $sum: $(this).children('td').eq(6).children('div')
                        }
                        conferenceFeeCalc(sumIndex).count2total(elementsObj);
                        conferenceFeeCalc(sumIndex).days2total(elementsObj);
                        conferenceFeeCalc(sumIndex).peoplenum2total(elementsObj);
                        conferenceFeeCalc(sumIndex).standard2total(elementsObj);
                        Util.amount(elementsObj.$count);
                        Util.amount(elementsObj.$days);
                        Util.amount(elementsObj.$peoplenum);
                        Util.moneyLarge(elementsObj.$standard);
                    });
                    var indexArray = [1, 7];
                    var notEditableIndex = [6];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/internationalCooperationExchangeFee/)) {//国际合作与交流费
                var sumIndex = 6;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var elementsObj = {
                            $peoplenum: $(this).children('td').eq(2).children('div'),
                            $days: $(this).children('td').eq(3).children('div'),
                            $miscellaneousfee: $(this).children('td').eq(4).children('div'),
                            $travelprice: $(this).children('td').eq(5).children('div'),
                            $sum: $(this).children('td').eq(6).children('div')
                        }
                        internationalCooperationExchangeFeeCalc(sumIndex).peoplenum2total(elementsObj);
                        internationalCooperationExchangeFeeCalc(sumIndex).days2total(elementsObj);
                        internationalCooperationExchangeFeeCalc(sumIndex).travel2total(elementsObj);
                        Util.amount(elementsObj.$peoplenum);
                        Util.amount(elementsObj.$days);
                        Util.moneyLarge(elementsObj.$travelprice);
                    });
                    var indexArray = [1, 7];
                    var notEditableIndex = [1, 4, 6];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/publishingFee/)) {//出版/……/知识产权
                var unit = 1;
                var sumIndex = 4;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var $price = $(this).children('td').eq(2).children('div'),
                            $number = $(this).children('td').eq(3).children('div'),
                            $sum = $(this).children('td').eq(4).children('div');
                        commonCalcFunc(sumIndex, unit).price2total($price, $number, $sum);
                        commonCalcFunc(sumIndex, unit).num2total($number, $price, $sum);
                        Util.moneyLarge($price);
                        Util.amount($number);
                    });
                    var indexArray = [1, 5];
                    var notEditableIndex = [4];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/serviceFee/)) {//劳务费
                var sumIndex = 5;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var elementsObj = {
                            $peoplenum: $(this).children('td').eq(2).children('div'),
                            $time: $(this).children('td').eq(3).children('div'),
                            $standard: $(this).children('td').eq(4).children('div'),
                            $sum: $(this).children('td').eq(5).children('div')
                        };
                        serviceFeeCalc(sumIndex).peoplenum2total(elementsObj);
                        serviceFeeCalc(sumIndex).time2total(elementsObj);
                        serviceFeeCalc(sumIndex).standard2total(elementsObj);
                        Util.amount(elementsObj.$peoplenum);
                        Util.amount(elementsObj.$time);
                        Util.moneyLarge(elementsObj.$standard);
                    });
                    var indexArray = [1, 6];
                    var notEditableIndex = [5];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            } else if (options.url.match(/expertConsultingFee/)) {//专家咨询费
                var sumIndex = 7;
                var calc = function () {
                    var $tr = $('.container>table>tbody>tr');
                    $tr.each(function (index, el) {
                        var elementsObj = {
                            $type: $(this).children('td').eq(2).children('div'),
                            $count: $(this).children('td').eq(3).children('div'),
                            $days: $(this).children('td').eq(4).children('div'),
                            $expertnum: $(this).children('td').eq(5).children('div'),
                            $standard: $(this).children('td').eq(6).children('div'),
                            $sum: $(this).children('td').eq(7).children('div')
                        };
                        expertConsultingFeeCalc(sumIndex).count2total(elementsObj);
                        expertConsultingFeeCalc(sumIndex).days2total(elementsObj);
                        expertConsultingFeeCalc(sumIndex).expertnum2total(elementsObj);
                        expertConsultingFeeCalc(sumIndex).standard2total(elementsObj);
                        Util.amount(elementsObj.$count);
                        Util.amount(elementsObj.$days);
                        Util.amount(elementsObj.$expertnum);
                        Util.moneySmall(elementsObj.$standard);
                    });
                    var notEditableIndex = [2, 7];
                    var indexArray = [1];
                    var maxLength = config.lengthConfig.length;
                    Util.lengthAndNotEditable(indexArray, notEditableIndex, maxLength);
                };
                calc();
                $('table tfoot tr .glyphicon.glyphicon-plus').on('click', function (event) {
                    calc();
                });
            }
        }).done(function () {//帮助文档
            //新ajax内容
            $('.box-content .help-content .help-txt').empty();
            $('.box-content .help-content .help-pic').empty();

            var helpUrl = '';
            if (options.url.match(/equipmentPurchasePost/)) {
                helpUrl = map.equipmentPurchasePost.helpDownload;
            } else if (options.url.match(/trialProductionEquipmentCost/)) {
                helpUrl = map.trialProductionEquipmentCost.helpDownload;
            } else if (options.url.match(/rentalFee/)) {
                helpUrl = map.rentalFee.helpDownload;
            } else if (options.url.match(/materialsExpense/)) {
                helpUrl = map.materialsExpense.helpDownload;
            } else if (options.url.match(/testFee/)) {
                helpUrl = map.testFee.helpDownload;
            } else if (options.url.match(/fuelAndPowerCost/)) {
                helpUrl = map.fuelAndPowerCost.helpDownload;
            } else if (options.url.match(/trivialExpense/)) {
                helpUrl = map.trivialExpense.helpDownload;
            } else if (options.url.match(/conferenceExpenses/)) {
                helpUrl = map.trivialExpense.helpDownload;
            } else if (options.url.match(/internationalCooperationExchangeFee/)) {
                helpUrl = map.internationalCooperationExchangeFee.helpDownload;
            } else if (options.url.match(/publishingFee/)) {
                helpUrl = map.publishingFee.helpDownload;
            } else if (options.url.match(/serviceFee/)) {
                helpUrl = map.serviceFee.helpDownload;
            } else if (options.url.match(/expertConsultingFee/)) {
                helpUrl = map.expertConsultingFee.helpDownload;
            }
            ;
            $.ajax({
                url: ctx + helpUrl,//ajax地址
                type: 'POST'
            }).done(function (msg) {
                $('.box-content .help-content .help-txt').html(msg.map.infor);
                var str = msg.map.images;
                var htmlStr = '';
                for (var i = 0; i < str.length; i++) {
                    // htmlStr += '<img src="'+str[i]+'">';//str[i].substring(2);
                }
                ;
                $('.box-content .help-content .help-pic').html(htmlStr);

            }).fail(function (msg) {
                console.log("error");
            });
        })
    }

    // 导航切换 返回undefined
    var setMoneyType2DownLoad = function () {
        $('.i-check input').off('click').on('click', function (event) {
            event.stopPropagation();
            // 初始为选中对应国拨 this.checked===false
            // 点击选中对应自筹 this.checked===true
            this.checked === true ? function () {
                $('.nav-default').hide();
                $('.nav-selected').show();
            }() : function () {
                $('.nav-default').show();
                $('.nav-selected').hide();
            }();

            var sTaskId = getTaskId();
            var navType = getNavType();
            // var downLoadName = map[navType].downLoad;
            var type = getMoneyType();
            ajaxRenderDom({
                url: ctx + map[navType].downLoad,//ajax地址
                dataType: 'json',
                data: {'sTaskId': sTaskId, 'itemEnglishName': navType, 'moneytype': type}
            });
        });
    }();
    //默认初始化 返回undefined
    /*var initeDownLoad = function () {
        var sTaskId = getTaskId();
        var type = getMoneyType();
        ajaxRenderDom({
            url: map.equipmentPurchasePost.downLoad,//1 //ajax地址
            dataType: 'json',
            data: {'sTaskId': sTaskId, 'itemEnglishName': 'equipmentPurchasePost', 'moneytype': type}
        });
        getMoney(sTaskId);
    }();*/
    //点击初始化 返回undefined
    var clickNav2DownLoad = function () {
        $('.main-nav a[data-nav-type]').off('click').on('click', function (event) {
            console.log(this);
            event.preventDefault();
            event.stopPropagation();
            var target = event.target;
            /*if (target.tagName === 'SPAN') {
                target = $(target).parent();
            }
            if (!$(target).data('navType')) {
                return;
            }*/
            // if ($(target).hasClass('nav-current')) {
            //     return;
            // }
            $('.main-nav a[data-nav-type]').removeClass('nav-current');
            $(target).addClass('nav-current');
            var sTaskId = getTaskId();
            var navType = $(target).data('navType');
            var type = getMoneyType();
            var downLoadName = map[navType].downLoad;
            ajaxRenderDom({
                url: ctx + map[navType].downLoad,// ajax地址
                dataType: 'json',
                data: {'sTaskId': sTaskId, 'itemEnglishName': navType, 'moneytype': type}
            });
            getMoney(sTaskId);
        });
    }();

    /*########################################################*/
    // 地址联动
    /*##########################################################*/

    // 单价数量计算总金额
    function commonCalcFunc(sumIndex, unit) {
        var setPrice = function ($price, $num, $sum) {
            bindEvent($price, 'input', function () {
                event.preventDefault();
                var priceStr = $price.text();
                var price = parseFloat(priceStr) || 0;
                var numberStr = $num.text();
                var number = parseInt(numberStr) || 0;
                if (priceStr.match(config.regConfig.moneyLargeReg)) {//输入匹配正确(前面已调用Util验证过一次，此处再次校验)
                    $sum.html(function () {//计算总额
                        return getTotal(price, number, unit);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计(总额的位置,合计与总额单位是否统一:0|是 1|否)
                } else {//匹配错误且至少有一个不为数字
                    $sum.html(function () {
                        return getTotal(0, number, unit);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setNum = function ($num, $price, $sum) {
            bindEvent($num, 'input', function () {
                event.preventDefault();
                var priceStr = $price.text();
                var price = parseFloat(priceStr) || 0;
                var numberStr = $num.text();
                var number = parseInt(numberStr) || 0;
                if (numberStr.match(config.regConfig.amountReg)) {
                    $sum.html(function () {
                        return getTotal(price, number, unit);
                    });
                    updateTableTotal(sumIndex, 0);
                } else {//匹配错误且不为数字
                    $sum.html(function () {
                        return getTotal(price, 0, unit);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);
                    Util.inputInvalidAndMoveEnd($(this));
                }

            });
        };
        var getTotal = function (price, number, unit) {
            var numberBig = {
                price: Big(price),
                number: Big(number)
            };
            var totalDif = numberBig.price.times(numberBig.number).div(10000).toFixed(2);//单位不统一
            var total = numberBig.price.times(numberBig.number).toFixed(2);//单位统一
            if (unit) {
                return totalDif;
            } else {
                return total;
            }
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            price2total: setPrice,
            num2total: setNum
        }
    }

    //设备改造与租赁费
    function rentalFeeCalc(sumIndex) {
        var setFee = function ($fee) {
            bindEvent($fee, 'input', function () {
                var fee = $(this).text();
                if (fee.match(config.regConfig.moneyLargeReg)) {
                    updateTableTotal(sumIndex, 0);
                } else if (!$.isNumeric(fee)) {//匹配错误且不为数字
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            })
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            fee2total: setFee
        }
    }

    //差旅费
    function trivialExpenseCalc(sumIndex) {
        var setCount = function (elementsObj) {
            bindEvent(elementsObj.$count, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.countStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr) && $.isNumeric(elementsInfo.commutefeeStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr) || !$.isNumeric(elementsInfo.commutefeeStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(0, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setPeopleNum = function (elementsObj) {
            bindEvent(elementsObj.$peoplenum, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.peoplenumStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr) && $.isNumeric(elementsInfo.commutefeeStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr) || !$.isNumeric(elementsInfo.commutefeeStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, 0, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setDays = function (elementsObj) {
            bindEvent(elementsObj.$days, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.daysStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr) && $.isNumeric(elementsInfo.commutefeeStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr) || !$.isNumeric(elementsInfo.commutefeeStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, elementsInfo.peoplenum, 0, elementsInfo.standard, elementsInfo.commutefee);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setStandard = function (elementsObj) {
            bindEvent(elementsObj.$standard, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.standardStr.match(config.regConfig.moneyLargeReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr) && $.isNumeric(elementsInfo.commutefeeStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr) || !$.isNumeric(elementsInfo.commutefeeStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, 0, elementsInfo.commutefee);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setCommuteFee = function (elementsObj) {
            bindEvent(elementsObj.$commutefee, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.commutefeeStr.match(config.regConfig.moneyLargeReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr) && $.isNumeric(elementsInfo.commutefeeStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, elementsInfo.commutefee);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr) || !$.isNumeric(elementsInfo.commutefeeStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, elementsInfo.peoplenum, elementsInfo.days, elementsInfo.standard, 0);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };

        var getElements = function (elementsObj) {
            var elementsInfo = {
                countStr: elementsObj.$count.text(),
                count: parseInt(elementsObj.$count.text()) || 0,
                peoplenumStr: elementsObj.$peoplenum.text(),
                peoplenum: parseInt(elementsObj.$peoplenum.text()) || 0,
                daysStr: elementsObj.$days.text(),
                days: parseInt(elementsObj.$days.text()) || 0,
                standardStr: elementsObj.$standard.text(),
                standard: parseInt(elementsObj.$standard.text()) || 0,
                commutefeeStr: elementsObj.$commutefee.text(),
                commutefee: parseInt(elementsObj.$commutefee.text()) || 0
            };
            return elementsInfo;
        };
        var getTotal = function (count, peoplenum, days, standard, commutefee) {
            var numberBig = {
                count: Big(count),
                peoplenum: Big(peoplenum),
                days: Big(days),
                standard: Big(standard),
                commutefee: Big(commutefee)
            };
            var total = numberBig.count.times(numberBig.peoplenum).times(numberBig.days).times(numberBig.standard)
                .plus(numberBig.peoplenum.times(numberBig.commutefee).times(numberBig.count)).div(10000).toFixed(2);

            return total;
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            count2total: setCount,
            peoplenum2total: setPeopleNum,
            days2total: setDays,
            standard2total: setStandard,
            commutefee2total: setCommuteFee
        }
    }

    //会议费计算方式
    function conferenceFeeCalc(sumIndex) {

        var setCount = function (elementsObj) {
            bindEvent(elementsObj.$count, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.countStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.days, elementsInfo.peoplenum, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(0, elementsInfo.days, elementsInfo.peoplenum, elementsInfo.standard);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setDays = function (elementsObj) {
            bindEvent(elementsObj.$days, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.daysStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.days, elementsInfo.peoplenum, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, 0, elementsInfo.peoplenum, elementsInfo.standard);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setPeopleNum = function (elementsObj) {
            bindEvent(elementsObj.$peoplenum, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.peoplenumStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.days, elementsInfo.peoplenum, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, elementsInfo.days, 0, elementsInfo.standard);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setStandard = function (elementsObj) {
            bindEvent(elementsObj.$standard, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.standardStr.match(config.regConfig.moneyLargeReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.count, elementsInfo.days, elementsInfo.peoplenum, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.daysStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.count, elementsInfo.days, elementsInfo.peoplenum, 0);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };

        var getElements = function (elementsObj) {
            var elementsInfo = {
                countStr: elementsObj.$count.text(),
                count: parseInt(elementsObj.$count.text()) || 0,
                daysStr: elementsObj.$days.text(),
                days: parseInt(elementsObj.$days.text()) || 0,
                peoplenumStr: elementsObj.$peoplenum.text(),
                peoplenum: parseInt(elementsObj.$peoplenum.text()) || 0,
                standardStr: elementsObj.$standard.text(),
                standard: parseFloat(elementsObj.$standard.text()) || 0
            };
            return elementsInfo;
        };
        var getTotal = function (count, days, peoplenum, standard) {
            var numberBig = {
                count: Big(count),
                days: Big(days),
                peoplenum: Big(peoplenum),
                standard: Big(standard)
            };
            var total = numberBig.count.times(numberBig.days).times(peoplenum).times(standard).div(10000).toFixed(2);
            return total;
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            count2total: setCount,
            days2total: setDays,
            peoplenum2total: setPeopleNum,
            standard2total: setStandard
        }
    }

    //国际合作与交流费
    function internationalCooperationExchangeFeeCalc(sumIndex) {
        var setPeopleNum = function (elementsObj) {
            bindEvent(elementsObj.$peoplenum, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.peoplenumStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$miscellaneousfee.html(function () {
                            return getMiscellaneousFee(elementsInfo.peoplenum, elementsInfo.days, elementsObj);
                        });
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.days, elementsInfo.travelprice, elementsObj);
                        });
                        updateTableTotal(sumIndex, 1);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.daysStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$miscellaneousfee.html(function () {
                        return getMiscellaneousFee(0, elementsInfo.days, elementsObj);
                    });
                    elementsObj.$sum.html(function () {
                        return getTotal(0, elementsInfo.days, elementsInfo.travelprice, elementsObj);
                    });
                    updateTableTotal(sumIndex, 1);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setDays = function (elementsObj) {
            bindEvent(elementsObj.$days, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.daysStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.daysStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$miscellaneousfee.html(function () {
                            return getMiscellaneousFee(elementsInfo.peoplenum, elementsInfo.days, elementsObj);
                        });
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.days, elementsInfo.travelprice, elementsObj);
                        });
                        updateTableTotal(sumIndex, 1);
                    }
                } else if (!$.isNumeric(elementsInfo.countStr) || !$.isNumeric(elementsInfo.daysStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$miscellaneousfee.html(function () {
                        return getMiscellaneousFee(elementsInfo.peoplenum, 0, elementsObj);
                    });
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.peoplenum, 0, elementsInfo.travelprice, elementsObj);
                    });
                    updateTableTotal(sumIndex, 1);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setTravelPrice = function (elementsObj) {
            bindEvent(elementsObj.$travelprice, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.travelpriceStr.match(config.regConfig.moneyLargeReg)) {
                    if ($.isNumeric(elementsInfo.miscellaneousfeeStr) && $.isNumeric(elementsInfo.travelpriceStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.days, elementsInfo.travelprice, elementsObj);
                        });
                        updateTableTotal(sumIndex, 1);
                    }
                } else if (!$.isNumeric(elementsInfo.miscellaneousfeeStr) || !$.isNumeric(elementsInfo.travelpriceStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.peoplenum, elementsInfo.days, 0, elementsObj);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 1);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };

        var getElements = function (elementsObj) {
            var elementsInfo = {
                peoplenumStr: elementsObj.$peoplenum.text(),
                peoplenum: parseInt(elementsObj.$peoplenum.text()) || 0,
                daysStr: elementsObj.$days.text(),
                days: parseInt(elementsObj.$days.text()) || 0,
                miscellaneousfeeStr: elementsObj.$miscellaneousfee.text(),
                miscellaneousfee: parseFloat(elementsObj.$miscellaneousfee.text()) || 0,
                travelpriceStr: elementsObj.$travelprice.text(),
                travelprice: parseFloat(elementsObj.$travelprice.text()) || 0
            };
            return elementsInfo;
        };
        //获取div上的数据
        var getData = function (elementsObj) {
            var trIndex = elementsObj.$sum.parent().parent().index();
            var $listDom = $('.container table tbody tr').eq(trIndex).children('td').eq(1).children('div');
            var listValue = $listDom.attr('data-list-value');
            var listArray = listValue.split(',');
            return listArray;
        };
        //合计 = 住宿工杂合计+国际旅费参考值*人数
        var getTotal = function (peoplenum, days, travelprice, elementsObj) {//0国际旅费参考值 | 1住宿费 | 2伙食费 | 3公杂费 | 4参考汇率
            var listArray = getData(elementsObj);
            var accommodationFee = parseFloat(listArray[1]) || 0;
            var mealsFee = parseFloat(listArray[2]) || 0;
            var workingFee = parseFloat(listArray[3]) || 0;
            var exchangeRate = parseFloat(listArray[4]) || 0;
            var numberBig = {
                peoplenum: Big(peoplenum),
                days: Big(days),
                travelprice: Big(travelprice),
                accommodationFee: Big(accommodationFee),
                mealsFee: Big(mealsFee),
                workingFee: Big(workingFee),
                exchangeRate: Big(exchangeRate)
            };
            var miscellaneousFeeBig = numberBig.accommodationFee.plus(numberBig.mealsFee).plus(numberBig.workingFee)
                .times(numberBig.exchangeRate).times(numberBig.peoplenum).times(numberBig.days);
            var total = miscellaneousFeeBig.plus(numberBig.travelprice.times(numberBig.peoplenum)).toFixed(2);
            return total;
        };
        //住宿工杂合计 = (住宿费+伙食费+公杂费)*参考汇率*人数*天数
        var getMiscellaneousFee = function (peoplenum, days, elementsObj) {//0国际旅费参考值 | 1住宿费 | 2伙食费 | 3公杂费 | 4参考汇率
            var listArray = getData(elementsObj);
            var accommodationFee = parseFloat(listArray[1]) || 0;
            var mealsFee = parseFloat(listArray[2]) || 0;
            var workingFee = parseFloat(listArray[3]) || 0;
            var exchangeRate = parseFloat(listArray[4]) || 0;
            var numberBig = {
                peoplenum: Big(peoplenum),
                days: Big(days),
                accommodationFee: Big(accommodationFee),
                mealsFee: Big(mealsFee),
                workingFee: Big(workingFee),
                exchangeRate: Big(exchangeRate)
            };
            var miscellaneousFee = numberBig.accommodationFee.plus(numberBig.mealsFee).plus(numberBig.workingFee)
                .times(numberBig.exchangeRate).times(numberBig.peoplenum).times(numberBig.days).toFixed(2);
            return miscellaneousFee;
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            peoplenum2total: setPeopleNum,
            days2total: setDays,
            travel2total: setTravelPrice,
            getMiscellaneousFee: getMiscellaneousFee,
            getTotal: getTotal
        }
    }

    //劳务费计算方式
    function serviceFeeCalc(sumIndex) {
        var setPeopleNum = function (elementsObj) {
            bindEvent(elementsObj.$peoplenum, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.peoplenumStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.timeStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.time, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.timeStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(0, elementsInfo.time, elementsInfo.standard);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setTime = function (elementsObj) {
            bindEvent(elementsObj.$time, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.timeStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.timeStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.time, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.timeStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且至少有一个不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.peoplenum, 0, elementsInfo.standard);
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setStandard = function (elementsObj) {
            bindEvent(elementsObj.$standard, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.standardStr.match(config.regConfig.moneyLargeReg)) {
                    if ($.isNumeric(elementsInfo.peoplenumStr) && $.isNumeric(elementsInfo.timeStr)
                        && $.isNumeric(elementsInfo.standardStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            return getTotal(elementsInfo.peoplenum, elementsInfo.time, elementsInfo.standard);
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                } else if (!$.isNumeric(elementsInfo.peoplenumStr) || !$.isNumeric(elementsInfo.timeStr)
                    || !$.isNumeric(elementsInfo.standardStr)) {//匹配错误且不为数字
                    elementsObj.$sum.html(function () {
                        return getTotal(elementsInfo.peoplenum, elementsInfo.time, 0);//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                } else {
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var getElements = function (elementsObj) {
            var elementsInfo = {
                peoplenumStr: elementsObj.$peoplenum.text(),
                peoplenum: parseInt(elementsObj.$peoplenum.text()) || 0,
                timeStr: elementsObj.$time.text(),
                time: parseInt(elementsObj.$time.text()) || 0,
                standardStr: elementsObj.$standard.text(),
                standard: parseFloat(elementsObj.$standard.text()) || 0
            };
            return elementsInfo;
        };
        var getTotal = function (peoplenum, time, standard) {
            var numberBig = {
                peoplenum: Big(peoplenum),
                time: Big(time),
                standard: Big(standard)
            };
            var total = numberBig.peoplenum.times(numberBig.time).times(numberBig.standard).div(10000).toFixed(2);
            return total;
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            peoplenum2total: setPeopleNum,
            time2total: setTime,
            standard2total: setStandard
        }
    }

    //专家咨询费计算方式
    function expertConsultingFeeCalc(sumIndex) {
        var setCount = function (elementsObj) {
            bindEvent(elementsObj.$count, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.countStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.days) && $.isNumeric(elementsInfo.expertnumStr)) {//全部为数字则计算专家人次
                        elementsObj.$sum.html(function () {
                            if (elementsObj.$type.text() == "会议") {
                                return getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                            } else if (elementsObj.$type.text() == "通讯") {
                                return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, elementsInfo.standard);
                            }
                        });
                        updateTableTotal(sumIndex, 0);//更新合计
                    }
                }
                else {
                    elementsObj.$sum.html(function () {
                        if (elementsObj.$type.text() == "会议") {
                            return getConferenceTotal(0, elementsInfo.days, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                        } else if (elementsObj.$type.text() == "通讯") {
                            return getCommunicationTotal(0, elementsInfo.expertnum, elementsInfo.standard);
                        }
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setDays = function (elementsObj) {
            bindEvent(elementsObj.$days, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.daysStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.days) && $.isNumeric(elementsInfo.expertnumStr)) {//全部为数字则计算专家人次
                        elementsObj.$sum.html(function () {
                            if (elementsObj.$type.text() == "会议") {
                                return getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                            } else if (elementsObj.$type.text() == "通讯") {
                                return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, elementsInfo.standard);
                            }
                        });
                        updateTableTotal(sumIndex, 0);//更新合计
                    }
                }
                else {
                    elementsObj.$sum.html(function () {
                        if (elementsObj.$type.text() == "会议") {
                            return getConferenceTotal(elementsInfo.count, 0, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                        } else if (elementsObj.$type.text() == "通讯") {
                            return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, elementsInfo.standard);
                        }
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setExpertNum = function (elementsObj) {
            bindEvent(elementsObj.$expertnum, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.expertnumStr.match(config.regConfig.amountReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.days) && $.isNumeric(elementsInfo.expertnumStr)) {//全部为数字则计算专家人次
                        elementsObj.$sum.html(function () {
                            if (elementsObj.$type.text() == "会议") {
                                return getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                            } else if (elementsObj.$type.text() == "通讯") {
                                return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, elementsInfo.standard);
                            }
                        });
                        updateTableTotal(sumIndex, 0);//更新合计
                    }
                }
                else {
                    elementsObj.$sum.html(function () {
                        if (elementsObj.$type.text() == "会议") {
                            return getConferenceTotal(elementsInfo.count, elementsInfo.days, 0, elementsInfo.standard);//重新计算总额
                        } else if (elementsObj.$type.text() == "通讯") {
                            return getCommunicationTotal(elementsInfo.count, 0, elementsInfo.standard);
                        }
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };
        var setStandard = function (elementsObj) {
            bindEvent(elementsObj.$standard, 'input', function () {
                event.preventDefault();
                var elementsInfo = getElements(elementsObj);
                if (elementsInfo.standardStr.match(config.regConfig.moneySmallReg)) {
                    if ($.isNumeric(elementsInfo.countStr) && $.isNumeric(elementsInfo.days) && $.isNumeric(elementsInfo.expertnumStr)) {//全部为数字则计算总额并更新合计
                        elementsObj.$sum.html(function () {
                            if (elementsObj.$type.text() == "会议") {
                                return getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, elementsInfo.standard);//重新计算总额
                            } else if (elementsObj.$type.text() == "通讯") {
                                return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, elementsInfo.standard);
                            }
                        });
                        updateTableTotal(sumIndex, 0);
                    }
                }
                else {
                    elementsObj.$sum.html(function () {
                        if (elementsObj.$type.text() == "会议") {
                            return getConferenceTotal(elementsInfo.count, elementsInfo.days, elementsInfo.expertnum, 0);//重新计算总额
                        } else if (elementsObj.$type.text() == "通讯") {
                            return getCommunicationTotal(elementsInfo.count, elementsInfo.expertnum, 0);
                        }//将this数值置零，重新计算总额
                    });
                    updateTableTotal(sumIndex, 0);//更新合计
                    Util.inputInvalidAndMoveEnd($(this));
                }
            });
        };

        var getElements = function (elementsObj) {
            var elementsInfo = {
                countStr: elementsObj.$count.text(),
                count: parseInt(elementsObj.$count.text()) || 0,
                daysStr: elementsObj.$days.text(),
                days: parseInt(elementsObj.$days.text()) || 0,
                expertnumStr: elementsObj.$expertnum.text(),
                expertnum: parseInt(elementsObj.$expertnum.text()) || 0,
                standardStr: elementsObj.$standard.text(),
                standard: parseFloat(elementsObj.$standard.text()) || 0
            };
            return elementsInfo;
        };
        var getConferenceTotal = function (count, days, expertnum, standard) {
            var numberBig = {
                count: Big(count),
                days: Big(days),
                expertnum: Big(expertnum),
                standard: Big(standard)
            };
            if (days <= 2) {
                var total = numberBig.count.times(numberBig.days).times(numberBig.expertnum).times(numberBig.standard).div(10000).toFixed(2);
                return total;
            } else {
                var section1Big = numberBig.count.times(numberBig.expertnum).times(numberBig.standard).times(2);
                var section2Big = numberBig.days.minus(2).times(numberBig.count).times(numberBig.expertnum).times(numberBig.standard).div(2);
                var total = section1Big.plus(section2Big).div(10000).toFixed(2);
                return total;
            }
        };
        var getCommunicationTotal = function (count, expertnum, standard) {
            var numberBig = {
                count: Big(count),
                expertnum: Big(expertnum),
                standard: Big(standard)
            };
            var total = numberBig.count.times(numberBig.expertnum).times(numberBig.standard).div(10000).toFixed(2);
            return total;
        };

        function bindEvent($el, type, fn) {
            var selector = $el.selector;
            $el.parent().delegate(selector, type, function (event) {
                fn.call($el[0], event);
            });
        }

        return {
            count2total: setCount,
            days2total: setDays,
            expertnum2total: setExpertNum,
            standard2total: setStandard,
            getConferenceTotal: getConferenceTotal,
            getCommunicationTotal: getCommunicationTotal
        }
    }

    function matchId(id) {
        $('.container table').attr("id", id);
    }

    //更新合计
    function updateTableTotal(sumIndex, unit) {
        var sum = 0;
        $('.container table tbody tr').each(function (index, el) {
            var $el = $(this).children('td').eq(sumIndex).children('div');
            var valueStr = $el.text();
            var value = parseFloat(valueStr) || 0;
            sum = sum + value;
        });
        var $tableCaption = $('.container table caption').children('span').eq(0);
        var sumBig = Big(sum);
        if (unit) {
            $tableCaption.html(sumBig.div(10000).toFixed(2));
        } else {
            $tableCaption.html(sumBig.toFixed(2));
        }
    }

    ////Updated by Ding

    //右侧帮助文档按钮
    var rightBtnHidden = function () {
        $('.right-box').delegate('.cs-btn', 'click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('.right-box .flow-container')[0].style.display = 'block';
            $('.right-box .box-content')[0].style.width = '400px';
            $('.right-box .help-content')[0].style.display = 'none';
            $('.right-box .cs-btn').addClass('current');
            $('.right-box .help-btn').removeClass('current');
            $('.right-box .tol-btn')[0].style.display = 'block';

        });
        $('.right-box').delegate('.help-btn', 'click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('.right-box .flow-container')[0].style.display = 'none';
            $('.right-box .help-content')[0].style.display = 'block';
            $('.right-box .box-content')[0].style.width = '400px';
            $('.right-box .cs-btn').removeClass('current');
            $('.right-box .help-btn').addClass('current');
            $('.right-box .tol-btn')[0].style.display = 'block';
        });
        //总按钮
        $('.right-box').delegate('.tol-btn', 'click', function (event) {
            $('.right-box .flow-container').fadeOut('normal');
            $('.right-box .help-content').fadeOut('normal');
            $('.right-box .box-content').animate({width: 0}, 'normal');
            $('.right-box .help-btn').removeClass('current');
            $('.right-box .cs-btn').removeClass('current');
            $('.right-box .tol-btn')[0].style.display = 'none';
        });

        //帮助文档图片变大
        $('.right-box .help-content .help-title').delegate('.glyphicon', 'click', function (event) {
            if ($('.right-box .help-content .help-title span').attr('class') == 'glyphicon glyphicon-zoom-in') {
                $('.right-box .box-content').css('width', '600px');
                $('.right-box .help-content .help-pic').css('height', '320px');
                $('.right-box .help-content .help-title span').attr('class', 'glyphicon glyphicon-zoom-out');
            } else {
                $('.right-box .box-content').css('width', '400px');
                $('.right-box .help-content .help-pic').css('height', '280px');
                $('.right-box .help-content .help-title span').attr('class', 'glyphicon glyphicon-zoom-in');
            }
            ;
        });
    }();

    /*##########################################################*/

    // 点击保存提交表单 返回undefined
    var click2UpLoad = function () {
        $('.form-action button').eq(0).off('click').on('click', function (event) {
            var flag = false;
            // 同级td有内容，强制填写必填项
            for (var i = 0; i < $('.container table tbody tr').length; i++) {
                for (var j = 2; j < $('.container table tbody tr').eq(i).children().length; j++) {
                    if ($('.container table tbody tr').eq(i).children().eq(j).children().html().replace(/(^\s*)|(\s*$)/g, '').length > 0) {
                        if ($('.container table tbody tr').eq(i).children().eq(1).children().html().replace(/(^\s*)|(\s*$)/g, '').length <= 0) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (!!flag) {
                    alert('第' + parseFloat(i + 1) + '行的第一列是必填项！');
                    // break;
                    return;
                }
            }
            // if(!!flag){ return; }

            if ($('#expertConsultingFee').length > 0) {//专家咨询费 必须输入类别
                for (var i = 0; i < $('.container table tbody tr').length; i++) {
                    var typeValue = $('.container table tbody tr').eq(i).children('td').eq(2).children('div').html();
                    if (typeValue != '会议' && typeValue != '通讯') {
                        alert('请在第' + parseFloat(i + 1) + '行选择类别');
                        return;
                    }
                }
            }

            if ($('#equipmentPurchasePost').length > 0) {//购置设备费
                var moreTipArray = [];
                for (var i = 0; i < $('.container table tbody tr').length; i++) {
                    var value = parseFloat($('.container table tbody tr').eq(i).children('td').eq(3).children('div').text()) || 0;
                    if (value >= 10) {
                        moreTipArray.push(i + 1);
                    }
                }
                if (moreTipArray.length > 0) {
                    alert('第' + moreTipArray.join() + '行单价大于10万，请在输出的word表格中，补上“购置类型”等其他必填项！');
                }
            }

            var textarea = $('.content-infor textarea').val().replace(/(^\s*)|(\s*$)/g, ''),//文本框值
                feildList = null,//表单字段
                valueArray = [],//N行的td值 二维数组
                value = null;//某行的td值 一维数组
            $('.container table tbody tr').each(function (index, el) {
                //第一个表单字段是必填字段 为空则跳出循环 tr td div 过滤为空的行
                if ($(el).children().eq(1).children().html().replace(/(^\s*)|(\s*$)/g, '').length <= 0) {
                    return false;
                }
                value = [];
                $(el).children('td').each(function (_index, _el) {
                    if (_index == 0) {
                        return true;
                    }//排除减号
                    // value.push($(_el).children().html().replace(/(^\s*)|(\s*$)/g, ''));
                    value.push($(_el).children().html().replace(/<(\/)?div>/gi, ''));//过滤div
                });
                valueArray.push(value);
            });
            var sTaskId = getTaskId(),//子课题id
                navType = getNavType(),//款项的英文标识
                moneyType = getMoneyType(),//0：国拨；1：自筹
                calculateExplain = $('.content-infor textarea').val();//测算说明
            feildList = uploadFormate[navType].feildList;
            // 新建提交对象 一般字段
            var upLoadObj = {
                sTaskId: sTaskId,
                itemEnglishName: navType,
                moneytype: moneyType,
                calculateExplain: calculateExplain
            }
            // 新建提交对象 追加字段
            for (var i = 0; i < feildList.length; i++) {//字段的个数
                upLoadObj[feildList[i]] = '';
                for (var j = 0; j < valueArray.length; j++) {//tr的行数
                    upLoadObj[feildList[i]] += '$$' + valueArray[j][i];//,换成$$
                }
                upLoadObj[feildList[i]] = upLoadObj[feildList[i]].slice(2);
            }
            //
            $.ajax({
                type: 'POST',
                url: ctx + map[navType].upLoad,//ajax地址
                data: upLoadObj
            }).done(function (msg) {
                // console.log(msg);
                if (!!msg.message) {
                    alert(msg.message);
                }
                console.log(upLoadObj);
            }).done(function (msg) {
                getMoney(sTaskId);
            });
        });
    }();

    // 关闭
    var click2Close = function () {
        $('.form-action button').eq(1).off('click').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        });
    }();
});