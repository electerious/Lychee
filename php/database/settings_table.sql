# Dump of table lychee_settings
# Version 2.5
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `{prefix}_settings` (
  `key` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(200) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;