# Dump of table lychee_log
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `?` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` int(11) NOT NULL,
  `type` varchar(11) NOT NULL,
  `function` varchar(100) NOT NULL,
  `line` int(11) NOT NULL,
  `text` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;