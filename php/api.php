<?php

/**
 * @name        api.php
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

if((isset($_POST["function"])&&$_POST["function"]!="")||(isset($_GET["function"])&&$_GET["function"]!="")) {

    session_start();
    include("array2json.php");
    include("functions.php");

    // Security
    if(isset($_POST["albumID"])&&($_POST["albumID"]==""||$_POST["albumID"]<0)) exit("Wrong parameter type for 'albumID'!");
    if(isset($_POST["photoID"])&&$_POST["photoID"]=="") exit("Wrong parameter type for 'photoID'!");

    if($_SESSION["login"]==true) {

		//Connect to DB
		dbConnect();

		// Album Functions
		if($_POST["function"]=="getAlbums") echo array2json(getAlbums());
		if($_POST["function"]=="getSmartInfo") echo array2json(getSmartInfo());
		if($_POST["function"]=="addAlbum"&&isset($_POST["title"])) echo addAlbum($_POST["title"]);
		if($_POST["function"]=="getAlbumInfo"&&isset($_POST["albumID"])) echo array2json(getAlbumInfo($_POST["albumID"]));
		if($_POST["function"]=="setAlbumTitle"&&isset($_POST["albumID"])&&isset($_POST["title"])) echo setAlbumTitle($_POST["albumID"], $_POST["title"]);
		if($_POST["function"]=="deleteAlbum"&&isset($_POST["albumID"])&&isset($_POST["delAll"])) echo deleteAlbum($_POST["albumID"], $_POST["delAll"]);
		if($_GET["function"]=="getAlbumArchive"&&isset($_GET["albumID"])) getAlbumArchive($_GET["albumID"]);
		
		// Photo Functions
		if($_POST["function"]=="getPhotos"&&isset($_POST["albumID"])) echo array2json(getPhotos($_POST["albumID"]));
		if($_POST["function"]=="getPhotoInfo"&&isset($_POST["photoID"])) echo array2json(getPhotoInfo($_POST["photoID"]));
		if($_POST["function"]=="movePhoto"&&isset($_POST["photoID"])&&isset($_POST["albumID"])) echo movePhoto($_POST["photoID"], $_POST["albumID"]);
		if($_POST["function"]=="deletePhoto"&&isset($_POST["photoID"])) echo deletePhoto($_POST["photoID"]);
		if($_POST["function"]=="setPhotoTitle"&&isset($_POST["photoID"])&&isset($_POST["title"])) echo setPhotoTitle($_POST["photoID"], $_POST["title"]);
		if($_POST["function"]=="setPhotoStar"&&isset($_POST["photoID"])) echo setPhotoStar($_POST["photoID"]);
		if($_POST["function"]=="setPhotoPublic"&&isset($_POST["photoID"])&&isset($_POST["url"])) echo setPhotoPublic($_POST["photoID"], $_POST["url"]);
		if($_POST["function"]=="setPhotoDescription"&&isset($_POST["photoID"])&&isset($_POST["description"])) echo setPhotoDescription($_POST["photoID"], $_POST["description"]);
		if($_POST["function"]=="sharePhoto"&&isset($_POST["photoID"])&&isset($_POST["url"])) echo array2json(sharePhoto($_POST["photoID"], $_POST["url"]));
		if($_POST["function"]=="previousPhoto"&&isset($_POST["photoID"])&&isset($_POST["albumID"])) echo array2json(previousPhoto($_POST["photoID"], $_POST["albumID"]));
		if($_POST["function"]=="nextPhoto"&&isset($_POST["photoID"])&&isset($_POST["albumID"])) echo array2json(nextPhoto($_POST["photoID"], $_POST["albumID"]));
                
        // Upload Function
		if($_POST["function"]=="upload"&&isset($_FILES)&&isset($_POST["albumID"])) echo upload($_FILES, $_POST["albumID"]);
		
		// Search Function
		if($_POST["function"]=="search"&&isset($_POST["term"])) echo array2json(search($_POST["term"]));
		
		// Sync Function
		if($_POST["function"]=="syncFolder") echo syncFolder();
                
		// Session Functions
		if($_POST["function"]=="logout") logout();
		if($_POST["function"]=="loggedIn") echo true;

   } else {
   
		dbConnect();
		
		// Photo Functions
	    if($_POST["function"]=="getPhotoInfo"&&isset($_POST["photoID"])&&isPhotoPublic($_POST["photoID"])) echo array2json(getPhotoInfo($_POST["photoID"]));
	
	    // Session Functions
	    if($_POST["function"]=="login") echo login($_POST['user'], $_POST['password']);
	    if($_POST["function"]=="loggedIn") echo false;
		  		
   }

} else echo "Error: No permission!";

?>