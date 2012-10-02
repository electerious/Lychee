/**
 * @name        upload.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

var global_progress = new Array(),
	last_final_progress = 0;

function handleFiles(files) {

    var i = 0;
    var auswahl_div = document.getElementById('auswahl');
    var imageType = /image.*/;
    var fileList = files;

    for(i = 0; i < fileList.length; i++) {
        var img = document.createElement("img");    
        img.height = 0;
        img.file = fileList[i];
        img.name = 'pic_'+ i;
        img.classList.add("obj");
        auswahl_div.appendChild(img);    
    }
    
}

function sendFiles(){

	imgs = document.querySelectorAll(".obj");
	
	$(".upload_overlay").remove();
	$("body").append(buildUploadModal());
	
	global_progress = new Array();
	last_final_progress = 0;

    for(i = 0; i < imgs.length; i++) {
    	global_progress[i] = 0;
        new FileUpload(i, imgs[i], imgs[i].file);
    }
    
}

function changeProgress(i, progress) {

	global_progress[i] = progress;
	final_progress = 0;
	
	for(i = 0; i < global_progress.length; i++) {
		final_progress += global_progress[i];
	}
	
	if (Math.round(final_progress/document.querySelectorAll(".obj").length)%2==0&&Math.round(last_final_progress/document.querySelectorAll(".obj").length)<Math.round(final_progress/document.querySelectorAll(".obj").length)) {
		$(".progressbar div").css("width", Math.round(final_progress/document.querySelectorAll(".obj").length) + "%");
	}
	
	last_final_progress = final_progress;
	
	if ((final_progress/document.querySelectorAll(".obj").length)>=100) {
	
		$(".progressbar div").css("width", "100%");
	
		$.timer(1000,function(){
	
			$(".upload_overlay").removeClass("fadeIn").css("opacity", 0);
			$.timer(300,function(){ $(".upload_overlay").remove() });
			
			if (content.attr("data-id")=="") setURL("a0");
			else loadPhotos(content.attr("data-id"));
		
		});
		
	}

}

function FileUpload(i, img, file) {

    var old_percent = 0,
		xhr = new XMLHttpRequest(),
    	fd = new FormData,
    	percent = 0;
    	
    this.xhr = xhr;

    this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) percent = Math.round((e.loaded * 100) / e.total);
        changeProgress(i, percent);
    }, false);

    fd.append("File", file);
    fd.append("function", "upload");
    if (content.attr("data-id")=="") fd.append("albumID", 0);
    else fd.append("albumID", content.attr("data-id"));
    
    xhr.open("POST", "php/api.php", true);
    xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
    xhr.send(fd);
    
}