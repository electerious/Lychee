# Lychee

#### A great looking and easy-to-use Photo-Management-System.

![Lychee](http://l.electerious.com/uploads/big/13582806160093.png)
![Lychee](http://l.electerious.com/uploads/big/13582805615704.png)

Lychee is a free, easy to use and great looking photo-management-system you can run on your server to manage and share photos. Just download the source and follow the instructions to install Lychee wherever you want.

## Installation

To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database. Follow the instructions to install Lychee on your server. [Installation &#187;](https://github.com/electerious/Lychee/wiki/Installation)

## Settings

Settings are located inside the `php/config.php`. All settings are optional and doesn't need to be changed. [Settings &#187;](https://github.com/electerious/Lychee/wiki/Settings)

If you experience problems uploading large amounts of photos, you might want to change the PHP parameters in `.htaccess` (if you are using the PHP Apache module) or in `.user.ini` (if you are using PHP >= 5.3 with CGI or FastCGI).

## How to use

After the configuration, navigate your browser to the place where Lychee is located. Everything should work now.

#### FTP Upload

You can upload photos directly with every FTP client into Lychee. This feature helps you to share single images quickly with others. [FTP Upload &#187;](https://github.com/electerious/Lychee/wiki/FTP-Upload)

#### Keyboard Shortcuts

This shortcuts will help you to use Lychee even faster. [Keyboard Shortcuts &#187;](https://github.com/electerious/Lychee/wiki/Keyboard-Shortcuts)

## Browser Support

Lychee supports the latest versions of Google Chrome, Apple Safari, Mozilla Firefox and Opera. Photos you share with others can be viewed from every browser. For the best experience we are recommending to use Google Chrome or Apple Safari.

## Update

####From version 1.0/1.1/1.2 to 1.3:  
1. Replace all files, excluding `uploads/`  
2. Open `php/config.php` and reconfigure your installation  
3. Open `php/update.php` in your browser  

## Troubleshooting

If Lychee is not working properly, try to open `php/check.php`. This file will take a look at your configuration and displays all errors it can find. Everything should work if you can see the message "Lychee is ready!".

## About

Lychee is made by [Tobias Reich](http://electerious.com) (HTML, CSS, JS, Design, Website Design and Development) with the help of [Philipp Maurer](http://phinal.net) (PHP, MySQL).

##License

(MIT License)

Copyright (C) 2013 [Tobias Reich](http://electerious.com)
Copyright (C) 2013 [Philipp Maurer](http://phinal.net)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.SE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.