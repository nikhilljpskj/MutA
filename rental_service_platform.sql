-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 21, 2024 at 03:43 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rental_service_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(6, 'Electronic Gadget', '2024-09-19 11:11:51'),
(8, 'Automobiles', '2024-09-19 11:26:21'),
(9, 'Sports', '2024-09-19 11:27:00'),
(10, 'Clothing', '2024-09-19 12:28:43'),
(11, 'Tools', '2024-09-19 12:38:18'),
(12, 'Books', '2024-09-19 12:39:37'),
(13, 'Stationery', '2024-09-19 12:40:56'),
(14, 'Furniture', '2024-09-19 12:41:26'),
(15, 'Ornaments', '2024-09-19 12:42:52'),
(16, 'Baby Products', '2024-09-19 12:44:24'),
(17, 'Properties', '2024-09-19 12:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) NOT NULL,
  `payment_method` enum('credit_card','paypal','stripe') NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` varchar(20) NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `availability` tinyint(1) DEFAULT 1,
  `stock` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `sub_category_id`, `price_per_day`, `availability`, `stock`, `created_at`, `updated_at`) VALUES
(3, 'Demo3', 'H Demo', 11, '21', '1900.00', 127, 10004, '2024-09-19 18:05:48', '2024-09-19 18:36:40'),
(5, 'Demo3', 'Des', 14, '35', '33.00', 127, 3333, '2024-09-19 18:13:24', '2024-09-19 18:43:42'),
(6, 'Demo3', 'Se', 15, '40', '222.00', 127, 222, '2024-09-19 18:16:30', '2024-09-19 18:16:30'),
(7, 'Demo', 'ki', 10, '18', '23.00', 127, 200, '2024-09-19 18:18:27', '2024-09-19 18:18:27'),
(8, 'Demo3', 'Retro', 16, '45', '200.00', 127, 300, '2024-09-19 18:19:45', '2024-09-19 18:19:45'),
(9, 'Demo3', 'VD', 6, '2', '220.00', 127, 222, '2024-09-19 18:20:47', '2024-09-19 18:20:47');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `created_at`) VALUES
(3, 3, '/uploads/products/1726769148356-White Minimalist Profile LinkedIn Banner.jpg', '2024-09-19 18:05:48'),
(5, 5, '/uploads/products/1726769604701-Capture.PNG', '2024-09-19 18:13:24'),
(6, 6, '/uploads/products/1726769790184-Untitled Project (1) (2).jpg', '2024-09-19 18:16:30'),
(7, 7, '/uploads/products/1726769907738-WhatsApp Image 2023-10-11 at 4.57.19 PM.jpeg', '2024-09-19 18:18:27'),
(8, 8, '/uploads/products/1726769985515-DSC_0313.JPG', '2024-09-19 18:19:45'),
(9, 9, '/uploads/products/1726770047050-Your paragraph text.png', '2024-09-19 18:20:47'),
(10, 9, '/uploads/products/1726770047051-Capture-removebg-preview.png', '2024-09-19 18:20:47'),
(11, 9, '/uploads/products/1726770047052-Capture.PNG', '2024-09-19 18:20:47'),
(15, 3, '/uploads/products/1726769148356-White Minimalist Profile LinkedIn Banner.jpg', '2024-09-19 18:36:40');

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `category_id`, `created_at`) VALUES
(1, 'Cricket', 9, '2024-09-19 13:07:00'),
(2, 'Audio Systems', 6, '2024-09-19 13:18:24'),
(3, 'Gaming Accessories', 6, '2024-09-19 13:18:24'),
(4, 'Computer Accessories', 6, '2024-09-19 13:18:24'),
(5, 'Cameras', 6, '2024-09-19 13:18:24'),
(6, 'Drones', 6, '2024-09-19 13:18:24'),
(7, 'Cars', 8, '2024-09-19 13:18:24'),
(8, 'Motorbikes', 8, '2024-09-19 13:18:24'),
(9, 'Trucks and Vans', 8, '2024-09-19 13:18:24'),
(10, 'Recreational Vehicles', 8, '2024-09-19 13:18:24'),
(11, 'Luxury and Sports Cars', 8, '2024-09-19 13:18:24'),
(12, 'Water Sports', 9, '2024-09-19 13:18:24'),
(13, 'Winter Sports', 9, '2024-09-19 13:18:24'),
(14, 'Outdoor Adventure Gear', 9, '2024-09-19 13:18:24'),
(15, 'Cycling Gear', 9, '2024-09-19 13:18:24'),
(16, 'Sports Gear', 9, '2024-09-19 13:18:24'),
(17, 'Formal Wear', 10, '2024-09-19 13:18:24'),
(18, 'Themed Costumes', 10, '2024-09-19 13:18:24'),
(19, 'Outdoor and Adventure Wear', 10, '2024-09-19 13:18:24'),
(20, 'Activewear', 10, '2024-09-19 13:18:24'),
(21, 'Home Improvement Tools', 11, '2024-09-19 13:18:24'),
(22, 'Gardening Tools', 11, '2024-09-19 13:18:24'),
(23, 'Construction Tools', 11, '2024-09-19 13:18:24'),
(24, 'Automotive Tools', 11, '2024-09-19 13:18:24'),
(25, 'Woodworking Tools', 11, '2024-09-19 13:18:24'),
(26, 'Painting and Decorating Tools', 11, '2024-09-19 13:18:24'),
(27, 'Fiction Books', 12, '2024-09-19 13:18:24'),
(28, 'Non-Fiction Books', 12, '2024-09-19 13:18:24'),
(29, 'Children’s Books', 12, '2024-09-19 13:18:24'),
(30, 'Textbooks', 12, '2024-09-19 13:18:24'),
(31, 'Notebooks', 13, '2024-09-19 13:18:24'),
(32, 'Pens and Pencils', 13, '2024-09-19 13:18:24'),
(33, 'Art Supplies', 13, '2024-09-19 13:18:24'),
(34, 'Paper', 13, '2024-09-19 13:18:24'),
(35, 'Living Room Furniture', 14, '2024-09-19 13:18:24'),
(36, 'Bedroom Furniture', 14, '2024-09-19 13:18:24'),
(37, 'Outdoor Furniture', 14, '2024-09-19 13:18:24'),
(38, 'Office Furniture', 14, '2024-09-19 13:18:24'),
(39, 'Kitchen Furniture', 14, '2024-09-19 13:18:24'),
(40, 'Rings', 15, '2024-09-19 13:18:24'),
(41, 'Necklaces', 15, '2024-09-19 13:18:24'),
(42, 'Bracelets', 15, '2024-09-19 13:18:24'),
(43, 'Earrings', 15, '2024-09-19 13:18:24'),
(44, 'Watches', 15, '2024-09-19 13:18:24'),
(45, 'Baby Clothing', 16, '2024-09-19 13:18:24'),
(46, 'Baby Toys', 16, '2024-09-19 13:18:24'),
(47, 'Baby Furniture', 16, '2024-09-19 13:18:24'),
(48, 'Baby Care Products', 16, '2024-09-19 13:18:24'),
(49, 'Residential Properties', 17, '2024-09-19 13:18:24'),
(50, 'Commercial Properties', 17, '2024-09-19 13:18:24'),
(51, 'Land', 17, '2024-09-19 13:18:24'),
(52, 'Rental Properties', 17, '2024-09-19 13:18:24'),
(53, 'Bus', 8, '2024-09-19 13:52:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `is_admin`, `created_at`) VALUES
(1, 'Suseela KJ', 'akhil@gmail.com', '$2a$10$/G2SoMrUwkYtJxFsWUoXwO8lcp9qb80qr5dMpulMDGkkucrVvrjeu', '8921652221', 'Prakash Bhavanam', 1, '2024-09-18 19:34:53'),
(5, 'Akhil PRAKASH', 'nikhiljp.skj@gmail.com', '$2a$10$o5u4d8wxJ.FIuqhu5kpU4OsQRQ4OcpBQMJFuh0vl2yHpnufYWg0Ja', '08921534017', 'Prakash Bhavanam, Aickadu, Kodumon PO', 2, '2024-09-18 20:32:55'),
(6, 'Nikhil PRAKASH', 'ahan@gmail.com', '$2a$10$WfW9fszSSF90GyiMSZ7RTOLrCQ1oIvCcvd07zPwU8QNuwV6I9dBw6', '08921652221', 'Billing Address, AICKADU, KODUMON P.O', 2, '2024-09-18 20:52:37'),
(7, 'Nikhil Prakash', 'ertyui@gmail.com', '$2a$10$MC3zo/Cb6TpEnMBWXT7KPOtI7k7/vKe094JyLbsRopmO4BJrVbpTS', '7560879155', 'Prakash Bhavanam', 2, '2024-09-18 21:57:33'),
(8, 'NIKHIL PRAKASH', 'nikhilkodumon@gmail.com', '', NULL, NULL, 2, '2024-09-20 09:14:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
