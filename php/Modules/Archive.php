<?php

namespace Lychee\Modules;

use ZipArchive;

/**
 * Allows the creation of zip archive for albums and photos.
 */
final class Archive {

	private $title;

	private $filename;

	private $zip;

	/**
	 * Creates a new zip archive in LYCHEE_DATA with given title.
	 *
	 * @param string $title the title
	 */
	public function __construct($title) {

		// Escape title
		$this->title = $this->cleanZipName($title);

		$this->filename = LYCHEE_DATA . $this->title . '.zip';

		// Create zip
		$this->zip = new ZipArchive();
		if ($this->zip->open($this->filename, ZIPARCHIVE::CREATE)!==TRUE) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not create ZipArchive');
			$this->zip = null;
		}

	}

	public function __destruct() {

		if ($this->zip!==null) $this->zip->close();

		unlink($this->filename);

	}

	/**
	 * Closes the zip file and sends it to the browser.
	 */
	public function send() {

		// Finish zip
		$this->zip->close();
		$this->zip = null;

		// Send zip
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=\"" . $this->title . ".zip\"");
		header("Content-Length: " . filesize($this->filename));
		readfile($this->filename);

	}

	/**
	 * Adds the given album including subalbums at given path to the zip archive.
	 *
	 * @param string $path the path in the zip archive
	 * @param int $albumID the id of the album
	 * @return true on success
	 */
	public function addAlbum($path, $albumID) {

		// Fetch photos
		$query = Database::prepare(Database::get(), "SELECT title, url FROM ? WHERE album = '?'", array(LYCHEE_TABLE_PHOTOS, $albumID));

		if (!$this->addPhotos($path, $query)) return false;

		// Fetch subalbums
		$query = Database::prepare(Database::get(), "SELECT id, title FROM ? WHERE parent = '?'", array(LYCHEE_TABLE_ALBUMS, $albumID));
		$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($albums===false) return false;

		// Add them recursively
		while($album = $albums->fetch_assoc()) {
			if (!$this->addAlbum($path . '/' . $this->cleanZipName($album['title']), $album['id'])) return false;
		}

		return true;

	}

	/**
	 * Adds the photos that are selected by the given query at given path to the zip archive.
	 *
	 * @param string $path the path in the zip archive
	 * @param mysqli_stmt $query the SQL query to execute
	 * @return true on success
	 */
	public function addPhotos($path, $query) {

		if ($this->zip===null) return false;

		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if (!$photos) return false;

		// Parse each path
		$files = array();
		while ($photo = $photos->fetch_object()) {

			// Parse url
			$photo->url = LYCHEE_UPLOADS_BIG . $photo->url;

			// Parse title
			$photo->title = $this->cleanZipName($photo->title);
			if (!isset($photo->title)||$photo->title==='') $photo->title = 'Untitled';

			// Check if readable
			if (!@is_readable($photo->url)) continue;

			// Get extension of image
			$extension = getExtension($photo->url, false);

			// Set title for photo
			$zipFileName = $path . '/' . $photo->title . $extension;

			// Check for duplicates
			if (!empty($files)) {
				$i = 1;
				while (in_array($zipFileName, $files)) {

					// Set new title for photo
					$zipFileName = $path . '/' . $photo->title . '-' . $i . $extension;

					$i++;

				}
			}

			// Add to array
			$files[] = $zipFileName;

			// Add photo to zip
			$this->zip->addFile($photo->url, $zipFileName);

		}

		return true;

	}

	private function cleanZipName($name) {

		// Illicit chars
		$badChars = array_merge(
			array_map('chr', range(0,31)),
			array("<", ">", ":", '"', "/", "\\", "|", "?", "*")
		);

		return str_replace($badChars, '', $name);

	}

}

?>