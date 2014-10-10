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
