# Lychee

#### A great looking and easy-to-use Photo-Management-System.

Lychee is open-source and free to use wherever you want. Just download the source and follow the instructions to install Lychee on your server.

## Installation

To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database.

#### PHP configuration `php.ini`

The following extensions must be activated:

	extension = php_mbstring.dll	extension = php_exif.dll
	extension = php_gd2.dll
	
To use Lychee without restrictions, we recommend to increase the values of the following properties:

	upload_max_filesize = 100M
	max_file_uploads = 100	post_max_size = 100M

#### MySQL configuration

Create a new Database and remember the name.
	
#### Lychee configuration `lychee/php/config.php`

Change the following properties with your MySQL information:

	$db = The name of the Database you want to use  	$dbUser = Your MySQL username  	$dbPassword = Your MySQL password

Your photos are protected by a username and password you need to set:

	$user = Your username for Lychee  
	$password = Your password for Lychee
	
Optional configuration:

	$thumbQuality = Photo thumbs quality
	-> Less means a inferiority quality of your thumbs, but faster loading
	-> More means a better quality of your thumbs, but slower loading
	
	$bitlyUsername = Bit.ly Username	$bitlyApi = Bit.ly API key
	-> Lychee can generate short links if this properties are set

## How to use

After the configuration navigate your browser to the place where Lychee is located. Everything should work now. If not, check the logs and try to fix the error.

##License

(MIT License)

Copyright (C) 2012 [Tobias Reich](http://electerious.com)  
Copyright (C) 2012 [Philipp Maurer](http://phinal.net)  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
