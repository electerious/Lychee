# Dump of table lychee_albums
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `?` (
  `id` bigint(14) unsigned NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(1000) DEFAULT '',
  `sysstamp` int(11) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `downloadable` tinyint(1) NOT NULL DEFAULT '0',
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;