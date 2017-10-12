
$(function(){
	var filesNumber = 0;
	$("#sel").click(function(){
		$("#files").click();
	});
	function handleFileSelect(evt) {
	    var files = evt.target.files; // FileList对象 
	    for (var i = 0, f; f = files[i]; i++) {
	        filesNumber++;
  		}
		$("#next").addClass("btn-disabled");
		$("#next").html("Processing");
		processFiles(files);
		$("#next").removeClass("btn-disabled");
		$("#next").html("Continue");
    }
     document.getElementById('files').addEventListener('change', handleFileSelect, false);
     $("#next").click(function(){
     	if(filesNumber == 0){
     		alert("Please select files first!")
     	}else{
     		$(".content-edit").hide();
     		$(".cont").addClass("animated slideInRight").show();
     	}
     });
     $("#next2").click(function(){
     	$(".cont").hide();
     	$(".chart-display").addClass("animated slideInRight").show();
     });
})
