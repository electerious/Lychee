# Lychee

#### A great looking and easy-to-use Photo-Management-System.

![Lychee](http://l.electerious.com/uploads/big/136b4779d133a94666d5f0d151b8ea2f.png)
![Lychee](http://l.electerious.com/uploads/big/580f1300f884c330fa34b652decb0571.png)

Lychee is a free photo-management tool, which runs on your server or web-space. Installing is a matter of seconds. Upload, manage and share photos like from a native application. Lychee comes with everything you need and all your photos are stored securely. Try the [Live Demo](http://electerious.com/lychee_demo/) or read more on our [Website](http://lychee.electerious.com).

## Installation

To run Lychee, everything you need is a web-server with PHP 5.3 or later and a MySQL-Database. Follow the instructions to install Lychee on your server. [Installation &#187;](docs/Installation.md)

## How to use

You can use Lychee right after the installation. Here are some advanced features to get the most out of it.

### Settings

Sign in and click the gear on the top left corner to change your settings. If you want to edit them manually: MySQL details are stored in `data/config.php`. Other options and hidden settings are stored directly in the database. [Settings &#187;](docs/Settings.md)

### Update

Updating is as easy as it should be.  [Update &#187;](docs/Update.md)

### Build

Lychee is ready to use, right out of the box. If you want to contribute and edit CSS or JS files, you need to rebuild Lychee. [Build &#187;](docs/Build.md)

### Keyboard Shortcuts

These shortcuts will help you to use Lychee even faster. [Keyboard Shortcuts &#187;](docs/Keyboard Shortcuts.md)

### Dropbox import

In order to use the Dropbox import from your server, you need a valid drop-ins app key from [their website](https://www.dropbox.com/developers/apps/create). Lychee will ask you for this key, the first time you try to use the import. Want to change your code? Take a look at [the settings](docs/Settings.md) of Lychee.

### Twitter Cards

Lychee supports [Twitter Cards](https://dev.twitter.com/docs/cards) and [Open Graph](http://opengraphprotocol.org) for shared images (not albums). In order to use Twitter Cards you need to request an approval for your domain. Simply share an image with Lychee, copy its link and paste it in [Twitters Card Validator](https://dev.twitter.com/docs/cards/validation/validator).

### Plugins and Extensions

The plugin-system of Lychee allows you to execute scripts, when a certain action fires. Plugins are hooks, which are injected directly into Lychee. [Plugin documentation &#187;](docs/Plugins.md)

It's also possible to build extensions upon Lychee. The way to do so isn't documented and can change every time. We recommend to use the plugin-system, when possible.

Here's a list of all available Plugins and Extensions:

| Name | Description | |
|:-----------|:------------|:------------|
| lycheesync | Sync Lychee with any directory containing photos | [More &#187;](https://github.com/GustavePate/lycheesync) |
| lycheeupload | Upload photos to Lychee via SSH | [More &#187;](https://github.com/r0x0r/lycheeupload) |
| Jekyll | Liquid tag for Jekyll sites that allows embedding Lychee albums | [More &#187;](https://gist.github.com/tobru/9171700) |
| lychee-redirect | Redirect from an album-name to a Lychee-album | [More &#187;](https://github.com/electerious/lychee-redirect) |
| lychee-watermark | Adds a second watermarked photo when uploading images | [More &#187;](https://github.com/electerious/lychee-watermark) |
| lychee-rss | Creates a RSS-Feed out of your photos | [More &#187;](https://github.com/cternes/Lychee-RSS) |

## Troubleshooting

Take a look at the [FAQ](docs/FAQ.md) if you have problems. Discovered a bug? Please create an issue here on GitHub!

## Developer
| Version | Name |
|:-----------|:------------|
| 1.2, 1.3, 2.x | [Tobias Reich](http://electerious.com)|
| 1.0, 1.1 | [Tobias Reich](http://electerious.com)<br>[Philipp Maurer](http://phinal.net) |

## Donate

I am working hard on continuously developing and maintaining Lychee. Please consider making a donation via [Flattr](https://flattr.com/submit/auto?user_id=electerious&url=http%3A%2F%2Flychee.electerious.com&title=Lychee&category=software) or PayPal (from [our site](http://lychee.electerious.com/)) to keep the project going strong and me motivated.

## License

(MIT License)

Copyright (C) 2014 [Tobias Reich](http://electerious.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
