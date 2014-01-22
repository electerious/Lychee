### Requirements
Everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

### PHP configuration `php.ini`

The following extensions must be activated:

	extension = php_mbstring.dll
	extension = php_exif.dll
	extension = php_gd2.dll

To use Lychee without restrictions, we recommend to increase the values of the following properties:

	max_execution_time = 200
	post_max_size = 200M
	upload_max_size = 200M
	upload_max_filesize = 20M
	max_file_uploads = 100

### Folder permissions

Change the permissions of `uploads/` and `php/` to 777, including all subfolders:

	chmod -R 777 uploads/ php/

### Lychee installation

Open Lychee in your browser and follow the given steps.
If you have trouble, take a look at the [FAQ](FAQ.md).