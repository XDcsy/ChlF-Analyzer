//before parse.js
var head, end, headByValue, endByValue;
var regions=[];

//添加的内容
$( "#accordion" ).accordion({
    collapsible: true,
	active:false
});
$( "#dialog3" ).dialog({ autoOpen: true });
$( "#dialog4" ).dialog({ autoOpen: true });
$( ".controlgroup" ).controlgroup();



//end
function changeInstruction(n) {
	if (n==1)
		$("#a-instruction").html("“曲率与导数：展示”")
	if (n==4)
		$("#a-instruction").html("“小波变换（Wavelet）”：展示输入信号经小波变换后的图形用于分析。小波变换是空间（时间）和频率的局部变换，能有效地从信号中提取信息。");
}

$( "#dialog1" ).dialog({ autoOpen: false });
$( "#dialog1" ).tabs();
$( "#dialog1-btn1" ).button().click(function() {
	headByValue = undefined;
	endByValue = undefined;  //选择一个tab时将另一个tab获取到的数据清空
	head = parseInt($("#dialog1-index-min").val());
	end = parseInt($("#dialog1-index-max").val());
	if (isNaN(head))  //当用户选择了使用此tab设置，但是数据留空或输入了非数字时，使用的默认值
		head = 0;
	if (isNaN(end))
		end = 99999999;
	$( "#dialog1" ).dialog( "close" );
});
$( "#dialog1-btn2" ).button().click(function() {
	head = undefined;
	end = undefined;
	headByValue = parseInt($("#dialog1-value-min").val());
	endByValue = parseInt($("#dialog1-value-max").val());
	if (isNaN(headByValue))
		headByValue = 0;
	if (isNaN(endByValue))
		endByValue = 99999999;
	$( "#dialog1" ).dialog( "close" );
});

function addArea(isValue) {
	//每当使用这个功能时
	regions = [];  //清空之前的rigions
	if (index && index.length !=0) {  //如果图上已有被选择的区域
	    var range = splitIndex();
		for (var i = 0; i < range.length; i++) { //对每一个区域
		    var startIndex = range[i][0];  //它的首尾index值
			var endIndex = range[i][range[i].length-1];
			regions.push([signals[0].data[startIndex][0], signals[0].data[endIndex][0]]); //对应到signals0的横坐标，添加至rigions
		}
	}
	if (isValue) {
	    var start = parseInt($("#dialog2-value-min").val());
	    var end = parseInt($("#dialog2-value-max").val());
	    regions.push([start, end]);  //用value表示的本次要添加的区域
	}
	else {
	    var start = parseInt($("#dialog2-index-min").val());
	    var end = parseInt($("#dialog2-index-max").val());
		regions.push([signals[0].data[start][0], signals[0].data[end][0]]);  //用index表示的话，利用signals[0]对应到value再添加
	}
	//构造对象
	var areaObjAry = [];
	for (var i = 0; i < regions.length; i++) {
		areaObjAry.push({xAxisIndex: 0,yAxisIndex: 0,brushType: 'rect',coordRange: [regions[i],[-10000,10000]]});
		                                             //应该使用lineX但似乎有bug，只能用rect代替  //rect在y轴方向应该无限延伸
	}
	chart0.dispatchAction({
		type: 'brush',
		areas: areaObjAry,
	});
}

$( "#dialog2" ).dialog({ autoOpen: false });
$( "#dialog2" ).tabs();
$( "#dialog2-btn1" ).button().click(function() {
    addArea(false);
	$("#dialog2-index-min").val("");
	$("#dialog2-index-max").val("");
	$( "#dialog2" ).dialog( "close" );
});
$( "#dialog2-btn2" ).button().click(function() {
    addArea(true);
	$("#dialog2-value-min").val("");
	$("#dialog2-value-max").val("");
	$( "#dialog2" ).dialog( "close" );
});

$( "#trigger1" ).click(function() {
	if (signals.length != 0) {
		alert("This option is only valid before you input any files. Please refresh the page and try again.");
		return;
	}
    $( "#dialog1" ).dialog( "open" );
});
$( "#trigger2" ).click(function() {
    $( "#dialog2" ).dialog( "open" );
});
