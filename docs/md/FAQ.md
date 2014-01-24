#### Lychee is not working
If Lychee is not working properly, try to open `plugins/check.php`. This script will display all errors it can find. Everything should work if you can see the message "Lychee is ready. Lets rock!".

#### What do I need to run Lychee on my server?
To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

#### I can't upload multiple photos at once
If you experience problems uploading large amounts of photos, you might want to change the PHP parameters in `.htaccess` (if you are using the PHP Apache module) or in `.user.ini` (if you are using PHP >= 5.3 with CGI or FastCGI).
If possible, change these settings directly in your `php.ini`. We recommend to increase the values of the following properties:

	max_execution_time = 200
	post_max_size = 200M
	upload_max_size = 200M
	upload_max_filesize = 20M
	max_file_uploads = 100

#### Which browsers are supported?
Lychee supports the latest versions of Google Chrome, Apple Safari, Mozilla Firefox and Opera. Photos you share with others can be viewed from every browser.

#### How can I set thumbnails for my albums?
Thumbnails are chosen automatically by the photos you have starred and in the order you uploaded them. Star a photo inside a album to set it as an thumbnail.

#### What is new?
Take a look at the [Changelog](Changelog.md) to see whats new.

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
	
#### How to update?

1. Replace all files, excluding `uploads/`
2. Open Lychee and enter your database details

#### Can I upload videos?
No. Video support is not planned.