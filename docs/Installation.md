### 1. Requirements
Everything you need is a web-server with PHP 5.5 or later and a MySQL-Database.

The following PHP extensions must be activated:

	exif, gd, json, mbstring, mysqli, zip
	
To use Lychee without restrictions, we recommend to increase the values of the following properties in `php.ini`:

	max_execution_time = 200
	post_max_size = 100M
	upload_max_size = 100M
	upload_max_filesize = 20M
	memory_limit = 256M
	
You might also take a look at [Issue #106](https://github.com/electerious/Lychee/issues/106) if you are using nginx or in the [FAQ](https://github.com/electerious/Lychee/blob/master/docs/FAQ.md#i-cant-upload-multiple-photos-at-once) if you are using CGI or FastCGI.
	
### 2. Download

The easiest way to download Lychee is with `git`:

	git clone https://github.com/electerious/Lychee.git
	
You can also use the [direct download](https://github.com/electerious/Lychee/archive/master.zip).

### 3. Permissions

Change the permissions of `uploads/`, `data/` and all their subfolders. Sufficient read/write privileges are reqiured.

	chmod -R 777 uploads/ data/

### 4. Finish

Open Lychee in your browser and follow the given steps.
If you have trouble, take a look at the [FAQ](FAQ.md).
