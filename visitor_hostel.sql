SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `admin` (
  `id` Int(5) NOT NULL,
  `name` varchar(20) NOT NULL,
  `pass` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `admin` (`id`, `name`, `pass`) VALUES
('1' , 'admin', 'admin');

CREATE TABLE `bookingstatus` (
  `email` varchar(40) NOT NULL,
  `category` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `occupancy` int(11) NOT NULL,
  `mealplan` varchar(20) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `bookingstatus` (`email`, `category`, `type`, `occupancy`, `mealplan`, `status`, `date`) VALUES
('yg@yg.com', 'Visitor', 'Double Bed', 2, 'Full', 0, '2020-05-03');

CREATE TABLE `category` (
  `name` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `available` int(11) NOT NULL,
  `img` varchar(50) NOT NULL,
  `dec` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `category` (`name`, `type`, `cost`, `available`, `img`, `dec`) VALUES
('Event Guest', 'Double Bed', 500, 11, '/img/rooms/room1.jpg', 'AC Room'),
('Event Guest', 'Single Bed', 400, 10, '/img/rooms/room1.jpg', 'Non AC Room'),
('Visitor', 'Double Bed', 1200, 9, '/img/rooms/room2.jpg', 'AC Room'),
('Visitor', 'Single Bed', 900, 9, '/img/rooms/room2.jpg', 'Non AC Room'),
('Faculty', 'Double Bed', 250, 10, '/img/rooms/room3.jpg', 'AC Room'),
('Faculty', 'Single Bed', 150, 5, '/img/rooms/room3.jpg', 'Non AC Room'),
('Parent/Gaurdian', 'Double Bed', 600, 6, '/img/rooms/room4.jpg', 'AC Room'),
('Parent/Gaurdian', 'Single Bed', 400, 12, '/img/rooms/room4.jpg', 'Non AC Room');

CREATE TABLE `user` (
  `name` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `password` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `user` (`name`, `email`, `phone`, `password`) VALUES
('admin', 'admin@admin.com', '0123456789', '1'),
('yg', 'yg@yg.com', '2345678901', 'yg'),
('np', 'np@np.com', '4567890123', 'np');

ALTER TABLE `admin` ADD PRIMARY KEY(`id`);

ALTER TABLE `bookingstatus`
  ADD PRIMARY KEY (`email`,`category`,`type`,`occupancy`,`mealplan`,`date`);

ALTER TABLE `category`
  ADD PRIMARY KEY (`name`,`type`,`cost`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`email`);

ALTER TABLE `bookingstatus`
  ADD CONSTRAINT `fk_01` FOREIGN KEY (`email`) REFERENCES `user` (`email`);
COMMIT;

