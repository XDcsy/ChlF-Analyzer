
$(function(){
	var output = []; //获取文件列表记录
	var files;
	var filesNumber = 0;
	$("#sel").click(function(){
		$("#files").click();
	});
	function handleFileSelect(evt) {
	    files = evt.target.files; // FileList对象 
	    for (var i = 0, f; f = files[i]; i++) {
	        filesNumber++;
  		}
    }
     document.getElementById('files').addEventListener('change', handleFileSelect, false);
     $("#next").click(function(){
     	if(filesNumber == 0){
     		alert("Please select files first!")
     	}else{
     		$(".content-edit").hide();
     		$(".cont").addClass("animated slideInRight").show();
			processFiles(files);
     	}
     });
     $("#next2").click(function(){
     	$(".cont").hide();
     	$(".chart-display").addClass("animated slideInRight").show();
     });
})
