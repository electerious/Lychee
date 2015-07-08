# Dump of table lychee_sessions
# ------------------------------------------------------------
--
-- Table structure for table `lychee_sessions`
--

DROP TABLE IF EXISTS `lychee_sessions`;
CREATE TABLE `lychee_sessions` (
      `value` varchar(40) DEFAULT NULL,
      `expires` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

