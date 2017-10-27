
$(function(){
	$("#result").click(function(){
		str = "";
		for (var i = 0; i < signals.length; i++) {
			str += "The index of the feature points of " + signals[i].name + ": " + signals[i].featurePoints.toString() +"\r\n";
		}
		alert(str);
	})
	
	$("#xlsx").click(function(){
		function Workbook() {
			if(!(this instanceof Workbook)) return new Workbook();
			this.SheetNames = [];
			this.Sheets = {};
		}
		
		var table = [];
		for (var i = 0; i < signals.length; i++) {
			table.push([signals[i].name]);
			table.push(["Feature point index:"]);
			table.push(signals[i].featurePoints);
			table.push([""]);
		}
		var ws = XLSX.utils.aoa_to_sheet(table);
		var wb = new Workbook();
		var ws_name = "Feature points";  //sheet name
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		
		var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

		var wbout = XLSX.write(wb,wopts);

		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}

	/* the saveAs call downloads a file on the local machine */
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "result.xlsx");
	})
});
