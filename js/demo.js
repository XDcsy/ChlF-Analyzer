
$(function(){
	var filesNumber = 0;
	$("#sel").click(function(){
		$("#files").click();
	});
	function ableBtn() {
        $("#sel").removeClass("btn-disabled");
        $("#sel").html("Add more files");
        $("#next").removeClass("btn-disabled");
        $("#next").html("Continue");
	}
	function handleFileSelect(evt) {
	    var files = evt.target.files;
	    for (var i = 0, f; f = files[i]; i++) {
	        filesNumber++;
  		}
		$("#sel").addClass("btn-disabled");
		$("#next").addClass("btn-disabled");
		$("#next").html("Processing");
		setTimeout(processFiles, 500, files, ableBtn);  //设置延时使能够显示processing效果
    }
     document.getElementById('files').addEventListener('change', handleFileSelect, false);
     $("#next").click(function(){
     	if(filesNumber == 0){
     		alert("Please select files first!")
     	}else{
     		$("#copyright").hide();
			$(".content-edit").hide();
     		$(".cont").addClass("animated slideInRight").show();
     	}
     });
     $("#next2").click(function(){
     	if (!index) {
            alert("Please brush at least one range.")
		}else{
			$(".cont").hide();
     	    $(".chart-display").addClass("animated slideInRight").show();
		}
     });
})
