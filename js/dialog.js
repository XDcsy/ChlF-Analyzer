//before parse.js
var head, end, headByValue, endByValue;


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
		end = 1000000;
	$( "#dialog1" ).dialog( "close" );
});
$( "#dialog1-btn2" ).button().click(function() {
	head = undefined;
	end = undefined;
	headByValue = parseInt($("#dialog1-value-min").val());
	endByValue = parseInt($("#dialog1-value-max").val());
	if (isNaN(head))
		head = 0;
	if (isNaN(end))
		end = 1000000;
	$( "#dialog1" ).dialog( "close" );
});



$( "#dialog2" ).dialog({ autoOpen: false });




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
