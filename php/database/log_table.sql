# Dump of table lychee_log
# Version 2.5
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `{prefix}_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` int(11) NOT NULL,
  `type` varchar(11) NOT NULL,
  `function` varchar(100) NOT NULL,
  `line` int(11) NOT NULL,
  `text` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
