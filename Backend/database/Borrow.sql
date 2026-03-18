-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 15, 2026 at 05:02 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `Borrow`
--

CREATE TABLE `Borrow` (
  `borrow_id` int NOT NULL,
  `borrow_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Borrow`
--

INSERT INTO `Borrow` (`borrow_id`, `borrow_date`, `due_date`, `return_date`, `user_id`, `book_id`) VALUES
(207, '2026-03-15', '2026-03-29', '2026-03-17', 1, 104),
(208, '2026-03-15', '2026-03-29', '2026-03-17', 1, 104),
(209, '2026-03-15', '2026-03-29', '2026-03-17', 1, 104),
(210, '2026-03-15', '2026-03-29', '2026-03-17', 1, 104),
(211, '2026-03-15', '2026-03-29', '2026-03-17', 1, 104),
(212, '2026-03-15', '2026-03-29', '2026-03-20', 1, 104),
(213, '2026-03-15', '2026-03-29', '2026-03-17', 1, 102),
(214, '2026-03-15', '2026-03-29', '2026-03-20', 1, 102),
(215, '2026-03-15', '2026-03-29', NULL, 2, 102),
(216, '2026-03-15', '2026-03-29', NULL, 1, 101),
(217, '2026-03-15', '2026-03-29', NULL, 2, 102),
(218, '2026-03-15', '2026-03-29', NULL, 2, 102),
(219, '2026-03-15', '2026-03-29', NULL, 2, 102),
(220, '2026-03-15', '2026-03-29', NULL, 1, 101),
(221, '2026-03-15', '2026-03-29', NULL, 1, 104),
(222, '2026-03-15', '2026-03-29', '2026-03-23', 1, 102);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Borrow`
--
ALTER TABLE `Borrow`
  ADD PRIMARY KEY (`borrow_id`),
  ADD KEY `index_user_id` (`user_id`),
  ADD KEY `index_book_id` (`book_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Borrow`
--
ALTER TABLE `Borrow`
  MODIFY `borrow_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
