# Lychee

#### A great looking and easy-to-use Photo-Management-System.

![Lychee](http://l.electerious.com/uploads/big/136b4779d133a94666d5f0d151b8ea2f.png)
![Lychee](http://l.electerious.com/uploads/big/580f1300f884c330fa34b652decb0571.png)

Lychee is a free photo-management tool, which runs on your server or web-space. Installing is a matter of seconds. Upload, manage and share photos like from a native application. Lychee comes with everything you need and all your photos are stored securely.

## Installation

To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database. Follow the instructions to install Lychee on your server. [Installation &#187;](docs/md/Installation.md)

## How to use

You can use Lychee right after the installation. Here are some advanced features to get the most out of it.

### Settings

Sign in and click the gear on the top left corner to change your settings. If you want to edit them manually: MySQL details are stored in `php/config.php`. Other options and settings are stored directly in the database. [Settings &#187;](docs/md/Settings.md)

### Update

1. Replace all files, excluding `uploads/`
2. Open Lychee and enter your database details

### FTP Upload

You can import photos from your server or upload photos directly with every FTP client into Lychee. [FTP Upload &#187;](docs/md/FTP Upload.md)

### Keyboard Shortcuts

These shortcuts will help you to use Lychee even faster. [Keyboard Shortcuts &#187;](docs/md/Keyboard Shortcuts.md)

### Twitter Cards

Lychee supports [Twitter Cards](https://dev.twitter.com/docs/cards) and [Open Graph](http://opengraphprotocol.org) for shared images (not albums). In order to use Twitter Cards you need to request an approval for your domain. Simply share an image with Lychee, copy its link and paste it in [Twitters Card Validator](https://dev.twitter.com/docs/cards/validation/validator).

## Troubleshooting

Take a look at the [FAQ](docs/md/FAQ.md) if you have problems.

## Extensions

| Name | Description | Link |
|:-----------|:------------|:------------|
| lycheesync | Sync Lychee with any directory containing photos | https://github.com/GustavePate/lycheesync |

## Developer
- [electerious](https://github.com/electerious) / [Tobias Reich](http://electerious.com)

## Contributors
- [phinal](https://github.com/phinal) / [Philipp Maurer](http://phinal.net)
- [cdauth](https://github.com/cdauth)

##License

(MIT License)

Copyright (C) 2014 [Tobias Reich](http://electerious.com)  
Copyright (C) 2013 [Philipp Maurer](http://phinal.net)  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
