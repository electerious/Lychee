SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE TABLE IF NOT EXISTS `lychee_albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  `public` TINYINT(1) DEFAULT '0',
  `password` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `lychee_photos` (
  `id` bigint(14) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(160) NOT NULL,
  `url` varchar(100) NOT NULL,
  `public` tinyint(1) NOT NULL,
  `shortlink` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `size` varchar(10) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  `systime` varchar(8) NOT NULL,
  `iso` varchar(15) NOT NULL,
  `aperture` varchar(10) NOT NULL,
  `make` varchar(20) NOT NULL,
  `model` varchar(50) NOT NULL,
  `shutter` varchar(10) NOT NULL,
  `focal` varchar(10) NOT NULL,
  `takedate` varchar(10) NOT NULL,
  `taketime` varchar(8) NOT NULL,
  `star` tinyint(1) NOT NULL,
  `thumbUrl` varchar(50) NOT NULL,
  `album` varchar(30) NOT NULL DEFAULT '0',
  `import_name` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
