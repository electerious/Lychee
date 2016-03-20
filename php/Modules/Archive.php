<?php

namespace Lychee\Modules;

use ZipArchive;

final class Archive {

	private $zipTitle;
	private $tempZipFile;
	private $listOfFiles;

	public function __construct($zipTitle = 'untitled') {
		$this->zipTitle = (string)$zipTitle;
		$this->tempZipFile = tempnam(sys_get_temp_dir(), 'Lychee_');
	}

	public function sendToClient() {
		$this->createZip();

		// Send zip
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=\"$this->zipTitle.zip\"");
		header("Content-Length: " . filesize($this->tempZipFile));
		readfile($this->tempZipFile);

	}

	public function destroy() {
		if (is_file($this->tempZipFile)) unlink($this->tempZipFile);
	}


	static public function getPhotoSelection($photoIDs) {
		$zip = new Archive('lychee_photo_selection');

		if (is_array($photoIDs))
			$photoIDs = implode(',', array_map('intval', $photoIDs));

		// Only check the photo visibility for guests
		if ($_SESSION['login'] === true) {
			$query = Database::prepare(Database::get(), "SELECT `url` FROM ? WHERE `id` IN (?);", array(LYCHEE_TABLE_PHOTOS, $photoIDs));
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			while ($photo = $result->fetch_object())
				$zip->addFileToZip(LYCHEE_UPLOADS_BIG . $photo->url);
		}
		else {
			$query = Database::prepare(Database::get(), "SELECT p.`url`, p.`public`, a.`public` album_public FROM ? p LEFT JOIN ? a ON p.`album` = a.`id` WHERE p.`id` in (?);", array(LYCHEE_TABLE_PHOTOS, LYCHEE_TABLE_ALBUMS, $photoIDs));
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			while ($photo = $result->fetch_object()) {
				if ($photo->public === 1 || $photo->album_public === 1)
					$zip->addFileToZip(LYCHEE_UPLOADS_BIG . $photo->url);
			}
		}

		$zip->sendToClient();
		$zip->destroy();
		die;
	}


	private function addFileToZip($filename) {
		if (is_readable($filename)) $this->listOfFiles[] = $filename;
	}

	private function createZip() {
		if (empty($this->listOfFiles)) Response::error('Nothing to ZIP!');

		$zip = new ZipArchive();
		if ($zip->open($this->tempZipFile, ZIPARCHIVE::CREATE | ZIPARCHIVE::OVERWRITE)!==true) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not create ZipArchive');
			Response::error('Could not create ZipArchive!');
			return false;
		}

		foreach ($this->listOfFiles AS $file)
			$zip->addFile($file, basename($file));

		$zip->close();
	}


}