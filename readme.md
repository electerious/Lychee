# Lychee

#### A great looking and easy-to-use Photo-Management-System.

![Lychee ImageView](http://lychee.electerious.com/uploads/big/13582806160093.png)
![Lychee ImageView](http://lychee.electerious.com/uploads/big/13582805615704.png)

Lychee is a free, easy to use and great looking photo-management-system you can run on your server to manage and share photos. Just download the source and follow the instructions to install Lychee wherever you want.

## Installation

To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

#### PHP configuration `php.ini`

The following extensions must be activated:

	extension = php_mbstring.dll	extension = php_exif.dll
	extension = php_gd2.dll
	
To use Lychee without restrictions, we recommend to increase the values of the following properties:

	upload_max_filesize = 100M
	max_file_uploads = 100	post_max_size = 100M

#### Folder permissions

Change the permissions of `/lychee/uploads` to 777, including all subfolders:

	chmod -R 777 lychee/uploads/

#### Lychee configuration `lychee/php/config.php`

Change the following properties with your MySQL information:

	$db = The name of the Database you want to use
	-> Lychee will create the Database for you	$dbUser = Your MySQL username  	$dbPassword = Your MySQL password	$dbHost = Your MySQL host (in most cases you can use localhost)

Your photos are protected by a username and password you need to set:

	$user = Your username for Lychee  
	$password = Your password for Lychee

This settings are optional and doesn't need to be changed:

	$thumbQuality = Photo thumbs quality
	-> Less means a inferiority quality of your thumbs, but faster loading
	-> More means a better quality of your thumbs, but slower loading
	
	$bitlyUsername = Bit.ly Username	$bitlyApi = Bit.ly API key
	-> Lychee can generate short links if this properties are set

## How to use

After the configuration, navigate your browser to the place where Lychee is located. Everything should work now. If not, try the installation again.

### FTP Upload

You can upload and share photos directly from every FTP client with Lychee. To do so, upload images to `uploads/import/` and navigate your browser to the place where Lychee is located (e.g. `http://example.com/view.php?p=filename.png`). `filename.png` must be replaced by the filename of your uploaded file. [Sample configuration](http://lychee.electerious.com/view.php?p=13657692738813).

### Keyboard Shortcuts

######Everywhere
`n` New album/photo  
`u` Upload photo  
`esc` Close/Back

######Photoview
`s` Star photo  
`i` Show information  
`f` Show photo in new tab  
`backspace` Delete photo  
`left` Previous photo  
`right` Next photo

## Browser Support

Lychee supports the latest versions of Google Chrome, Apple Safari and Mozilla Firefox. Photos you share with others can be viewed from every browser.

## About

Lychee is made by [Tobias Reich](http://electerious.com) (HTML, CSS, JS, Design, Website Design and Development) with the help of [Philipp Maurer](http://phinal.net) (PHP, MySQL).

##License

(MIT License)

Copyright (C) 2013 [Tobias Reich](http://electerious.com)  
Copyright (C) 2013 [Philipp Maurer](http://phinal.net)  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
