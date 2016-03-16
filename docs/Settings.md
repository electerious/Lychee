### Database Details

Your MySQL details are stored in `data/config.php`. This file doesn't exist until you installed Lychee. If you need to change your connection details, you can edit this file manually.



	$dbHost = Your MySQL host (in most cases you can use localhost)
	$dbUser = Your MySQL username
	$dbPassword = Your MySQL password
	$dbName = The name of the database you want to use

Fill these properties with your MySQL information. Lychee will create the database and tables for you, if they doesn't exist.

### Settings

All settings are stored in the database. You can change the properties manually, but we recommend to use the menu in Lychee. You can find this menu on the top left corner after you signed in. Some of these settings are only changeable directly in the database.

#### Login

	username = Username for Lychee (hashed)
	password = Password for Lychee (hashed)

Your photos and albums are protected by a username and password. If both rows are empty, Lychee will prompt you to set them.

#### Check For Updates

	checkForUpdates = [0|1]

If `1`, Lychee will check if you are using the latest version. The notice will be displayed beside the version-number when you sign in.

#### Album-Sorting

	sortingAlbums = ORDER BY [field] [ASC|DESC]

Substring of a MySQL query. This string will be appended to all album-related MySQL queries.

#### Photo-Sorting

	sortingPhotos = ORDER BY [field] [ASC|DESC]

Substring of a MySQL query. This string will be appended to all photo-related MySQL queries.

#### Dropbox Key

This key is required to use the Dropbox import feature from your server. Lychee will ask you for this key, the first time you try to use the import. You can get your personal drop-ins app key from [their website](https://www.dropbox.com/developers/apps/create).

	dropboxKey = Your personal App Key

#### Imagick

	imagick = [0|1]

If `1`, Lychee will use Imagick when available. Disable [Imagick](http://www.imagemagick.org) if you have problems or if you are using an outdated version. Lychee will use [GD](http://php.net/manual/en/book.image.php) when Imagick is disabled or not available.

#### Skip Duplicates on Upload

	skipDuplicates = [0|1]

Lychee will skip the upload of existing photos when actived.