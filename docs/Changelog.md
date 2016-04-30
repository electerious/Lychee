## v3.1.1

Released April 30, 2016

- `New` share button when logged out (#473)
- `New` Import of IPTC photo tags (Thanks @qligier, #514)
- `New` Added reset username and password to FAQ (#500 #128)
- `Improved` Removed will-change from the main image to improve the image rendering in Chrome (#501)
- `Improved ` scroll and rendering performance by removing will-change
- `Improved` Open Facebook and Twitter sharing sheet in new window
- `Improved` EXIF and IPTC extraction (Thanks @qligier, #518)
- `Fixed` broken URL in Update.md (#516)
- `Fixed` error 500 on database connect error (Thanks @tribut, #530)

## v3.1.0

Released March 29, 2016

**Warning**: It's no longer possible to update from Lychee versions older than 2.7.

**Warning**: Plugins which use the plugin API of Lychee must be updated to work with the new back-end.

**Notice**: It's no longer possible to edit the thumb quality in the database.

**Notice**: It's no longer possible to disable the creation of medium-sized photos when Imagick is installed on the system.

This updates includes a huge rewrite of the back-end. We are now using namespaces and the singleton pattern for Settings::get(), Database::get() and Plugins::get(). Everything is way better documented thanks to PHPDoc comments. Ugly `#` comments have been replaced with the more known `//`. Unused functions are gone and returns are more strict. We also added a handy module to output messages. Failed database updates and invalid queries will be saved to the log.

- `New` Empty titles for albums
- `New` Share albums as hidden so they are only viewable with a direct link (#27)
- `New` Log failed and successful login attempts (Thanks @qligier, #382 #246)
- `Improved` error messages and log output
- `Improved` The search shows albums above photos (#434)
- `Improved` Album id now based on the current microtime (#27)
- `Improved` Back-end modules and plugins
- `Improved` Database connect function and update mechanism
- `Improved` Default photo title now "Untitled"
- `Improved` Move to next photo after after moving a picture (#437)
- `Improved` Return to album overview when canceling album password input
- `Improved` URL import now accepts photo URLs containing "?" and ":" (Thanks @qligier, #482)
- `Improved` Replaced date by strftime to simplify date translations (Thanks @qligier, #461)
- `Fixed` Missing icons in Safari 9.1
- `Fixed` duplicate uploads (Thanks @qligier, #433)
- `Fixed` incorrect escaping when using backslashes
- `Fixed` session_start() after sending headers (#433)
- `Fixed` error when deleting last open photo in album
- `Fixed` Photo sometimes not loading when visiting directly
- `Fixed` Move album, merge album and switch album/photo menus no longer show empty titles for untitled albums/photos

## v3.0.9

Released January 10, 2016

- `Improved` Disabled dragging for thumbnails
- `Improved` Avoided unnecessary devicePixelRatio checks by using srcset for all thumbnails
- `Improved` Avoided devicePixelRatio check by using srcset for the imageview image
- `Improved` Don't show log and system information when logged out (Thanks @Bramas, #421)
- `Fixed` Swipe-gestures on mobile devices

## v3.0.8

Released December 20, 2015

- `Improved` Lychee update site now with SSL (#317)
- `Improved` Set undefined vars, remove unused vars and code that cannot be reached (Thanks @mattsches, #435)

## v3.0.7

Released November 15, 2015

- Internal changes and updated dependencies
- `New` PHP-version-check now requires PHP >= 5.5
- `New` Preloading of big photos (#185)

## v3.0.6

Released September 13, 2015

- `Improved` Share photo now shares view.php link (#392)
- `Fixed` Incorrect error messages for failed uploads (#393)
- `Fixed` XSS issues and escaping problems
- `Fixed` Broken "Download album" when album has an ampersand in the password (#356)

## v3.0.5

Released August 9, 2015

- `Fixed` view.php not displaying photos

## v3.0.4

Released July 17, 2015

- `Improved` Removed bower and updated basicModal & basicContext
- `Improved` Small interface performance improvements
- `Improved` Updated all JS-files to take advantage of ES2015
- `Improved` Better error-handling for the Dropbox-, URL- and Server-Import
- `Improved` Added skipDuplicates- and identifier-check to the diagnostics
- `Fixed` error when using "Merge All" with one selected album
- `Fixed` error when saving username and password after the initial setup
- `Fixed` Clicks not recognized when using a mouse on a touchscreen-device (#345)

## v3.0.3

Released June 28, 2015

- `New` Skip duplicates on upload (#367, [How to activate](settings.md))

## v3.0.2

Released June 13, 2015

- `Improved` Permission errors are now easier to understand (#351)
- `Improved` Escape data from database before inserting into `view.php`
- `Fixed` PHP-version-check now requires PHP >= 5.3 like written in the docs

## v3.0.1

Released May 24, 2015

- `New` Album Sorting (Thanks @ophian, #98)
- `New` Identifier to prevent login of multiple Lychee-instances (#344)
- `Improved` Albums and photos now can have a title with up to 50 chars (#332)
- `Fixed` Removing last Tag from photo not possible in Firefox (#269)

## v3.0.0

Released May 6, 2015

**Warning**: You need to enter a new username and password when upgrading from a previous version. Your installation is accessible for everyone till you enter a new login by visiting your Lychee. Both fields are now stored in a secure way. Legacy md5 code has been removed.

**Warning**: Upgrading from a previous version will set *all* public albums to private. Passwords  are now stored in a secure way. Legacy md5 code has been removed.

**Warning**: We recommend to backup your database and photos before upgrading to the newest version.

**Deprecated**: Photos uploaded with Lychee v1.1 or older aren't supported anymore. Thumbnails  fail to load on high-res screens.

- `New` Redesigned interface, icons and symbols
- `New` Rewritten Front-End
- `New` Dialog system now based on [basicModal](https://github.com/electerious/basicModal)
- `New` Context-menus now based on [basicContext](https://github.com/electerious/basicContext)
- `New` Edit the sharing options of a public album
- `New` Quickly switch between albums and photos by clicking the title in the header
- `New` Renamed API functions
- `New` Merge albums (Thanks @rhurling, #340, #341, #166)
- `New` iPhone 6 Homescreen icon
- `Improved` Performance of animations
- `Improved` Prevent download of deleted albums/photos
- `Improved` Opening a private photo when logged out now shows an error
- `Improved` Reduced attribute changes to improve performance
- `Improved` Interact with the content while the sidebar stays open
- `Improved` Username and password now stored in a safer way
- `Improved` Album passwords now stored in a safer way
- `Improved` Don't refresh albums when password-input canceled by user
- `Improved` Additional Open Graph Metadata (#299)
- `Improved` Check allow_url_fopen (#302)
- `Fixed` Prevent ctrl+a from selecting the sidebar (#230)
- `Fixed` Removed unused scrolling bars in FF (#316, #289)

And much more…

## v2.7.2

Released April 13, 2015

- `Fixed` Prevented remote code execution of photos imported using "Import from URL" (Thanks Segment S.r.l)
- `Fixed` Stopped view.php from returning data of private photos

## v2.7.1

Released January 26, 2015

- `Improved` auto-login after first installation
- `Fixed` Disabled import of the medium-folder
- `Fixed` error when using apostrophes in text #290
- `Fixed` $medium is now a tinyint like defined in the database structure
- `Fixed` incorrect height calculation for photos
- `Fixed` creation of test db #295
- `Fixed` a warning caused by set_charset #291

## v2.7

Released December 6, 2014

- `New` Intermediate sized images for small screen devices #67
- `New` Added Docker help (@renfredxh, #252)
- `New` Move-Photo context shows album previews
- `Improved` Upload shows server-errors
- `Improved` Improved thumb creation
- `Improved` Docker (@renfredxh, #252)
- `Improved` CSS has been rewritten partly
- `Improved` Front-end has been rewritten partly #245
- `Improved` Folder- and code-structure has been updated
- `Improved` Context-menu now based on [basicContext](https://github.com/electerious/basicContext) #245
- `Fixed` OpenGraph image too big for some sites #69
- `Fixed` Wrong sizes after EXIF rotation
- `Fixed` Returning to 'Albums' after searching failed
- `Fixed` Move-Photo not scrollable #215

## v2.6.3

Released October 10, 2014

- `New` Caching for albums (Thanks @r0x0r, #232)
- `New` Save scroll position of albums (Thanks @r0x0r, #232)
- `New` Added Dockerfile (@renfredxh, #236)
- `Improved` Newest album on the top (Thanks @r0x0r, #232)
- `Fixed` Login in private mode (Safari)
- `Fixed` Drag & Drop with open photo
- `Fixed` Wrong modified date of the photo files
- `Fixed` Search function always returned all photos (Thanks @powentan, #234)

## v2.6.2

Released September 12, 2014

- `New` Select all albums/photos with `cmd+a` or `ctrl+a`
- `New` Detect duplicates and only save one file (#48)
- `New` Duplicate photos (#186)
- `New` Added contributing guide
- `New` Database table prefix for multiple Lychee installations (#196)
- `Improved` Use IPTC Title when Headline not available (#216)
- `Improved` Diagnostics are showing system information
- `Improved` Harden against SQL injection attacks (#38)
- `Fixed` a problem with htmlentities and older PHP versions (#212)

## v2.6.1

Released August 22, 2014

- `New` Support for IE >= 11 (#148)
- `New` Choose if public album is downloadable or not (#191)
- `Improved` Albums gradient overlay is less harsh (#200)

## v2.6

Released August 16, 2014

- `New` Rewritten and redesigned Uploader (#101)
- `New` Custom server-import directory (#187)
- `New` Plugin documentation
- `Improved` Database and installation process (#202 #195)
- `Improved` "No public albums" now easier to read (#205)
- `Fixed` Don't show EXIF info when not available (#194)

## v2.5.6

Released July 25, 2014

- `New` Choose if album should be listed public (#177)
- `New` Gulp instead of Grunt with autoprefixer
- `Improved` Slightly better performance when opening big albums
- `Improved` Checksum with sha1 instead of md5 (#179)
- `Fixed` Missing public badge on public albums
- `Fixed` Wrong path for public photos in view.php
- `Fixed` Wrong link to thumbs when searching
- `Fixed` Wrong date in album view when takestamp was null
- `Fixed` It wasn't possible to rename albums while searching
- `Fixed` It was possible to right-click on SmartAlbums after searching

## v2.5.5

Released July 5, 2014

- `New` Smart Album "Recent"
- `New` Checksum of photo in database (#48)
- `New` Show takedate in photo-overlay (when available)
- `Improved` Permission check when running with the same UID (#174)

## v2.5

Released June 24, 2014

- `New` Swipe gestures on mobile devices
- `New` Plugin-System
- `New` Rewritten Back-End
- `New` Support for ImageMagick (thanks @bb-Ricardo)
- `New` Logging-System
- `New` Blowfish hash instead of MD5 for all new passwords (thanks @bb-Ricardo)
- `New` Compile Lychee using Grunt (with npm and bower)
- `New` Open full photo without making the photo public
- `Improved` Shortcuts
- `Improved` Album share dialog
- `Improved` Database update mechanism
- `Improved` Download photos with correct title (thanks @bb-Ricardo)
- `Improved` EXIF parsing
- `Improved` URL and Server import (thanks @djdallmann)
- `Improved` Check permissions on upload
- `Fixed` Wrong capture date in Infobox
- `Fixed` Sorting by takedate

## v2.1.1

Released March 20, 2014

- `New` Delete albums with cmd + backspace
- `New` Using iOS 7.1 minimal-ui
- `Improved` Faster loading of single photos
- `Improved` Faster and snappier animations
- `Improved` Better dialog when clearing Unsorted
- `Fixed` Warning when uploading images without EXIF-Data
- `Fixed` Close upload on error

## v2.1

Released March 4, 2014

Important: You need to reenter your database credentials and set the correct rights for `data/`, when updating from a previous version.

- `New` Multi-select (#32)
- `New` Multi-folder import from server (#47)
- `New` Tagging (#5)
- `New` Import of original image name (#39)
- `New` Makefile
- `Improved` Upload-process
- `Improved` Documentation
- `Improved` Overlay for photos
- `Fixed` Dropbox import (#84)
- `Fixed` Wrong login or password annotation (#71)
- `Fixed` Escaping issue (#89)
- `Moved` Config now located in `data/`

## v2.0.3

Released February 26, 2014

- Critical security fix
- Notifications for Chrome

## v2.0.2

Released January 30, 2014

- Clear search button (#62)
- Speed improvements (#57)
- Show tooltip when album/photo title too long (#66)
- Fixed php notices
- Avoid empty downloads in empty albums (#56)
- Correct position of upload modal on mobile devices
- Improved security

## v2.0.1

Released January 24, 2014

- Share > Direct Link
- Download individual images (Issue #43)
- ContextMenu stays within the window (Issue #41)
- Prevent default ContextMenu (Issue #45)
- Small ContextMenu improvements
- Small security improvements

## v2.0

Released January 22, 2014

- All new redefined interface
- Faster animations and transitions
- Import from Dropbox
- Import from Server
- Download public albums
- Several sorting options
- Installation assistant
- Infobox and description for albums
- Faster loading and improved performance
- Better file handling and upload
- Album covers are chosen intelligent
- Prettier URLs
- Massive changes under the hood
- IPTC support (Headline and Caption)
- EXIF Orientation support
