
$(function(){
	$("#result").click(function(){
		str = "";
		for (var i = 0; i < signals.length; i++) {
			str += "The index of the feature points of signal[" + i.toString() + "]: " + signals[i].featurePoints.toString() +"\r\n";
		}
		alert(str);
	})
});
