#### Lychee is not working
If Lychee is not working properly, try to open `plugins/Diagnostics/index.php`. This script will display all errors it can find.

#### What do I need to run Lychee on my server?
To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

#### I can't upload photos
If you experience problems uploading large photos, you might want to change the PHP parameters in `.htaccess` (if you are using the PHP Apache module) or in `.user.ini` (if you are using PHP >= 5.3 with CGI or FastCGI).

If possible, change these settings directly in your `php.ini`. We recommend to increase the values of the following properties:

	max_execution_time = 200
	post_max_size = 100M
	upload_max_size = 100M
	upload_max_filesize = 20M
	memory_limit = 256M

#### Which browsers are supported?
Lychee supports the latest versions of Google Chrome, Apple Safari, Mozilla Firefox, Opera and Microsoft Internet Explorer. Make sure you are always running the newest version.

#### Which image file formats are supported?
You can upload `*.png`, `*.jpeg` and `*.gif` photos.

#### What is new?
Take a look at the [Changelog](Changelog.md) to see what's new.

#### How can I set thumbnails for my albums?
Thumbnails are chosen automatically by the photos you have starred and in the order you uploaded them. Star a photo inside an album to set it as a thumbnail.

#### How can I backup my installation?
To backup your Lychee installation you need to do the following steps:

1. Create a copy of the whole Lychee folder  
2. Run the following MySQL Queries:  
	- CREATE TABLE lychee_albums_backup LIKE lychee_albums;
	- INSERT INTO lychee_albums_backup SELECT * FROM lychee_albums;
	- CREATE TABLE lychee_photos_backup LIKE lychee_photos;
	- INSERT INTO lychee_photos_backup SELECT * FROM lychee_photos;
	- CREATE TABLE lychee_settings_backup LIKE lychee_settings;
	- INSERT INTO lychee_settings_backup SELECT * FROM lychee_settings;

#### Can I use my existing folder-structure?
No. Lychee has it's own folder-structure and database. Please upload or import all your photos to use them.

#### Can I upload videos?
No. Video support is not planned.

#### Is it possible to create multiple users?
[No, not yet.](https://github.com/electerious/Lychee/issues/132)

#### Does Lychee use ImageMagick?
Yes. Lychee uses ImageMagick when available.

#### Blank screen when viewing a photo using iOS
There's a problem with images compressed by ImageOptim. [Read more.](https://github.com/electerious/Lychee/issues/175#issuecomment-47403992)

#### How to change the title of the site?
[#455](https://github.com/electerious/Lychee/issues/455)