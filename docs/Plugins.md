### About

The plugin-system of Lychee allows you to execute scripts, when a certain action fires. Plugins are hooks, which are injected directly into Lychee. They only affect the back-end and can't modify the front-end.

### Use Cases

* Automatically watermark photos on upload
* Automatically set albums public
* Write metadata changes back to the original photo
* …

### How to create a plugin

1. Create a folder in `plugins/` (e.g. `plugins/ExamplePlugin/`)
2. Create an `ExamplePlugin.php` file within the new folder and add the following content:

```php
<?php

namespace ExamplePlugin;

use SplObserver;
use SplSubject;

class ExamplePlugin implements SplObserver {

	public function __construct() {

		/**
		 * Add code here if wanted
		 * __construct() will be called every time Lychee gets called
		 * Make sure this part is performant
		 */

		return true;

	}

	public function update(SplSubject $subject) {

		/**
		 * Check if the called hook is the hook you are waiting for
		 * A list of all hooks is available online
		 */

		if ($subject->action!=='Photo::add:before') return false;

		/**
		 * Do something when Photo::add:before gets called
		 * Database::get() => Database connection of Lychee
		 * Settings::get() => Settings of Lychee
		 * $subject->action => Called hook
		 * $subject->args => Params passed to the original function
		 */

		return true;

	}

}

?>
```

3. Add the class name to the database of Lychee

Select the table `lychee_settings` and add the [external fully qualified name](http://php.net/manual/en/language.namespaces.importing.php) to the value of `plugins` (e.g. `ExamplePlugin\ExamplePlugin`). Please ensure that the folder has the same name as the namespace and the file the same name as the class.

Divide multiple plugins with semicolons: `ExamplePlugin\ExamplePlugin;ExampleTwoPlugin\ExampleTwoPlugin`.

### Available hooks

##### About :before and :after
Hooks named `:before` will be executed prior to the original function.
Hooks named `:after` will be executed after the original function.

`Album::add:before` will be called when the user creates a new album in Lychee. The album doesn't exist at this moment.
`Album::add:after` will be called after the album has been created.

##### Album
These hooks are called from `php/modules/Album.php`.

| Name | Description |
|:-----------|:------------|:------------|
| Album::add:before | User adds album |
| Album::add:after |  |
| Album::get:before | User opens album |
| Album::get:after |  |
| Album::getAll:before | User opens album overview |
| Album::getAll:after |  |
| Album::getArchive:before | User downloads album |
| Album::getArchive:after |  |
| Album::setTitle:before | User renames album |
| Album::setTitle:after |  |
| Album::setDescription:before | User sets description |
| Album::setDescription:after |  |
| Album::getPublic:before | User makes album public or private |
| Album::getPublic:after |  |
| Album::setPassword:before | User sets password |
| Album::setPassword:after |  |
| Album::checkPassword:before | Lychee checks if password is correct |
| Album::checkPassword:after |  |
| Album::merge:before | User merges albums |
| Album::merge:after |  |
| Album::delete:before | User deletes album |
| Album::delete:after |  |

##### Photo
These hooks are called from `php/modules/Photo.php`.

| Name | Description |
|:-----------|:------------|:------------|
| Photo::add:before | User uploads photos |
| Photo::add:after |  |
| Photo::createThumb:before | Lychee creates thumbs |
| Photo::createThumb:after |  |
| Photo::adjustFile:before | Lychee adjusts files |
| Photo::adjustFile:after |  |
| Photo::get:before | User opens photo |
| Photo::get:after |  |
| Photo::getInfo:before | Lychee reads the metadata of an image |
| Photo::getInfo:after |  |
| Photo::getArchive:before | User downloads photo |
| Photo::getArchive:after |  |
| Photo::setTitle:before | User renames photo |
| Photo::setTitle:after |  |
| Photo::setDescription:before | User sets description |
| Photo::setDescription:after |  |
| Photo::setStar:before | User stars photo |
| Photo::setStar:after |  |
| Photo::getPublic:before | Lychee checks if photo is public |
| Photo::getPublic:after |  |
| Photo::setPublic:before | User shares photo |
| Photo::setPublic:after |  |
| Photo::setAlbum:before | User moves photo to album |
| Photo::setAlbum:after |  |
| Photo::setTags:before | User sets tags |
| Photo::setTags:after |  |
| Photo::delete:before | User deletes photo |
| Photo::delete:after |  |

##### Session
These hooks are called from `php/modules/Session.php`.

| Name | Description |
|:-----------|:------------|:------------|
| Session::init:before | Someone opens Lychee |
| Session::init:after |  |
| Session::login:before | Someone logs in |
| Session::login:after |  |
| Session::logout:before | User logs out |
| Session::logout:after |  |

##### Import
These hooks are called from `php/modules/Import.php`.

| Name | Description |
|:-----------|:------------|:------------|
| Import::server:before | User imports photos from the server |
| Import::server:after |  |