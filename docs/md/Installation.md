### 1. Requirements
Everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

### 2. PHP configuration `php.ini`

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
	
### 3. Download

The easiest way to download Lychee is with `git`:

	git clone https://github.com/electerious/Lychee.git
	
You can also use the [direct download](https://github.com/electerious/Lychee/archive/master.zip).

### 4. Permissions

Change the permissions of `uploads/` and `data/` to 777, including all subfolders:

	chmod -R 777 uploads/ data/

### 5. Finish

Open Lychee in your browser and follow the given steps.
If you have trouble, take a look at the [FAQ](FAQ.md).