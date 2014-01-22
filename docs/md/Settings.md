### Database Details

Your MySQL details are stored in `php/config.php`. This file doesn't exist until you installed Lychee. If you need to change your connection details, you can edit this file manually.



	$dbHost = Your MySQL host (in most cases you can use localhost)
	$dbUser = Your MySQL username
	$dbPassword = Your MySQL password
	$dbName = The name of the database you want to use

Fill these properties with your MySQL information. Lychee will create the database and tables for you, if they doesn't exist.

### Settings

All settings are stored in the database. You can change the properties manually, but we recommend to use the menu in Lychee. You can find this menu on the top left corner after you signed in.

#### Login

	username = Username for Lychee
	password = Password for Lychee, saved as an md5 hash

Your photos and albums are protected by a username and password you need to set. If both rows are empty, Lychee will prompt you to set them. 

#### Thumb Quality

	thumbQuality = [0-100]

Less means a inferiority quality of your thumbs, but faster loading. More means a better quality of your thumbs, but slower loading. The default value is 90. The allowed values are between 0 and 100.

#### Check For Updates

	checkForUpdates = [0|1]
	
If `1`, Lychee will check if you are using the latest version. The notice will be displayed beside the version-number when you sign in.

#### Sorting

	sorting = ORDER BY [row] [ASC|DESC]

A typical part of an MySQL statement. This string will be appended to mostly every MySQL query.